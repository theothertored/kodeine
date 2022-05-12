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


export class EvaluationTreeDataProvider implements vscode.TreeDataProvider<FormulaEvaluationTreeNode> {

    private _evaluationTree: FormulaEvaluationTree | null;

    private _onDidChangeTreeData: vscode.EventEmitter<FormulaEvaluationTreeNode | undefined | void> = new vscode.EventEmitter<FormulaEvaluationTreeNode | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<FormulaEvaluationTreeNode | undefined | void> = this._onDidChangeTreeData.event;

    constructor() {
        this._evaluationTree = null;
    }

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


    setEvaluationTree(evaluationTree: FormulaEvaluationTree) {
        this._evaluationTree = evaluationTree;
        this._onDidChangeTreeData.fire(undefined);
    }

}
