"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalTreeDataProvider = void 0;
const vscode = require("vscode");
class GlobalTreeDataProvider {
    constructor() {
        this.openGlobalDocumentCommand = 'kodeine.openGlobalDocument';
        this.openGlobalDocumentCommandTitle = 'Open global document';
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this._globalDocuments = [];
    }
    getTreeItem(element) {
        return {
            label: element.globalName,
            description: decodeURIComponent(element.doc.uri.toString()),
            collapsibleState: vscode.TreeItemCollapsibleState.None,
            command: {
                title: this.openGlobalDocumentCommandTitle,
                command: this.openGlobalDocumentCommand,
                arguments: [element.doc.uri]
            }
        };
    }
    getChildren(element) {
        if (!element)
            return this._globalDocuments;
        else
            return undefined;
    }
    updateGlobalDocuments(globalDocuments) {
        this._globalDocuments = globalDocuments;
        this._onDidChangeTreeData.fire(undefined);
    }
}
exports.GlobalTreeDataProvider = GlobalTreeDataProvider;
//# sourceMappingURL=global-tree-data-provider.js.map