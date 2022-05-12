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
class EvaluationResultTreeElement {
    constructor(result) {
        this.result = result;
    }
}
class FormulaPartsTreeElement {
    constructor(parts) {
        this.parts = parts;
    }
}
class ArgumentsTreeElement {
    constructor(args) {
        this.args = args;
    }
}
class FormulaTreeDataProvider {
    constructor(evalCtx) {
        this._formula = null;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this._evalCtx = evalCtx;
    }
    getEvalResult(element) {
        return new EvaluationResultTreeElement(element.evaluate(this._evalCtx));
    }
    getChildren(element) {
        if (!element) {
            return this._formula ? [this._formula] : undefined;
        }
        else if (element instanceof formula_js_1.Formula) {
            return [this.getEvalResult(element), new FormulaPartsTreeElement(element.evaluables)];
        }
        else if (element instanceof function_call_js_1.FunctionCall) {
            return [this.getEvalResult(element), new ArgumentsTreeElement(element.args)];
        }
        else if (element instanceof binary_operation_js_1.BinaryOperation) {
            return [this.getEvalResult(element), new ArgumentsTreeElement([element.argA, element.argB])];
        }
        else if (element instanceof unary_operation_js_1.UnaryOperation) {
            return [this.getEvalResult(element), new ArgumentsTreeElement([element.arg])];
        }
        else if (element instanceof expression_js_1.Expression) {
            return [this.getEvalResult(element), element.evaluable];
        }
        else if (element instanceof ArgumentsTreeElement) {
            return element.args;
        }
        else if (element instanceof FormulaPartsTreeElement) {
            return element.parts;
        }
        else {
            return undefined;
        }
    }
    getTreeItem(element) {
        let treeItem;
        if (element instanceof base_js_1.Evaluable) {
            if (element instanceof formula_js_1.Formula) {
                treeItem = new vscode.TreeItem(`Formula (${element.evaluables.length} part${element.evaluables.length === 1 ? '' : 's'})`, vscode.TreeItemCollapsibleState.Expanded);
            }
            else if (element instanceof function_call_js_1.FunctionCall) {
                treeItem = new vscode.TreeItem(`${element.func.getName()}(${element.args.map(a => a.evaluate(this._evalCtx).text).join(', ')})`, vscode.TreeItemCollapsibleState.Collapsed);
                treeItem.description = 'function call';
            }
            else if (element instanceof binary_operation_js_1.BinaryOperation) {
                treeItem = new vscode.TreeItem(`${element.argA.evaluate(this._evalCtx).text} ${element.operator.getSymbol()} ${element.argB.evaluate(this._evalCtx).text}`, vscode.TreeItemCollapsibleState.Collapsed);
                treeItem.description = 'binary operation';
            }
            else if (element instanceof unary_operation_js_1.UnaryOperation) {
                treeItem = new vscode.TreeItem(`${element.operator.getSymbol()}${element.arg.evaluate(this._evalCtx).text}`, vscode.TreeItemCollapsibleState.Collapsed);
                treeItem.description = 'unary operation';
            }
            else if (element instanceof expression_js_1.Expression) {
                treeItem = new vscode.TreeItem('Expression', vscode.TreeItemCollapsibleState.Collapsed);
            }
            else if (element instanceof base_js_1.KodeValue) {
                treeItem = new vscode.TreeItem(element.text, vscode.TreeItemCollapsibleState.None);
                treeItem.description = element.isNumeric ? 'numeric value' : 'value';
            }
            else {
                treeItem = new vscode.TreeItem(`${element.constructor.name}`, vscode.TreeItemCollapsibleState.None);
                treeItem.description = 'generic evaluable';
            }
            return treeItem;
        }
        else if (element instanceof EvaluationResultTreeElement) {
            treeItem = new vscode.TreeItem(`Result: ${element.result.text}`, vscode.TreeItemCollapsibleState.None);
            if (element.result.text === '') {
                treeItem.description = "(empty string)";
            }
        }
        else if (element instanceof ArgumentsTreeElement) {
            treeItem = new vscode.TreeItem(element.args.length === 1 ? 'Argument' : `${element.args.length} arguments`, vscode.TreeItemCollapsibleState.Collapsed);
        }
        else if (element instanceof FormulaPartsTreeElement) {
            treeItem = new vscode.TreeItem(element.parts.length === 1 ? '1 part' : `${element.parts.length} parts`, vscode.TreeItemCollapsibleState.Expanded);
        }
        else {
            throw new Error('Invalid formula tree item.');
        }
        return treeItem;
    }
    setFormula(formula) {
        this._formula = formula;
        this._onDidChangeTreeData.fire(undefined);
    }
}
exports.FormulaTreeDataProvider = FormulaTreeDataProvider;
//# sourceMappingURL=formula-tree-data-provider.js.map