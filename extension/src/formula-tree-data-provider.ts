import * as vscode from 'vscode';
import { Formula } from '../../engine/dist.node/evaluables/formula.js';
import { Evaluable, KodeValue } from '../../engine/dist.node/base.js';
import { FunctionCall } from '../../engine/dist.node/evaluables/function-call.js';
import { BinaryOperation } from '../../engine/dist.node/evaluables/binary-operation.js';
import { UnaryOperation } from '../../engine/dist.node/evaluables/unary-operation.js';
import { Expression } from '../../engine/dist.node/evaluables/expression.js';

export class FormulaTreeDataProvider implements vscode.TreeDataProvider<any> {

    private _formula: Formula | null = null;
    private _sourceDocument: vscode.TextDocument | null = null;

    private _onDidChangeTreeData: vscode.EventEmitter<any | undefined | void> = new vscode.EventEmitter<any | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<any | undefined | void> = this._onDidChangeTreeData.event;

    getChildren(element?: any): vscode.ProviderResult<any[]> {

        if (!element) {

            return this._formula?.evaluables;

        } else if (element instanceof Formula) {

            return element.evaluables;

        } else if (element instanceof FunctionCall) {

            return element.args

        } else if (element instanceof BinaryOperation) {

            return [element.argA, element.argB];

        } else if (element instanceof UnaryOperation) {

            return [element.arg];

        } else if (element instanceof Expression) {

            return this.getChildren(element.evaluable);

        } else {

            return undefined;

        }

    }

    getTreeItem(element: any): vscode.TreeItem | Thenable<vscode.TreeItem> {

        if (element instanceof Formula) {

            return new vscode.TreeItem(
                `Formula (${element.evaluables.length} part${element.evaluables.length === 1 ? '' : 's'}`,
                element.evaluables.length > 0
                    ? vscode.TreeItemCollapsibleState.Expanded
                    : vscode.TreeItemCollapsibleState.None
            );

        } else if (element instanceof FunctionCall) {

            return new vscode.TreeItem(
                `Function call: ${element.func.getName()}()`,
                element.args.length > 0
                    ? vscode.TreeItemCollapsibleState.Expanded
                    : vscode.TreeItemCollapsibleState.None
            );

        } else if (element instanceof BinaryOperation) {

            return new vscode.TreeItem(
                `Binary operation: a ${element.operator.getSymbol()} b`,
                vscode.TreeItemCollapsibleState.Expanded
            );

        } else if (element instanceof UnaryOperation) {

            return new vscode.TreeItem(
                `Unary operation: ${element.operator.getSymbol()}a`,
                vscode.TreeItemCollapsibleState.Expanded
            );

        } else if (element instanceof Expression) {

            return new vscode.TreeItem(
                'Expression',
                vscode.TreeItemCollapsibleState.Expanded
            );

        } else if (element instanceof KodeValue) {

            return new vscode.TreeItem(
                `Value: ${element.text}${element.isNumeric ? ' [numeric]' : ''}`,
                vscode.TreeItemCollapsibleState.None
            );

        } else if (element instanceof Evaluable) {

            return new vscode.TreeItem(
                `Evaluable: ${element.constructor.name}`,
                element instanceof KodeValue
                    ? vscode.TreeItemCollapsibleState.None
                    : vscode.TreeItemCollapsibleState.Expanded
            );

        } else {

            return new vscode.TreeItem(
                `Unimplemented item (${element.constructor.name})`,
                vscode.TreeItemCollapsibleState.Expanded
            );

        }

    }

    setFormula(formula: Formula | null) {
        this._formula = formula;
        this._onDidChangeTreeData.fire(undefined);
    }

}
