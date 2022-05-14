import * as vscode from 'vscode';
import { FormulaEvaluationTree } from '../../engine/dist.node/kodeine.js';
import { EvaluationStepsTextDocumentContentProvider } from './evaluation-steps-text-document-content-provider.js';
import { EvaluationTreeDataProvider } from './evaluation-tree-data-provider.js';

/** Keeps track of evaluation trees for formula source documents. */
export class EvaluationTreeDocumentManager {

    /** The id of the view to register the {@link _evalTreeDataProvider} in. */
    public static readonly evalTreeViewId = 'formulaEvaluationTree';
    
    /** A map between source documents and their latest evaluation trees. */
    private readonly _sourceDocToEvalTreeMap = new Map<vscode.TextDocument, FormulaEvaluationTree>();
    /** A {@link vscode.TreeDataProvider} for displaying the evaluation tree view UI. */
    private readonly _evalTreeDataProvider = new EvaluationTreeDataProvider();
    /** A {@link vscode.TextDocumentContentProvider} for displaying virtual documents with evaluation steps. */
    private readonly _evalStepsTextDocContentProvider = new EvaluationStepsTextDocumentContentProvider();

    constructor(extCtx: vscode.ExtensionContext) {

        this.initCommands(extCtx);
        this.initEvalTreeView(extCtx);
        this.initEvalStepsTextDocContentProvider(extCtx);
        this.initEvents(extCtx);

    }

    initCommands(extCtx: vscode.ExtensionContext) {

        // register commands from this._commands
        for (const commandName in this._commands) {
            extCtx.subscriptions.push(
                vscode.commands.registerCommand(`kodeine.${commandName}`, this._commands[commandName])
            );
        }

    }

    initEvalTreeView(extCtx: vscode.ExtensionContext) {

        // register the formula tree view data provider
        extCtx.subscriptions.push(
            vscode.window.registerTreeDataProvider(EvaluationTreeDocumentManager.evalTreeViewId, this._evalTreeDataProvider)
        );

    }

    initEvalStepsTextDocContentProvider(extCtx: vscode.ExtensionContext) {

        extCtx.subscriptions.push(
            vscode.workspace.registerTextDocumentContentProvider(
                EvaluationStepsTextDocumentContentProvider.scheme,
                this._evalStepsTextDocContentProvider
            )
        )

    }

    initEvents(extCtx: vscode.ExtensionContext) {

        extCtx.subscriptions.push(
            vscode.workspace.onDidCloseTextDocument(doc => this.onDidCloseTextDocument(doc))
        );

    }


    // EVENTS

    onDidCloseTextDocument(doc: vscode.TextDocument): any {

        if (
            doc.languageId === 'kode'
            && doc.uri.scheme === EvaluationStepsTextDocumentContentProvider.scheme
        ) {

            this.removeEvaluationTreeFor(doc);

        }

    }


    // KEEPING TRACK OF EVALUATION TREES

    /** 
     * Updates the evaluation tree for a given source document.
     * Also updates evaluation steps documents and the evaluation steps tree view.
     */
    updateEvaluationTreeFor(doc: vscode.TextDocument, tree: FormulaEvaluationTree) {

        this._sourceDocToEvalTreeMap.set(doc, tree);
        this._evalStepsTextDocContentProvider.updateEvaluationTreeFor(doc, tree);
        this._evalTreeDataProvider.setEvaluationTree(tree);

    }

    /** 
     * Removes the evaluation tree for a given source document.
     * Also removes the evaluation tree from the {@link _evalStepsTextDocContentProvider}.
     * Intended to be used after the formula source document was closed and keeping the evaluation tree is no longer necessary.
     */
    removeEvaluationTreeFor(doc: vscode.TextDocument) {

        this._sourceDocToEvalTreeMap.delete(doc);
        this._evalStepsTextDocContentProvider.removeEvaluationTreeFor(doc)

    }


    // COMMANDS

    private readonly _commands: Record<string, (...args: any) => any> = {

        showEvaluationSteps: () => {

            if (
                vscode.window.activeTextEditor?.document.languageId === 'kode'
                && vscode.window.activeTextEditor.document.uri.scheme !== EvaluationStepsTextDocumentContentProvider.scheme
            ) {

                let sourceDoc = vscode.window.activeTextEditor!.document;
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
} 