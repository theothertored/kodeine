"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalTreeDataProvider = void 0;
const vscode = require("vscode");
/** An adapter between {@link GlobalDocument}s and vscode's tree view. */
class GlobalTreeDataProvider {
    constructor() {
        /** The command to execute when a global document is selected on the list. */
        this.openGlobalDocumentCommand = 'kodeine.openGlobalDocument';
        /** The title for the command. I'm not sure if there is a point in setting this. */
        this.openGlobalDocumentCommandTitle = 'Open global document';
        /** The current list of global documents. */
        this._globalDocuments = [];
        /** An event emitter for {@link onDidChangeTreeData}. */
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
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
    /** Replaces the current list of global documents and notifies vscode that it should update the tree view. */
    updateGlobalDocuments(globalDocuments) {
        this._globalDocuments = globalDocuments;
        this._onDidChangeTreeData.fire(undefined);
    }
}
exports.GlobalTreeDataProvider = GlobalTreeDataProvider;
//# sourceMappingURL=global-tree-data-provider.js.map