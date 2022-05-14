"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationTreeDocumentManager = void 0;
const vscode = require("vscode");
const evaluation_steps_text_document_content_provider_js_1 = require("./evaluation-steps-text-document-content-provider.js");
const evaluation_tree_data_provider_js_1 = require("./evaluation-tree-data-provider.js");
class EvaluationTreeDocumentManager {
    constructor(extCtx) {
        this._sourceDocToEvalTreeMap = new Map();
        this._evalTreeDataProvider = new evaluation_tree_data_provider_js_1.EvaluationTreeDataProvider();
        this._evalStepsTextDocContentProvider = new evaluation_steps_text_document_content_provider_js_1.EvaluationStepsTextDocumentContentProvider();
        // COMMANDS
        this._commands = {
            showEvaluationSteps: () => {
                if (vscode.window.activeTextEditor?.document.languageId === 'kode'
                    && vscode.window.activeTextEditor.document.uri.scheme !== evaluation_steps_text_document_content_provider_js_1.EvaluationStepsTextDocumentContentProvider.scheme) {
                    let sourceDoc = vscode.window.activeTextEditor.document;
                    let stepsUri = this._evalStepsTextDocContentProvider.getStepsDocumentUriFor(sourceDoc);
                    vscode.workspace.openTextDocument(stepsUri)
                        .then(doc => vscode.languages.setTextDocumentLanguage(doc, 'kode'))
                        .then(doc => vscode.window.showTextDocument(doc, {
                        viewColumn: vscode.ViewColumn.Beside,
                        preserveFocus: true,
                        preview: false
                    }));
                }
            }
        };
        this.initCommands(extCtx);
        this.initEvalTreeView(extCtx);
        this.initEvalStepsTextDocContentProvider(extCtx);
        this.initEvents(extCtx);
    }
    initCommands(extCtx) {
        // register commands from this._commands
        for (const commandName in this._commands) {
            extCtx.subscriptions.push(vscode.commands.registerCommand(`kodeine.${commandName}`, this._commands[commandName]));
        }
    }
    initEvalTreeView(extCtx) {
        // register the formula tree view data provider
        extCtx.subscriptions.push(vscode.window.registerTreeDataProvider(EvaluationTreeDocumentManager.evalTreeViewId, this._evalTreeDataProvider));
    }
    initEvalStepsTextDocContentProvider(extCtx) {
        extCtx.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(evaluation_steps_text_document_content_provider_js_1.EvaluationStepsTextDocumentContentProvider.scheme, this._evalStepsTextDocContentProvider));
    }
    initEvents(extCtx) {
        extCtx.subscriptions.push(vscode.workspace.onDidCloseTextDocument(doc => this.onDidCloseTextDocument(doc)));
    }
    // EVENTS
    onDidCloseTextDocument(doc) {
        if (doc.languageId === 'kode'
            && doc.uri.scheme === evaluation_steps_text_document_content_provider_js_1.EvaluationStepsTextDocumentContentProvider.scheme) {
            this.removeEvaluationTreeFor(doc);
        }
    }
    // KEEPING TRACK OF EVALUATION TREES
    updateEvaluationTreeFor(doc, tree) {
        this._sourceDocToEvalTreeMap.set(doc, tree);
        this._evalStepsTextDocContentProvider.updateEvaluationTreeFor(doc, tree);
        this._evalTreeDataProvider.setEvaluationTree(tree);
    }
    removeEvaluationTreeFor(doc) {
        this._sourceDocToEvalTreeMap.delete(doc);
        this._evalStepsTextDocContentProvider.removeEvaluationTreeFor(doc);
    }
}
exports.EvaluationTreeDocumentManager = EvaluationTreeDocumentManager;
EvaluationTreeDocumentManager.evalTreeViewId = 'formulaEvaluationTree';
//# sourceMappingURL=evaluation-tree-document-manager.js.map