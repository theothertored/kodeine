import * as vscode from 'vscode';
import { BidirectionalMap } from './bidirectional-map';
import { GlobalDocument } from './global-document-manager';

/** An adapter between {@link GlobalDocument}s and vscode's tree view. */
export class GlobalTreeDataProvider implements vscode.TreeDataProvider<GlobalDocument> {

    /** The command to execute when a global document is selected on the list. */
    private readonly openGlobalDocumentCommand = 'kodeine.openGlobalDocument';
    /** The title for the command. I'm not sure if there is a point in setting this. */
    private readonly openGlobalDocumentCommandTitle = 'Open global document';

    /** The current list of global documents. */
    private _globalDocuments: GlobalDocument[] = [];

    /** An event emitter for {@link onDidChangeTreeData}. */
    private _onDidChangeTreeData = new vscode.EventEmitter<GlobalDocument | undefined | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

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

    /** Replaces the current list of global documents and notifies vscode that it should update the tree view. */
    updateGlobalDocuments(globalDocuments: GlobalDocument[]) {
        this._globalDocuments = globalDocuments;
        this._onDidChangeTreeData.fire(undefined);
    }

}