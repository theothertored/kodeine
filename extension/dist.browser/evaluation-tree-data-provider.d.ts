import * as vscode from 'vscode';
import { FormulaEvaluationTreeNode } from '../../engine/dist.node/base.js';
import { FormulaEvaluationTree } from '../../engine/dist.node/evaluables/evaluation-tree.js';
export declare class FormulaTreeDataProvider implements vscode.TreeDataProvider<FormulaEvaluationTreeNode> {
    private _evaluationTree;
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<FormulaEvaluationTreeNode | undefined | void>;
    constructor();
    getChildren(element?: FormulaEvaluationTreeNode): vscode.ProviderResult<FormulaEvaluationTreeNode[]>;
    getTreeItem(element: FormulaEvaluationTreeNode): vscode.TreeItem | Thenable<vscode.TreeItem>;
    setEvaluationTree(evaluationTree: FormulaEvaluationTree): void;
}
