"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormulaTreeDataProvider = void 0;
const vscode = require("vscode");
const base_js_1 = require("../../engine/dist.node/base.js");
const evaluation_tree_js_1 = require("../../engine/dist.node/evaluables/evaluation-tree.js");
class FormulaTreeDataProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this._evaluationTree = null;
    }
    getChildren(element) {
        if (!element) {
            if (this._evaluationTree) {
                return [this._evaluationTree];
            }
            else {
                return undefined;
            }
        }
        else if (element instanceof evaluation_tree_js_1.FormulaEvaluationTree) {
            return element.parts;
        }
        else if (element instanceof evaluation_tree_js_1.EvaluatedUnaryOperation) {
            return [element.arg];
        }
        else if (element instanceof evaluation_tree_js_1.EvaluatedBinaryOperation) {
            return [element.argA, element.argB];
        }
        else if (element instanceof evaluation_tree_js_1.EvaluatedFunctionCall) {
            return element.args;
        }
        else if (element instanceof evaluation_tree_js_1.EvaluatedExpression) {
            return [element.child];
        }
        else {
            return undefined;
        }
    }
    getTreeItem(element) {
        let treeItem = new vscode.TreeItem(`${element.result.text}`, element instanceof base_js_1.Literal
            ? vscode.TreeItemCollapsibleState.None
            : vscode.TreeItemCollapsibleState.Collapsed);
        treeItem.description = element.getDescription();
        return treeItem;
    }
    setEvaluationTree(evaluationTree) {
        this._evaluationTree = evaluationTree;
        this._onDidChangeTreeData.fire(undefined);
    }
}
exports.FormulaTreeDataProvider = FormulaTreeDataProvider;
//# sourceMappingURL=evaluation-tree-data-provider.js.map