import * as vscode from 'vscode';
import { FormulaEvaluationTreeNode, FormulaEvaluationTree } from '../../engine/dist.node/kodeine.js';
export declare class EvaluationTreeDataProvider implements vscode.TreeDataProvider<FormulaEvaluationTreeNode> {
    private _evaluationTree;
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<FormulaEvaluationTreeNode | undefined | void>;
    constructor();
    getChildren(element?: FormulaEvaluationTreeNode): vscode.ProviderResult<FormulaEvaluationTreeNode[]>;
    getTreeItem(element: FormulaEvaluationTreeNode): vscode.TreeItem | Thenable<vscode.TreeItem>;
    setEvaluationTree(evaluationTree: FormulaEvaluationTree): void;
}
