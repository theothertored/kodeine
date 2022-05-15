import * as vscode from 'vscode';
import {
    ParsingContext, ParsingContextBuilder,
    KodeineParser,
    EvaluationContext,
    Formula,
    FormulaEvaluationTree
} from '../../engine/dist.node/kodeine.js';
import { EvaluationTreeDocumentManager } from './evaluation-tree-document-manager.js';
import { EvaluationStepsTextDocumentContentProvider } from './evaluation-steps-text-document-content-provider.js';
import { EvaluationTreeDataProvider } from './evaluation-tree-data-provider.js';
import { GlobalDocumentManager } from './global-document-manager.js';

let outChannel: vscode.OutputChannel;
let diagColl: vscode.DiagnosticCollection;

let parsingCtx: ParsingContext;
let parser: KodeineParser;
let evalCtx: EvaluationContext;
let lastFormula: Formula | null;

let globalDocManager: GlobalDocumentManager;
let evalTreeDocManager: EvaluationTreeDocumentManager;

/** Activates the extension. */
export function activate(extCtx: vscode.ExtensionContext) {

    // prepare kodeine engine
    parsingCtx = ParsingContextBuilder.buildDefault();
    parser = new KodeineParser(parsingCtx);
    evalCtx = new EvaluationContext();

    // enable evaluation tree building in the context
    evalCtx.buildEvaluationTree = true;


    // create an output channel for formula results
    outChannel = vscode.window.createOutputChannel('Formula Result');
    extCtx.subscriptions.push(outChannel); // register it as disposable
    outChannel.show(true); // reveal the output channel in the UI


    // create a diagnostic collection for errors and warnings
    diagColl = vscode.languages.createDiagnosticCollection('Formula diagnostics');
    extCtx.subscriptions.push(diagColl); // register it as disposable


    extCtx.subscriptions.push(

        // register commands
        vscode.commands.registerCommand('kodeine.formulaResult', command_formulaResult),

        // listen to document-related events
        vscode.window.onDidChangeActiveTextEditor(ev => onSomethingDocumentRelated(ev?.document)),
        vscode.workspace.onDidChangeTextDocument(ev => onSomethingDocumentRelated(ev.document)),
        vscode.workspace.onDidOpenTextDocument(doc => onSomethingDocumentRelated(doc))

    );


    // initialize a global document manager to handle globals
    globalDocManager = new GlobalDocumentManager(
        extCtx, 
        parsingCtx.getOperatorSymbolsLongestFirst(),
        parsingCtx.getFunctionNames()
    );

    // react to globals changing
    globalDocManager.onGlobalAdded(globalDocument => evalCtx.globals.set(globalDocument.globalName, parser.parse(globalDocument.doc.getText())));
    globalDocManager.onGlobalRemoved(globalDocument => evalCtx.globals.delete(globalDocument.globalName));
    globalDocManager.onGlobalsCleared(() => evalCtx.globals.clear());


    // initialize an evaluation tree document manager to handle evaluation trees
    evalTreeDocManager = new EvaluationTreeDocumentManager(extCtx);


    // initialize with active editor
    onSomethingDocumentRelated(vscode.window.activeTextEditor?.document);

}

/** Should be called when a text document changes, is opened, is activated etc. */
function onSomethingDocumentRelated(document?: vscode.TextDocument) {

    if (
        document
        && document.languageId === 'kode'  // only evaluate kode documents
        && document.uri.scheme !== EvaluationStepsTextDocumentContentProvider.scheme // don't evaluate evaluation steps
    ) {

        evaluateToOutput(document);

    }
}

/** Evaluates a given kode document to the formula result output channel. */
function evaluateToOutput(document: vscode.TextDocument) {

    // create a list of diagnostics (warnings, errors etc.) that will replace the current list for the evaluated document
    let diags: vscode.Diagnostic[] = [];

    // get formula text from the document
    let formulaText = document.getText();

    try {

        // parse the formula text into an evaluable formula
        lastFormula = parser.parse(formulaText);

        // clear eval side effects first
        evalCtx.clearSideEffects();

        // try to get a global for the current document
        let globalName = globalDocManager.getGlobalNameFor(document);

        if (globalName) {

            // we are evaluating a document that is a global
            // add this global's name to the global name chain
            // the chain is there to prevent infinite reference loops
            evalCtx.sideEffects.globalNameStack.push(globalName);

            // store the parsed formula in the global
            evalCtx.globals.set(globalName, lastFormula);

        }

        // evaluate the parsed formula
        let result = lastFormula.evaluate(evalCtx);
        let resultOutputString = result.toOutputString();

        // count how many parsing and evaluation errors popped up
        let errCount = parsingCtx.sideEffects.errors.length + evalCtx.sideEffects.errors.length;

        if (errCount > 0) {

            // at least one error encountered, merge them in order of appearance, one per line, and show in output
            let errorMessages = [];

            // parsing error index, evaluation error index
            let pi = 0; let ei = 0;

            for (let i = 0; i < errCount; i++) {

                if (
                    pi < parsingCtx.sideEffects.errors.length
                    && (
                        ei >= evalCtx.sideEffects.errors.length
                        || parsingCtx.sideEffects.errors[pi].token.getStartIndex() < evalCtx.sideEffects.errors[ei].evaluable.source!.getStartIndex()
                    )
                ) {

                    // parsing index is in range of parsing error list and current parsing error starts earlier than current eval error
                    errorMessages.push(parsingCtx.sideEffects.errors[pi].message);
                    pi++

                } else {

                    // parsing index out of range of parsing error list or current eval error starts earlier than current parsing error
                    errorMessages.push(evalCtx.sideEffects.errors[ei].message);
                    ei++

                }

            }

            if (resultOutputString) {

                // there is a result besides the error messages
                outChannel.replace(`${resultOutputString}\n\nFormula contains ${errCount} error${errCount === 1 ? '' : 's'}:\n${errorMessages.join('\n')}`);

            } else {

                // no result, just error messages
                outChannel.replace(errorMessages.join('\n'));

            }

        } else {

            // no errors encountered, simply output the result
            outChannel.replace(resultOutputString);

        }

    } catch (err: any) {

        // unexpected error, print to output
        outChannel.replace('kodeine crashed: ' + err?.toString());

        // since we crashed, there is no formula to show in the tree view
        lastFormula = null;

    }

    if (parsingCtx.sideEffects.warnings.length > 0) {

        // got some warnings, convert to diags
        parsingCtx.sideEffects.warnings.forEach(warning => {

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

    if (parsingCtx.sideEffects.errors.length > 0) {

        // got some errors, convert to diags
        parsingCtx.sideEffects.errors.forEach(error => {

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

    if (evalCtx.sideEffects.warnings.length > 0) {

        // got some warnings, convert to diags
        evalCtx.sideEffects.warnings.forEach(warning => {

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

    if (evalCtx.sideEffects.errors.length > 0) {

        // got some errors, convert to diags
        evalCtx.sideEffects.errors.forEach(error => {

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
    diagColl.set(vscode.window.activeTextEditor!.document.uri, diags);

    // refresh evaluation tree
    evalTreeDocManager.updateEvaluationTreeFor(document, evalCtx.sideEffects.lastEvaluationTreeNode as FormulaEvaluationTree);

}

function command_formulaResult() {
    outChannel.show(true);
}
