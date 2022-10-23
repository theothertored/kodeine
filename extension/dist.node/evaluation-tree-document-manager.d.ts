import * as vscode from 'vscode';
import { FormulaEvaluationTree } from '../../engine/dist.node/kodeine.js';
/** Keeps track of evaluation trees for formula source documents. */
export declare class EvaluationTreeDocumentManager {
    /** The id of the view to register the {@link _evalTreeDataProvider} in. */
    static readonly evalTreeViewId = "formulaEvaluationTree";
    /** A map between source documents and their latest evaluation trees. */
    private readonly _sourceDocToEvalTreeMap;
    /** A {@link vscode.TreeDataProvider} for displaying the evaluation tree view UI. */
    private readonly _evalTreeDataProvider;
    /** A {@link vscode.TextDocumentContentProvider} for displaying virtual documents with evaluation steps. */
    private readonly _evalStepsTextDocContentProvider;
    constructor(extCtx: vscode.ExtensionContext);
    private _initCommands;
    private _initEvalTreeView;
    private _initEvalStepsTextDocContentProvider;
    private _initEvents;
    private _onDidCloseTextDocument;
    /**
     * Updates the evaluation tree for a given source document.
     * Also updates evaluation steps documents and the evaluation steps tree view.
     */
    updateEvaluationTreeFor(doc: vscode.TextDocument, tree: FormulaEvaluationTree): void;
    /**
     * Removes the evaluation tree for a given source document.
     * Also removes the evaluation tree from the {@link _evalStepsTextDocContentProvider}.
     * Intended to be used after the formula source document was closed and keeping the evaluation tree is no longer necessary.
     */
    removeEvaluationTreeFor(doc: vscode.TextDocument): void;
    private readonly _commands;
}
