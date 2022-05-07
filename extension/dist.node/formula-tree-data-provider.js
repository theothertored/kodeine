"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormulaTreeDataProvider = void 0;
const vscode = require("vscode");
const formula_js_1 = require("../../engine/dist.node/evaluables/formula.js");
const base_js_1 = require("../../engine/dist.node/base.js");
const function_call_js_1 = require("../../engine/dist.node/evaluables/function-call.js");
const binary_operation_js_1 = require("../../engine/dist.node/evaluables/binary-operation.js");
const unary_operation_js_1 = require("../../engine/dist.node/evaluables/unary-operation.js");
const expression_js_1 = require("../../engine/dist.node/evaluables/expression.js");
class FormulaTreeDataProvider {
    constructor() {
        this._formula = null;
        this._sourceDocument = null;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    getChildren(element) {
        if (!element) {
            return this._formula?.evaluables;
        }
        else if (element instanceof formula_js_1.Formula) {
            return element.evaluables;
        }
        else if (element instanceof function_call_js_1.FunctionCall) {
            return element.args;
        }
        else if (element instanceof binary_operation_js_1.BinaryOperation) {
            return [element.argA, element.argB];
        }
        else if (element instanceof unary_operation_js_1.UnaryOperation) {
            return [element.arg];
        }
        else if (element instanceof expression_js_1.Expression) {
            return [element.evaluable];
        }
        else {
            return undefined;
        }
    }
    getTreeItem(element) {
        if (element instanceof formula_js_1.Formula) {
            return new vscode.TreeItem(`Formula (${element.evaluables.length} part${element.evaluables.length === 1 ? '' : 's'})`, element.evaluables.length > 0
                ? vscode.TreeItemCollapsibleState.Expanded
                : vscode.TreeItemCollapsibleState.None);
        }
        else if (element instanceof function_call_js_1.FunctionCall) {
            return new vscode.TreeItem(`Function call: ${element.func.getName()}()`, element.args.length > 0
                ? vscode.TreeItemCollapsibleState.Expanded
                : vscode.TreeItemCollapsibleState.None);
        }
        else if (element instanceof binary_operation_js_1.BinaryOperation) {
            return new vscode.TreeItem(`Binary operation: a ${element.operator.getSymbol()} b`, vscode.TreeItemCollapsibleState.Expanded);
        }
        else if (element instanceof unary_operation_js_1.UnaryOperation) {
            return new vscode.TreeItem(`Unary operation: ${element.operator.getSymbol()}a`, vscode.TreeItemCollapsibleState.Expanded);
        }
        else if (element instanceof expression_js_1.Expression) {
            return new vscode.TreeItem('Expression', vscode.TreeItemCollapsibleState.Expanded);
        }
        else if (element instanceof base_js_1.KodeValue) {
            return new vscode.TreeItem(`Value: ${element.text}${element.isNumeric ? ' [numeric]' : ''}`, vscode.TreeItemCollapsibleState.None);
        }
        else if (element instanceof base_js_1.Evaluable) {
            return new vscode.TreeItem(`Evaluable: ${element.constructor.name}`, element instanceof base_js_1.KodeValue
                ? vscode.TreeItemCollapsibleState.None
                : vscode.TreeItemCollapsibleState.Expanded);
        }
        else {
            throw new Error('Invalid formula tree item.');
        }
    }
    setFormula(formula) {
        this._formula = formula;
        this._onDidChangeTreeData.fire(undefined);
    }
}
exports.FormulaTreeDataProvider = FormulaTreeDataProvider;
//# sourceMappingURL=formula-tree-data-provider.js.map