"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const kodeine_js_1 = require("../../engine/dist.node/kodeine.js");
const evaluation_tree_document_manager_js_1 = require("./evaluation-tree-document-manager.js");
const global_document_manager_js_1 = require("./global-document-manager.js");
const formula_document_evaluation_manager_js_1 = require("./formula-document-evaluation-manager.js");
let outChannel;
let diagColl;
let parsingCtx;
let parser;
let evalCtx;
let globalDocManager;
let evalTreeDocManager;
let formulaDocEvalManager;
/** Activates the extension. */
function activate(extCtx) {
    // VSCODE API INIT
    // create an output channel for formula results
    outChannel = vscode.window.createOutputChannel('Formula Result');
    outChannel.show(true); // reveal the output channel in the UI
    // create a diagnostic collection for errors and warnings
    diagColl = vscode.languages.createDiagnosticCollection('Formula Diagnostics');
    extCtx.subscriptions.push(
    // register disposables
    outChannel, diagColl, 
    // register commands
    vscode.commands.registerCommand('kodeine.formulaResult', command_formulaResult), 
    // register event listeners
    vscode.workspace.onDidChangeConfiguration(ev => onConfigurationChanged(ev)));
    // KODEINE INIT
    // prepare kodeine engine
    parsingCtx = kodeine_js_1.ParsingContextBuilder.buildDefault();
    parser = new kodeine_js_1.KodeineParser(parsingCtx);
    evalCtx = new kodeine_js_1.EvaluationContext();
    // enable evaluation tree building in the context
    evalCtx.buildEvaluationTree = true;
    // initialize a global document manager to handle globals
    globalDocManager = new global_document_manager_js_1.GlobalDocumentManager(extCtx, parsingCtx.getOperatorSymbolsLongestFirst(), parsingCtx.getFunctionNames());
    // initialize an evaluation tree document manager to handle evaluation trees
    evalTreeDocManager = new evaluation_tree_document_manager_js_1.EvaluationTreeDocumentManager(extCtx);
    // initialize a formula document evaluation manager to handle evaluating documents and the side effects of doing so
    formulaDocEvalManager = new formula_document_evaluation_manager_js_1.FormulaDocumentEvaluationManager(extCtx, outChannel, diagColl, globalDocManager, evalTreeDocManager, parsingCtx, parser, evalCtx);
    if (vscode.window.activeTextEditor?.document) {
        // there is an active text editor, evaluate its document
        // we know this is a kode document because the activation event requires a kode document
        formulaDocEvalManager.evaluateToOutput(vscode.window.activeTextEditor?.document);
    }
}
exports.activate = activate;
function onConfigurationChanged(ev) {
    if (ev.affectsConfiguration('kodeine')) {
        // configuration has changed, reevaluate the last evaluated document
        // and all documents with open side effects
        formulaDocEvalManager.reevaluateLastEvaluatedDocument();
        formulaDocEvalManager.reevaluateDocumentsWithOpenEvaluationSteps();
    }
}
function command_formulaResult() {
    outChannel.show(true);
}
//# sourceMappingURL=extension.js.map