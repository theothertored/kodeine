import * as vscode from 'vscode';
import { Formula } from '../../engine/dist.node/evaluables/formula.js';
import { Evaluable } from '../../engine/dist.node/base.js';
import { FunctionCall } from '../../engine/dist.node/evaluables/function-call.js';
import { BinaryOperation } from '../../engine/dist.node/evaluables/binary-operation.js';
import { UnaryOperation } from '../../engine/dist.node/evaluables/unary-operation.js';
import { Expression } from '../../engine/dist.node/evaluables/expression.js';
declare type FormulaTreeElement = Evaluable | Formula | FunctionCall | BinaryOperation | UnaryOperation | Expression;
export declare class FormulaTreeDataProvider implements vscode.TreeDataProvider<FormulaTreeElement> {
    private _formula;
    private _sourceDocument;
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<FormulaTreeElement | undefined | void>;
    getChildren(element?: FormulaTreeElement): vscode.ProviderResult<FormulaTreeElement[]>;
    getTreeItem(element: FormulaTreeElement): vscode.TreeItem | Thenable<vscode.TreeItem>;
    setFormula(formula: Formula | null): void;
}
export {};
