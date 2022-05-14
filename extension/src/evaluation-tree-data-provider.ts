import * as vscode from 'vscode';
import {
    FormulaEvaluationTreeNode,
    Literal,
    FormulaEvaluationTree,
    EvaluatedUnaryOperation,
    EvaluatedBinaryOperation,
    EvaluatedFunctionCall,
    EvaluatedExpression
} from '../../engine/dist.node/kodeine.js';

/** An adapter between a {@link FormulaEvaluationTree} and vscode's tree view. */
export class EvaluationTreeDataProvider implements vscode.TreeDataProvider<FormulaEvaluationTreeNode> {

    /** The evaluation tree currently being displayed. */
    private _evaluationTree: FormulaEvaluationTree | null = null;

    /** An event emitter for {@link onDidChangeTreeData}. */
    private _onDidChangeTreeData = new vscode.EventEmitter<FormulaEvaluationTreeNode | undefined | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    getChildren(element?: FormulaEvaluationTreeNode): vscode.ProviderResult<FormulaEvaluationTreeNode[]> {

        if (!element) {

            if (this._evaluationTree) {

                return [this._evaluationTree];

            } else {

                return undefined;

            }

        } else if (element instanceof FormulaEvaluationTree) {

            return element.parts;

        } else if (element instanceof EvaluatedUnaryOperation) {

            return [element.arg];

        } else if (element instanceof EvaluatedBinaryOperation) {

            return [element.argA, element.argB];

        } else if (element instanceof EvaluatedFunctionCall) {

            return element.args;

        } else if (element instanceof EvaluatedExpression) {

            return [element.child];

        } else {

            return undefined;

        }

    }

    getTreeItem(element: FormulaEvaluationTreeNode): vscode.TreeItem | Thenable<vscode.TreeItem> {

        let treeItem = new vscode.TreeItem(
            `${element.result.text}`,
            element instanceof Literal
                ? vscode.TreeItemCollapsibleState.None
                : vscode.TreeItemCollapsibleState.Collapsed
        );

        treeItem.description = element.getDescription();

        return treeItem;
    }

    /** Sets the evaluation tree to be displayed and notifies vscode that it should update the tree view. */
    setEvaluationTree(evaluationTree: FormulaEvaluationTree) {
        this._evaluationTree = evaluationTree;
        this._onDidChangeTreeData.fire(undefined);
    }

}