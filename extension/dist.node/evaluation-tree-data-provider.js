"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationTreeDataProvider = void 0;
const vscode = require("vscode");
const kodeine_js_1 = require("../../engine/dist.node/kodeine.js");
class EvaluationTreeDataProvider {
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
        else if (element instanceof kodeine_js_1.FormulaEvaluationTree) {
            return element.parts;
        }
        else if (element instanceof kodeine_js_1.EvaluatedUnaryOperation) {
            return [element.arg];
        }
        else if (element instanceof kodeine_js_1.EvaluatedBinaryOperation) {
            return [element.argA, element.argB];
        }
        else if (element instanceof kodeine_js_1.EvaluatedFunctionCall) {
            return element.args;
        }
        else if (element instanceof kodeine_js_1.EvaluatedExpression) {
            return [element.child];
        }
        else {
            return undefined;
        }
    }
    getTreeItem(element) {
        let treeItem = new vscode.TreeItem(`${element.result.text}`, element instanceof kodeine_js_1.Literal
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
exports.EvaluationTreeDataProvider = EvaluationTreeDataProvider;
//# sourceMappingURL=evaluation-tree-data-provider.js.map