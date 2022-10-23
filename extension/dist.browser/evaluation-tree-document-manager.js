"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationTreeDocumentManager = void 0;
const vscode = require("vscode");
const evaluation_steps_text_document_content_provider_js_1 = require("./evaluation-steps-text-document-content-provider.js");
const evaluation_tree_data_provider_js_1 = require("./evaluation-tree-data-provider.js");
/** Keeps track of evaluation trees for formula source documents. */
class EvaluationTreeDocumentManager {
    constructor(extCtx) {
        /** A map between source documents and their latest evaluation trees. */
        this._sourceDocToEvalTreeMap = new Map();
        /** A {@link vscode.TreeDataProvider} for displaying the evaluation tree view UI. */
        this._evalTreeDataProvider = new evaluation_tree_data_provider_js_1.EvaluationTreeDataProvider();
        /** A {@link vscode.TextDocumentContentProvider} for displaying virtual documents with evaluation steps. */
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
        this._initCommands(extCtx);
        this._initEvalTreeView(extCtx);
        this._initEvalStepsTextDocContentProvider(extCtx);
        this._initEvents(extCtx);
    }
    _initCommands(extCtx) {
        // register commands from this._commands
        for (const commandName in this._commands) {
            extCtx.subscriptions.push(vscode.commands.registerCommand(`kodeine.${commandName}`, this._commands[commandName]));
        }
    }
    _initEvalTreeView(extCtx) {
        // register the formula tree view data provider
        extCtx.subscriptions.push(vscode.window.registerTreeDataProvider(EvaluationTreeDocumentManager.evalTreeViewId, this._evalTreeDataProvider));
    }
    _initEvalStepsTextDocContentProvider(extCtx) {
        extCtx.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(evaluation_steps_text_document_content_provider_js_1.EvaluationStepsTextDocumentContentProvider.scheme, this._evalStepsTextDocContentProvider));
    }
    _initEvents(extCtx) {
        extCtx.subscriptions.push(vscode.workspace.onDidCloseTextDocument(doc => this._onDidCloseTextDocument(doc)));
    }
    // EVENTS
    _onDidCloseTextDocument(doc) {
        if (doc.languageId === 'kode'
            && doc.uri.scheme === evaluation_steps_text_document_content_provider_js_1.EvaluationStepsTextDocumentContentProvider.scheme) {
            this.removeEvaluationTreeFor(doc);
        }
    }
    // KEEPING TRACK OF EVALUATION TREES
    /**
     * Updates the evaluation tree for a given source document.
     * Also updates evaluation steps documents and the evaluation steps tree view.
     */
    updateEvaluationTreeFor(doc, tree) {
        this._sourceDocToEvalTreeMap.set(doc, tree);
        this._evalStepsTextDocContentProvider.updateEvaluationTreeFor(doc, tree);
        this._evalTreeDataProvider.setEvaluationTree(tree);
    }
    /**
     * Removes the evaluation tree for a given source document.
     * Also removes the evaluation tree from the {@link _evalStepsTextDocContentProvider}.
     * Intended to be used after the formula source document was closed and keeping the evaluation tree is no longer necessary.
     */
    removeEvaluationTreeFor(doc) {
        this._sourceDocToEvalTreeMap.delete(doc);
        this._evalStepsTextDocContentProvider.removeEvaluationTreeFor(doc);
    }
}
exports.EvaluationTreeDocumentManager = EvaluationTreeDocumentManager;
/** The id of the view to register the {@link _evalTreeDataProvider} in. */
EvaluationTreeDocumentManager.evalTreeViewId = 'formulaEvaluationTree';
//# sourceMappingURL=evaluation-tree-document-manager.js.map