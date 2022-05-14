import * as vscode from 'vscode';
import { BidirectionalMap } from './bidirectional-map';
import { GlobalDocument } from './global-document-manager';

export class GlobalTreeDataProvider implements vscode.TreeDataProvider<GlobalDocument> {

    private readonly openGlobalDocumentCommand = 'kodeine.openGlobalDocument';
    private readonly openGlobalDocumentCommandTitle = 'Open global document';

    private _globalDocuments: GlobalDocument[];

    private _onDidChangeTreeData: vscode.EventEmitter<GlobalDocument | undefined | void> = new vscode.EventEmitter<GlobalDocument | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<GlobalDocument | undefined | void> = this._onDidChangeTreeData.event;

    constructor() {
        this._globalDocuments = [];
    }

    getTreeItem(element: GlobalDocument): vscode.TreeItem | Thenable<vscode.TreeItem> {
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

    getChildren(element?: GlobalDocument): vscode.ProviderResult<GlobalDocument[]> {

        if (!element)
            return this._globalDocuments;
        else
            return undefined;

    }

    updateGlobalDocuments(globalDocuments: GlobalDocument[]) {
        this._globalDocuments = globalDocuments;
        this._onDidChangeTreeData.fire(undefined);
    }

}