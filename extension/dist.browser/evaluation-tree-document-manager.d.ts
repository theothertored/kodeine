import * as vscode from 'vscode';
import { FormulaEvaluationTree } from '../../engine/dist.node/kodeine.js';
export declare class EvaluationTreeDocumentManager {
    static readonly evalTreeViewId = "formulaEvaluationTree";
    private readonly _sourceDocToEvalTreeMap;
    private readonly _evalTreeDataProvider;
    private readonly _evalStepsTextDocContentProvider;
    constructor(extCtx: vscode.ExtensionContext);
    initCommands(extCtx: vscode.ExtensionContext): void;
    initEvalTreeView(extCtx: vscode.ExtensionContext): void;
    initEvalStepsTextDocContentProvider(extCtx: vscode.ExtensionContext): void;
    initEvents(extCtx: vscode.ExtensionContext): void;
    onDidCloseTextDocument(doc: vscode.TextDocument): any;
    updateEvaluationTreeFor(doc: vscode.TextDocument, tree: FormulaEvaluationTree): void;
    removeEvaluationTreeFor(doc: vscode.TextDocument): void;
    private readonly _commands;
}
