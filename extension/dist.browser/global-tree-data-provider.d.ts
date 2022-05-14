import * as vscode from 'vscode';
import { GlobalDocument } from './global-document-manager';
export declare class GlobalTreeDataProvider implements vscode.TreeDataProvider<GlobalDocument> {
    private readonly openGlobalDocumentCommand;
    private readonly openGlobalDocumentCommandTitle;
    private _globalDocuments;
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<GlobalDocument | undefined | void>;
    constructor();
    getTreeItem(element: GlobalDocument): vscode.TreeItem | Thenable<vscode.TreeItem>;
    getChildren(element?: GlobalDocument): vscode.ProviderResult<GlobalDocument[]>;
    updateGlobalDocuments(globalDocuments: GlobalDocument[]): void;
}
