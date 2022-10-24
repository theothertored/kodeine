import * as vscode from 'vscode';
import {
    ParsingContext, ParsingContextBuilder,
    KodeineParser,
    EvaluationContext,
    Formula,
    FormulaEvaluationTree,
    ClockMode,
    Weekday,
    ValidClockModes,
    ValidWeekdays
} from '../../engine/dist.node/kodeine.js';
import { EvaluationTreeDocumentManager } from './evaluation-tree-document-manager.js';
import { EvaluationStepsTextDocumentContentProvider } from './evaluation-steps-text-document-content-provider.js';
import { GlobalDocumentManager } from './global-document-manager.js';
import { Utils } from './utils.js';

/** Handles evaluating formula documents and the side effects of doing so. */
export class FormulaDocumentEvaluationManager {

    private readonly outChannel: vscode.OutputChannel;
    private readonly diagColl: vscode.DiagnosticCollection;
    private readonly globalDocManager: GlobalDocumentManager;
    private readonly evalTreeDocManager: EvaluationTreeDocumentManager;

    private readonly parsingCtx: ParsingContext;
    private readonly parser: KodeineParser;
    private readonly evalCtx: EvaluationContext;

    private lastFormula: Formula | null = null;
    private lastEvaluatedDoc: vscode.TextDocument | null = null;

    constructor(
        extCtx: vscode.ExtensionContext, outChannel: vscode.OutputChannel, diagColl: vscode.DiagnosticCollection,
        globalDocManager: GlobalDocumentManager, evalTreeDocManager: EvaluationTreeDocumentManager,
        parsingCtx: ParsingContext, parser: KodeineParser, evalCtx: EvaluationContext
    ) {
        this.outChannel = outChannel;
        this.diagColl = diagColl;
        this.globalDocManager = globalDocManager;
        this.evalTreeDocManager = evalTreeDocManager;

        this.parsingCtx = parsingCtx;
        this.parser = parser;
        this.evalCtx = evalCtx;

        this._initEvents(extCtx);
    }

    private _initEvents(extCtx: vscode.ExtensionContext) {

        // react to the global list changing
        this.globalDocManager.onGlobalAdded(globalDocument => {
            this.evalCtx.globals.set(globalDocument.globalName, this.parser.parse(globalDocument.doc.getText()))
            this.reevaluateLastEvaluatedDocument();
            this.reevaluateDocumentsWithOpenEvaluationSteps();
        });

        this.globalDocManager.onGlobalRemoved(globalDocument => {
            this.evalCtx.globals.delete(globalDocument.globalName)
            this.reevaluateLastEvaluatedDocument();
            this.reevaluateDocumentsWithOpenEvaluationSteps();
        });

        this.globalDocManager.onGlobalsCleared(() => {
            this.evalCtx.globals.clear()
            this.reevaluateLastEvaluatedDocument();
            this.reevaluateDocumentsWithOpenEvaluationSteps();
        });

        // listen to document-related events
        extCtx.subscriptions.push(
            vscode.window.onDidChangeActiveTextEditor(ev => this._reactToDocumentChange(ev?.document)),
            vscode.workspace.onDidChangeTextDocument(ev => this._reactToDocumentChange(ev.document)),
            vscode.workspace.onDidOpenTextDocument(doc => this._reactToDocumentChange(doc)),
            vscode.workspace.onDidSaveTextDocument(doc => this._reactToDocumentChange(doc))
        );
    }

    /** Should be called when a text document changes, is opened, is activated etc. */
    private _reactToDocumentChange(document?: vscode.TextDocument) {

        if (
            document
            && document.languageId === 'kode'  // only evaluate kode documents
            && document.uri.scheme !== EvaluationStepsTextDocumentContentProvider.scheme // don't evaluate evaluation steps
        ) {
            this.evaluateToOutput(document);
        }

    }

    /** 
     * Evaluates a given kode document to the formula result output channel.
     * Also handles updating the evaluation tree, evaluation steps and dependent formulas.
     */
    public evaluateToOutput(document: vscode.TextDocument) {
        this._evaluate(document);
    }

    /** Reevaluates the most recently evaluated document, if exists. */
    public reevaluateLastEvaluatedDocument() {
        if (this.lastEvaluatedDoc)
            this._evaluate(this.lastEvaluatedDoc);
    }

    /**
     * Internal implementation for evaluating a document.
     * @param silentMode Setting to true disables printing to output and updating dependent formulas.
     */
    private _evaluate(document: vscode.TextDocument, silentMode: boolean = false) {

        try {

            // create a list of diagnostics (warnings, errors etc.) that will replace the current list for the evaluated document
            let diags: vscode.Diagnostic[] = [];

            // get formula text from the document
            let formulaText = document.getText();

            // load configuration
            let config = vscode.workspace.getConfiguration('kodeine', vscode.window.activeTextEditor!.document.uri);
            this.evalCtx.clockMode = Utils.enforceValue(ValidClockModes, config.get('clockMode')) as ClockMode;
            this.evalCtx.firstDayOfTheWeek = Utils.enforceValue(ValidWeekdays, config.get('firstDayOfTheWeek'), 1) as Weekday;

            // parse the formula text into an evaluable formula
            let parsedFormula = this.parser.parse(formulaText);

            // clear eval side effects first
            this.evalCtx.clearSideEffects();

            // try to get a global for the current document
            let globalName = this.globalDocManager.getGlobalNameFor(document);

            if (globalName) {

                // we are evaluating a document that is a global
                // add this global's name to the global name chain
                // the chain is there to prevent infinite reference loops
                this.evalCtx.sideEffects.globalNameStack.push(globalName);

                // store the parsed formula in the global
                this.evalCtx.globals.set(globalName, parsedFormula);
            }

            // evaluate the parsed formula
            let result = parsedFormula.evaluate(this.evalCtx);
            let resultOutputString = result.toOutputString();

            // count how many parsing and evaluation errors popped up
            let errCount = this.parsingCtx.sideEffects.errors.length + this.evalCtx.sideEffects.errors.length;

            if (errCount > 0) {

                // at least one error encountered, merge them in order of appearance, one per line, and show in output
                let errorMessages = [];

                // parsing error index, evaluation error index
                let pi = 0; let ei = 0;

                for (let i = 0; i < errCount; i++) {

                    if (
                        pi < this.parsingCtx.sideEffects.errors.length
                        && (
                            ei >= this.evalCtx.sideEffects.errors.length
                            || this.parsingCtx.sideEffects.errors[pi].token.getStartIndex() < this.evalCtx.sideEffects.errors[ei].evaluable.source!.getStartIndex()
                        )
                    ) {

                        // parsing index is in range of parsing error list and current parsing error starts earlier than current eval error
                        errorMessages.push(this.parsingCtx.sideEffects.errors[pi].message);
                        pi++

                    } else {

                        // parsing index out of range of parsing error list or current eval error starts earlier than current parsing error
                        errorMessages.push(this.evalCtx.sideEffects.errors[ei].message);
                        ei++

                    }

                }

                if (!silentMode) {

                    if (resultOutputString) {

                        // there is a result besides the error messages
                        this.outChannel.replace(`${resultOutputString}\n\nFormula contains ${errCount} error${errCount === 1 ? '' : 's'}:\n${errorMessages.join('\n')}`);

                    } else {

                        // no result, just error messages
                        this.outChannel.replace(errorMessages.join('\n'));

                    }

                }

            } else if (!silentMode) {

                // no errors encountered, simply output the result
                this.outChannel.replace(resultOutputString);

            }

            // convert side effects to diags

            if (this.parsingCtx.sideEffects.warnings.length > 0) {

                // got some warnings, convert to diags
                this.parsingCtx.sideEffects.warnings.forEach(warning => {

                    diags.push({
                        severity: vscode.DiagnosticSeverity.Warning,
                        range: new vscode.Range(
                            document.positionAt(warning.tokens[0].getStartIndex()),
                            document.positionAt(warning.tokens[warning.tokens.length - 1].getEndIndex())
                        ),
                        message: warning.message,
                        code: '', source: ''
                    });

                });

            }

            if (this.parsingCtx.sideEffects.errors.length > 0) {

                // got some errors, convert to diags
                this.parsingCtx.sideEffects.errors.forEach(error => {

                    diags.push({
                        severity: vscode.DiagnosticSeverity.Error,
                        range: new vscode.Range(
                            document.positionAt(error.token.getStartIndex()),
                            document.positionAt(error.token.getEndIndex())
                        ),
                        message: error.message,
                        code: '', source: ''
                    });

                });

            }

            if (this.evalCtx.sideEffects.warnings.length > 0) {

                // got some warnings, convert to diags
                this.evalCtx.sideEffects.warnings.forEach(warning => {

                    diags.push({
                        severity: vscode.DiagnosticSeverity.Warning,
                        range: new vscode.Range(
                            document.positionAt(warning.evaluable.source!.getStartIndex()),
                            document.positionAt(warning.evaluable.source!.getEndIndex())
                        ),
                        message: warning.message,
                        code: '', source: ''
                    });

                });

            }

            if (this.evalCtx.sideEffects.errors.length > 0) {

                // got some errors, convert to diags
                this.evalCtx.sideEffects.errors.forEach(error => {

                    diags.push({
                        severity: vscode.DiagnosticSeverity.Error,
                        range: new vscode.Range(
                            document.positionAt(error.evaluable.source!.getStartIndex()),
                            document.positionAt(error.evaluable.source!.getEndIndex())
                        ),
                        message: error.message,
                        code: '', source: ''
                    });

                });

            }

            // apply the created list to the problems panel
            this.diagColl.set(document.uri, diags);

            // refresh evaluation tree
            this.evalTreeDocManager.updateEvaluationTreeFor(document, this.evalCtx.sideEffects.lastEvaluationTreeNode as FormulaEvaluationTree);

            if (!silentMode) {

                // we're not in silent mode, remember this document and the parsed formula
                this.lastEvaluatedDoc = document;
                this.lastFormula = parsedFormula;

                if (globalName) {
                    // if we're not reevaluating after another external change, reevaluate all documents with open evaluation steps
                    this.reevaluateDocumentsWithOpenEvaluationSteps();
                }

            }

        } catch (err: any) {

            // unexpected error, print to output
            this.outChannel.replace('kodeine crashed: ' + err?.toString());

            // since we crashed, there is no formula to show in the tree view
            this.lastFormula = null;

        }

    }

    /** 
     * Reevaluates all documents that have evaluation steps open. 
     * Should be called when something in the environment changes and the evaluation result could be affected (ex. globals).
     */
    public reevaluateDocumentsWithOpenEvaluationSteps() {
        vscode.workspace.textDocuments
            .filter(d => d.uri.scheme === EvaluationStepsTextDocumentContentProvider.scheme)
            .forEach(stepsDoc => {
                let sourceDocUri = EvaluationStepsTextDocumentContentProvider.getSourceDocUriFrom(stepsDoc.uri);
                vscode.workspace.openTextDocument(sourceDocUri).then(sourceDoc => {
                    this._evaluate(sourceDoc, true);
                });
            });
    }
}