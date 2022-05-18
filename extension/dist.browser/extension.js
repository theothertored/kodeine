"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const kodeine_js_1 = require("../../engine/dist.node/kodeine.js");
const evaluation_tree_document_manager_js_1 = require("./evaluation-tree-document-manager.js");
const evaluation_steps_text_document_content_provider_js_1 = require("./evaluation-steps-text-document-content-provider.js");
const global_document_manager_js_1 = require("./global-document-manager.js");
let outChannel;
let diagColl;
let parsingCtx;
let parser;
let evalCtx;
let lastFormula;
let lastEvaluatedDoc;
let globalDocManager;
let evalTreeDocManager;
/** Activates the extension. */
function activate(extCtx) {
    // prepare kodeine engine
    parsingCtx = kodeine_js_1.ParsingContextBuilder.buildDefault();
    parser = new kodeine_js_1.KodeineParser(parsingCtx);
    evalCtx = new kodeine_js_1.EvaluationContext();
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
    vscode.window.onDidChangeActiveTextEditor(ev => onSomethingDocumentRelated(ev?.document)), vscode.workspace.onDidChangeTextDocument(ev => onSomethingDocumentRelated(ev.document)), vscode.workspace.onDidOpenTextDocument(doc => onSomethingDocumentRelated(doc)), vscode.workspace.onDidChangeConfiguration(ev => onConfigurationChanged(ev)));
    // initialize a global document manager to handle globals
    globalDocManager = new global_document_manager_js_1.GlobalDocumentManager(extCtx, parsingCtx.getOperatorSymbolsLongestFirst(), parsingCtx.getFunctionNames());
    // react to globals changing
    globalDocManager.onGlobalAdded(globalDocument => evalCtx.globals.set(globalDocument.globalName, parser.parse(globalDocument.doc.getText())));
    globalDocManager.onGlobalRemoved(globalDocument => evalCtx.globals.delete(globalDocument.globalName));
    globalDocManager.onGlobalsCleared(() => evalCtx.globals.clear());
    // initialize an evaluation tree document manager to handle evaluation trees
    evalTreeDocManager = new evaluation_tree_document_manager_js_1.EvaluationTreeDocumentManager(extCtx);
    // initialize with active editor
    onSomethingDocumentRelated(vscode.window.activeTextEditor?.document);
}
exports.activate = activate;
/** Should be called when a text document changes, is opened, is activated etc. */
function onSomethingDocumentRelated(document) {
    if (document
        && document.languageId === 'kode' // only evaluate kode documents
        && document.uri.scheme !== evaluation_steps_text_document_content_provider_js_1.EvaluationStepsTextDocumentContentProvider.scheme // don't evaluate evaluation steps
    ) {
        evaluateToOutput(document);
    }
}
function onConfigurationChanged(ev) {
    if (lastEvaluatedDoc && ev.affectsConfiguration('kodeine'))
        evaluateToOutput(lastEvaluatedDoc);
}
function enforceValue(validValues, value, defaultIndex = 0) {
    if (typeof value === 'undefined') {
        return validValues[defaultIndex];
    }
    else {
        let i = validValues.indexOf(value.trim().toLowerCase());
        if (i >= 0)
            return validValues[i];
        else
            return validValues[defaultIndex];
    }
}
/** Evaluates a given kode document to the formula result output channel. */
function evaluateToOutput(document) {
    // create a list of diagnostics (warnings, errors etc.) that will replace the current list for the evaluated document
    let diags = [];
    // get formula text from the document
    let formulaText = document.getText();
    lastEvaluatedDoc = document;
    // load configuration
    let config = vscode.workspace.getConfiguration('kodeine', vscode.window.activeTextEditor.document.uri);
    evalCtx.clockMode = enforceValue(kodeine_js_1.ValidClockModes, config.get('clockMode'));
    evalCtx.firstDayOfTheWeek = enforceValue(kodeine_js_1.ValidWeekdays, config.get('firstDayOfTheWeek'), 1);
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
            let pi = 0;
            let ei = 0;
            for (let i = 0; i < errCount; i++) {
                if (pi < parsingCtx.sideEffects.errors.length
                    && (ei >= evalCtx.sideEffects.errors.length
                        || parsingCtx.sideEffects.errors[pi].token.getStartIndex() < evalCtx.sideEffects.errors[ei].evaluable.source.getStartIndex())) {
                    // parsing index is in range of parsing error list and current parsing error starts earlier than current eval error
                    errorMessages.push(parsingCtx.sideEffects.errors[pi].message);
                    pi++;
                }
                else {
                    // parsing index out of range of parsing error list or current eval error starts earlier than current parsing error
                    errorMessages.push(evalCtx.sideEffects.errors[ei].message);
                    ei++;
                }
            }
            if (resultOutputString) {
                // there is a result besides the error messages
                outChannel.replace(`${resultOutputString}\n\nFormula contains ${errCount} error${errCount === 1 ? '' : 's'}:\n${errorMessages.join('\n')}`);
            }
            else {
                // no result, just error messages
                outChannel.replace(errorMessages.join('\n'));
            }
        }
        else {
            // no errors encountered, simply output the result
            outChannel.replace(resultOutputString);
        }
    }
    catch (err) {
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
                range: new vscode.Range(document.positionAt(warning.tokens[0].getStartIndex()), document.positionAt(warning.tokens[warning.tokens.length - 1].getEndIndex())),
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
                range: new vscode.Range(document.positionAt(error.token.getStartIndex()), document.positionAt(error.token.getEndIndex())),
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
                range: new vscode.Range(document.positionAt(warning.evaluable.source.getStartIndex()), document.positionAt(warning.evaluable.source.getEndIndex())),
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
                range: new vscode.Range(document.positionAt(error.evaluable.source.getStartIndex()), document.positionAt(error.evaluable.source.getEndIndex())),
                message: error.message,
                code: '', source: ''
            });
        });
    }
    // apply the created list to the problems panel
    diagColl.set(vscode.window.activeTextEditor.document.uri, diags);
    // refresh evaluation tree
    evalTreeDocManager.updateEvaluationTreeFor(document, evalCtx.sideEffects.lastEvaluationTreeNode);
}
function command_formulaResult() {
    outChannel.show(true);
}
//# sourceMappingURL=extension.js.map