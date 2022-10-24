"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormulaDocumentEvaluationManager = void 0;
const vscode = require("vscode");
const kodeine_js_1 = require("../../engine/dist.node/kodeine.js");
const evaluation_steps_text_document_content_provider_js_1 = require("./evaluation-steps-text-document-content-provider.js");
const utils_js_1 = require("./utils.js");
/** Handles evaluating formula documents and the side effects of doing so. */
class FormulaDocumentEvaluationManager {
    constructor(extCtx, outChannel, diagColl, globalDocManager, evalTreeDocManager, parsingCtx, parser, evalCtx) {
        this._lastEvaluatedDoc = null;
        this._outChannel = outChannel;
        this._diagColl = diagColl;
        this._globalDocManager = globalDocManager;
        this._evalTreeDocManager = evalTreeDocManager;
        this._parsingCtx = parsingCtx;
        this._parser = parser;
        this._evalCtx = evalCtx;
        this._documentFormulaMap = new Map();
        this._initEvents(extCtx);
    }
    _initEvents(extCtx) {
        // react to the global list changing
        this._globalDocManager.onGlobalAdded(globalDocument => {
            this._evalCtx.globals.set(globalDocument.globalName, this._parser.parse(globalDocument.doc.getText()));
            this.reevaluateLastEvaluatedDocument();
            this.reevaluateDocumentsWithOpenEvaluationSteps();
        });
        this._globalDocManager.onGlobalRemoved(globalDocument => {
            this._evalCtx.globals.delete(globalDocument.globalName);
            this.reevaluateLastEvaluatedDocument();
            this.reevaluateDocumentsWithOpenEvaluationSteps();
        });
        this._globalDocManager.onGlobalsCleared(() => {
            this._evalCtx.globals.clear();
            this.reevaluateLastEvaluatedDocument();
            this.reevaluateDocumentsWithOpenEvaluationSteps();
        });
        extCtx.subscriptions.push(
        // register commands
        vscode.commands.registerCommand('kodeine.reevaluateLastFormula', (...args) => {
            this.reevaluateLastEvaluatedDocument();
        }), 
        // listen to document-related events
        vscode.window.onDidChangeActiveTextEditor(ev => this._reactToDocumentChange(ev?.document)), vscode.workspace.onDidChangeTextDocument(ev => this._reactToDocumentChange(ev.document, true)), vscode.workspace.onDidOpenTextDocument(doc => this._reactToDocumentChange(doc, true)), vscode.workspace.onDidSaveTextDocument(doc => this._reactToDocumentChange(doc)), vscode.workspace.onDidCloseTextDocument(doc => this._documentFormulaMap.delete(doc)) // clear cached formula on document close
        );
    }
    /** Should be called when a text document changes, is opened, is activated etc. */
    _reactToDocumentChange(document, forceReparse = false) {
        if (document
            && document.languageId === 'kode' // only evaluate kode documents
            && document.uri.scheme !== evaluation_steps_text_document_content_provider_js_1.EvaluationStepsTextDocumentContentProvider.scheme // don't evaluate evaluation steps
        ) {
            this.evaluateToOutput(document, forceReparse);
        }
    }
    /**
     * Evaluates a given kode document to the formula result output channel.
     * Also handles updating the evaluation tree, evaluation steps and dependent formulas.
     */
    evaluateToOutput(document, forceReparse = false) {
        this._evaluate(document, { forceReparse });
    }
    /** Reevaluates the most recently evaluated document, if exists. */
    reevaluateLastEvaluatedDocument() {
        if (this._lastEvaluatedDoc)
            this._evaluate(this._lastEvaluatedDoc);
    }
    /**
     * Internal implementation for evaluating a document.
     * @param forceReparse Set to true to reparse the formula, even if cached.
     * @param silentMode Set to true to disable printing to output and updating dependent formulas.
     */
    _evaluate(document, options) {
        try {
            // get formula text from the document
            let formulaText = document.getText();
            // first, we need to obtain 
            let parsedFormula;
            if ((options?.forceReparse ?? false) || !this._documentFormulaMap.has(document)) {
                // force reparse was enabled or there is no cached formula
                // parse the formula text into an evaluable formula
                parsedFormula = this._parser.parse(formulaText);
                this._documentFormulaMap.set(document, parsedFormula);
            }
            else {
                // get cached formula (if condition ensures there is one)
                parsedFormula = this._documentFormulaMap.get(document);
            }
            // load configuration
            let config = vscode.workspace.getConfiguration('kodeine', vscode.window.activeTextEditor.document.uri);
            this._evalCtx.clockMode = utils_js_1.Utils.enforceValue(kodeine_js_1.ValidClockModes, config.get('clockMode'));
            this._evalCtx.firstDayOfTheWeek = utils_js_1.Utils.enforceValue(kodeine_js_1.ValidWeekdays, config.get('firstDayOfTheWeek'), 1);
            // clear eval side effects first
            this._evalCtx.clearSideEffects();
            // try to get a global for the current document
            let globalName = this._globalDocManager.getGlobalNameFor(document);
            if (globalName) {
                // we are evaluating a document that is a global
                // add this global's name to the global name chain
                // the chain is there to prevent infinite reference loops
                this._evalCtx.sideEffects.globalNameStack.push(globalName);
                // store the parsed formula in the global
                this._evalCtx.globals.set(globalName, parsedFormula);
            }
            // evaluate the parsed formula
            let result = parsedFormula.evaluate(this._evalCtx);
            let resultOutputString = result.toOutputString();
            // count how many parsing and evaluation errors popped up
            let errCount = this._parsingCtx.sideEffects.errors.length + this._evalCtx.sideEffects.errors.length;
            if (errCount > 0) {
                // at least one error encountered, merge them in order of appearance, one per line, and show in output
                let errorMessages = [];
                // parsing error index, evaluation error index
                let pi = 0;
                let ei = 0;
                for (let i = 0; i < errCount; i++) {
                    if (pi < this._parsingCtx.sideEffects.errors.length
                        && (ei >= this._evalCtx.sideEffects.errors.length
                            || this._parsingCtx.sideEffects.errors[pi].token.getStartIndex() < this._evalCtx.sideEffects.errors[ei].evaluable.source.getStartIndex())) {
                        // parsing index is in range of parsing error list and current parsing error starts earlier than current eval error
                        errorMessages.push(this._parsingCtx.sideEffects.errors[pi].message);
                        pi++;
                    }
                    else {
                        // parsing index out of range of parsing error list or current eval error starts earlier than current parsing error
                        errorMessages.push(this._evalCtx.sideEffects.errors[ei].message);
                        ei++;
                    }
                }
                if (!(options?.silentMode)) {
                    if (resultOutputString) {
                        // there is a result besides the error messages
                        this._outChannel.replace(`${resultOutputString}\n\nFormula contains ${errCount} error${errCount === 1 ? '' : 's'}:\n${errorMessages.join('\n')}`);
                    }
                    else {
                        // no result, just error messages
                        this._outChannel.replace(errorMessages.join('\n'));
                    }
                }
            }
            else if (!(options?.silentMode)) {
                // no errors encountered, simply output the result
                this._outChannel.replace(resultOutputString);
            }
            // convert side effects to diags
            // create a list of diagnostics (warnings, errors etc.) that will replace the current list for the evaluated document
            let diags = [];
            if (this._parsingCtx.sideEffects.warnings.length > 0) {
                // got some warnings, convert to diags
                this._parsingCtx.sideEffects.warnings.forEach(warning => {
                    diags.push({
                        severity: vscode.DiagnosticSeverity.Warning,
                        range: new vscode.Range(document.positionAt(warning.tokens[0].getStartIndex()), document.positionAt(warning.tokens[warning.tokens.length - 1].getEndIndex())),
                        message: warning.message,
                        code: '', source: ''
                    });
                });
            }
            if (this._parsingCtx.sideEffects.errors.length > 0) {
                // got some errors, convert to diags
                this._parsingCtx.sideEffects.errors.forEach(error => {
                    diags.push({
                        severity: vscode.DiagnosticSeverity.Error,
                        range: new vscode.Range(document.positionAt(error.token.getStartIndex()), document.positionAt(error.token.getEndIndex())),
                        message: error.message,
                        code: '', source: ''
                    });
                });
            }
            if (this._evalCtx.sideEffects.warnings.length > 0) {
                // got some warnings, convert to diags
                this._evalCtx.sideEffects.warnings.forEach(warning => {
                    diags.push({
                        severity: vscode.DiagnosticSeverity.Warning,
                        range: new vscode.Range(document.positionAt(warning.evaluable.source.getStartIndex()), document.positionAt(warning.evaluable.source.getEndIndex())),
                        message: warning.message,
                        code: '', source: ''
                    });
                });
            }
            if (this._evalCtx.sideEffects.errors.length > 0) {
                // got some errors, convert to diags
                this._evalCtx.sideEffects.errors.forEach(error => {
                    diags.push({
                        severity: vscode.DiagnosticSeverity.Error,
                        range: new vscode.Range(document.positionAt(error.evaluable.source.getStartIndex()), document.positionAt(error.evaluable.source.getEndIndex())),
                        message: error.message,
                        code: '', source: ''
                    });
                });
            }
            // apply the created list to the problems panel
            this._diagColl.set(document.uri, diags);
            // refresh evaluation tree
            this._evalTreeDocManager.updateEvaluationTreeFor(document, this._evalCtx.sideEffects.lastEvaluationTreeNode);
            if (!(options?.silentMode)) {
                // we're not in silent mode, remember this document
                this._lastEvaluatedDoc = document;
                if (globalName) {
                    // if we're not reevaluating after another external change and this document backs a global,
                    // reevaluate all documents with open evaluation steps
                    this.reevaluateDocumentsWithOpenEvaluationSteps();
                }
            }
        }
        catch (err) {
            // unexpected error, print to output
            this._outChannel.replace('kodeine crashed: ' + err?.toString());
            // since we crashed, there is no formula to show in the tree view
        }
    }
    /**
     * Reevaluates all documents that have evaluation steps open.
     * Should be called when something in the environment changes and the evaluation result could be affected (ex. globals).
     */
    reevaluateDocumentsWithOpenEvaluationSteps() {
        vscode.workspace.textDocuments
            .filter(d => d.uri.scheme === evaluation_steps_text_document_content_provider_js_1.EvaluationStepsTextDocumentContentProvider.scheme)
            .forEach(stepsDoc => {
            let sourceDocUri = evaluation_steps_text_document_content_provider_js_1.EvaluationStepsTextDocumentContentProvider.getSourceDocUriFrom(stepsDoc.uri);
            vscode.workspace.openTextDocument(sourceDocUri).then(sourceDoc => {
                this._evaluate(sourceDoc, { silentMode: true });
            });
        });
    }
}
exports.FormulaDocumentEvaluationManager = FormulaDocumentEvaluationManager;
//# sourceMappingURL=formula-document-evaluation-manager.js.map