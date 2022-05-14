import * as vscode from 'vscode';
import { GlobalDocument } from './global-document-manager';
/** An adapter between {@link GlobalDocument}s and vscode's tree view. */
export declare class GlobalTreeDataProvider implements vscode.TreeDataProvider<GlobalDocument> {
    /** The command to execute when a global document is selected on the list. */
    private readonly openGlobalDocumentCommand;
    /** The title for the command. I'm not sure if there is a point in setting this. */
    private readonly openGlobalDocumentCommandTitle;
    /** The current list of global documents. */
    private _globalDocuments;
    /** An event emitter for {@link onDidChangeTreeData}. */
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<void | GlobalDocument | undefined>;
    getTreeItem(element: GlobalDocument): vscode.TreeItem | Thenable<vscode.TreeItem>;
    getChildren(element?: GlobalDocument): vscode.ProviderResult<GlobalDocument[]>;
    /** Replaces the current list of global documents and notifies vscode that it should update the tree view. */
    updateGlobalDocuments(globalDocuments: GlobalDocument[]): void;
}
