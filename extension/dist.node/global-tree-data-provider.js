"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalTreeDataProvider = exports.TextDocumentGlobal = void 0;
const vscode = require("vscode");
class TextDocumentGlobal {
    constructor(name, document) {
        this.name = name;
        this.document = document;
    }
}
exports.TextDocumentGlobal = TextDocumentGlobal;
class GlobalTreeDataProvider {
    constructor(globalNames) {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this._globals = globalNames;
    }
    getTreeItem(element) {
        return {
            label: element.name,
            description: element.document.uri.toString(),
            collapsibleState: vscode.TreeItemCollapsibleState.None,
            command: {
                title: 'Open global document',
                command: 'kodeine.openGlobalDocument',
                arguments: [element.document.uri]
            }
        };
    }
    getChildren(element) {
        if (element)
            return undefined;
        else
            return this._globals;
    }
    notifyGlobalsChanged(globalNames) {
        this._globals = globalNames;
        this._onDidChangeTreeData.fire(undefined);
    }
}
exports.GlobalTreeDataProvider = GlobalTreeDataProvider;
//# sourceMappingURL=global-tree-data-provider.js.map