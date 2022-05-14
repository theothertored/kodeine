import * as vscode from 'vscode';
import { FormulaEvaluationTreeNode, FormulaEvaluationTree } from '../../engine/dist.node/kodeine.js';
/** An adapter between a {@link FormulaEvaluationTree} and vscode's tree view. */
export declare class EvaluationTreeDataProvider implements vscode.TreeDataProvider<FormulaEvaluationTreeNode> {
    /** The evaluation tree currently being displayed. */
    private _evaluationTree;
    /** An event emitter for {@link onDidChangeTreeData}. */
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<void | FormulaEvaluationTreeNode | undefined>;
    getChildren(element?: FormulaEvaluationTreeNode): vscode.ProviderResult<FormulaEvaluationTreeNode[]>;
    getTreeItem(element: FormulaEvaluationTreeNode): vscode.TreeItem | Thenable<vscode.TreeItem>;
    /** Sets the evaluation tree to be displayed and notifies vscode that it should update the tree view. */
    setEvaluationTree(evaluationTree: FormulaEvaluationTree): void;
}
