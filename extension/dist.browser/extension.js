"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const kodeine_js_1 = require("../../engine/dist.node/kodeine.js");
const evaluation_tree_data_provider_js_1 = require("./evaluation-tree-data-provider.js");
const global_tree_data_provider_js_1 = require("./global-tree-data-provider.js");
let outChannel;
let diagColl;
let parsingCtx;
let parser;
let evalCtx;
let lastFormula;
var docToGlobalNameMap;
const globalChangeNotifTimeout = 5000;
let evaluationTreeDataProvider;
let globalTreeDataProvider;
/** Activates the extension. */
function activate(extCtx) {
    // prepare kodeine engine
    parsingCtx = kodeine_js_1.ParsingContextBuilder.buildDefault();
    parser = new kodeine_js_1.KodeineParser(parsingCtx);
    evalCtx = new kodeine_js_1.EvaluationContext();
    // enable evaluation tree building
    evalCtx.buildEvaluationTree = true;
    // create an output channel for formula results
    outChannel = vscode.window.createOutputChannel('Formula Result');
    extCtx.subscriptions.push(outChannel); // register it as disposable
    outChannel.show(true); // reveal the output channel in the UI
    // create a diagnostic collection for errors and warnings
    diagColl = vscode.languages.createDiagnosticCollection('Formula diagnostics');
    extCtx.subscriptions.push(diagColl); // register it as disposable
    // create and register the formula tree view data provider
    evaluationTreeDataProvider = new evaluation_tree_data_provider_js_1.EvaluationTreeDataProvider();
    extCtx.subscriptions.push(vscode.window.registerTreeDataProvider('formulaEvaluationTree', evaluationTreeDataProvider));
    // prepare map to keep track of global documents
    docToGlobalNameMap = new Map();
    // create and register the global tree view data provider
    // TODO: load previous set of globals before this point
    globalTreeDataProvider = new global_tree_data_provider_js_1.GlobalTreeDataProvider([]);
    extCtx.subscriptions.push(vscode.window.registerTreeDataProvider('globalList', globalTreeDataProvider));
    // check the language of the currently opened editor
    if (vscode.window.activeTextEditor?.document.languageId === 'kode') {
        // the user is currently editing kode, evaluate the current content of the document
        evaluateToOutput(vscode.window.activeTextEditor.document);
    }
    else {
        // the user is not editing kode, inform (this should not happen, since the activation event is onLanguage:kode)
        outChannel.replace('Activate a text editor with its language set to kode to see live evaluation results.');
    }
    // listen to active editor changes
    extCtx.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(ev => {
        if (ev?.document?.languageId === 'kode')
            evaluateToOutput(ev.document);
    }));
    // listen to text document changes
    extCtx.subscriptions.push(vscode.workspace.onDidChangeTextDocument(ev => {
        if (ev?.document?.languageId === 'kode')
            evaluateToOutput(ev.document);
    }));
    // listen to text documents being opened
    extCtx.subscriptions.push(vscode.workspace.onDidOpenTextDocument(doc => {
        if (doc.languageId === 'kode')
            evaluateToOutput(doc);
    }));
    // handle command showing opening the formula result window
    extCtx.subscriptions.push(vscode.commands.registerCommand('kodeine.formulaResult', () => {
        outChannel.show(true);
    }));
    // handle global related commands
    extCtx.subscriptions.push(vscode.commands.registerCommand('kodeine.addGlobal', command_addGlobal), vscode.commands.registerCommand('kodeine.removeGlobal', command_removeGlobal), vscode.commands.registerCommand('kodeine.clearGlobals', command_clearGlobals), vscode.commands.registerCommand('kodeine.openGlobalDocument', command_openGlobalDocument));
}
exports.activate = activate;
/** Evaluates a given kode document to the formula result output channel. */
function evaluateToOutput(document) {
    // create a list of diagnostics (warnings, errors etc.) that will replace the current list for the evaluated document
    let diags = [];
    // get formula text from the document
    let formulaText = document.getText();
    try {
        // parse the formula text into an evaluable formula
        lastFormula = parser.parse(formulaText);
        // clear eval side effects first
        evalCtx.clearSideEffects();
        // try to get a global for the current document
        let globalName = docToGlobalNameMap.get(document);
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
            if (result.text) {
                // there is a result besides the error messages
                outChannel.replace(`${result.text}\n\nFormula contains ${errCount} error${errCount === 1 ? '' : 's'}:\n${errorMessages.join('\n')}`);
            }
            else {
                // no result, just error messages
                outChannel.replace(errorMessages.join('\n'));
            }
        }
        else {
            // no errors encountered, simply output the result
            outChannel.replace(result.text);
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
    // refresh formula tree view
    evaluationTreeDataProvider.setEvaluationTree(evalCtx.sideEffects.lastEvaluationTreeNode);
}
// #region global handling
function command_addGlobal() {
    vscode.window.showInputBox({
        title: 'Name the global',
        prompt: 'Remember that Kustom limits this name to 8 characters.',
        validateInput: text => {
            if (!text) {
                return 'Global name cannot be empty.';
            }
            else if (text.length === 2) {
                return 'Kustom doesn\'t really like two letter global names because it confuses them with function names.';
            }
            else {
                return null;
            }
        }
    }).then(globalName => {
        if (globalName) {
            // normalize global name
            globalName = globalName.trim().toLowerCase();
            // find any globals with this name and remove them
            Array.from(docToGlobalNameMap.entries())
                .filter(e => e[1] === globalName)
                .forEach(e => docToGlobalNameMap.delete(e[0]));
            // associate the document with the global name
            docToGlobalNameMap.set(vscode.window.activeTextEditor.document, globalName);
            // update the global in the evaluation context
            evalCtx.globals.set(globalName, lastFormula);
            // notify the user in the way vscode wants us to (notifications can't auto-dismiss)
            vscode.window.setStatusBarMessage(`gv(${globalName}) has been added.`, globalChangeNotifTimeout);
            // refresh UI showing the current list of globals
            refreshGlobalList();
        }
    });
}
function command_removeGlobal(global) {
    if (global) {
        // a global to remove was given (global list icon click)
        removeGlobal(global.name, global.document);
    }
    else {
        // a global to remove was not given, let the user pick from a list
        vscode.window.showQuickPick(Array.from(docToGlobalNameMap)
            .map(e => ({
            label: e[1],
            description: e[0].uri.toString(),
            globalName: e[1],
            document: e[0]
        }))).then(pickedItem => {
            if (pickedItem) {
                removeGlobal(pickedItem.globalName, pickedItem.document);
            }
        });
    }
}
function removeGlobal(globalName, document) {
    // remove association
    docToGlobalNameMap.delete(document);
    // remove global from the evaluation context
    evalCtx.globals.delete(globalName);
    // notify the user in the way vscode wants us to (notifications can't auto-dismiss)
    vscode.window.setStatusBarMessage(`gv(${globalName}) has been removed.`, globalChangeNotifTimeout);
    // refresh UI showing the current list of globals
    refreshGlobalList();
}
function command_clearGlobals() {
    // clear associations
    docToGlobalNameMap.clear();
    // clear globals
    evalCtx.globals.clear();
    vscode.window.setStatusBarMessage(`All globals have been removed.`, globalChangeNotifTimeout);
    // refresh UI
    refreshGlobalList();
}
function command_openGlobalDocument(document) {
    vscode.window.showTextDocument(document);
}
function refreshGlobalList() {
    globalTreeDataProvider.notifyGlobalsChanged(Array.from(docToGlobalNameMap).map(e => ({
        name: e[1],
        document: e[0]
    })));
}
//#endregion
//# sourceMappingURL=extension.js.map