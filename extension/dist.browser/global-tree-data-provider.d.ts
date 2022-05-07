import * as vscode from 'vscode';
export declare class TextDocumentGlobal {
    readonly name: string;
    readonly document: vscode.TextDocument;
    constructor(name: string, document: vscode.TextDocument);
}
export declare class GlobalTreeDataProvider implements vscode.TreeDataProvider<TextDocumentGlobal> {
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<TextDocumentGlobal | undefined | void>;
    private _globals;
    constructor(globalNames: TextDocumentGlobal[]);
    getTreeItem(element: TextDocumentGlobal): vscode.TreeItem | Thenable<vscode.TreeItem>;
    getChildren(element?: TextDocumentGlobal): vscode.ProviderResult<TextDocumentGlobal[]>;
    notifyGlobalsChanged(globalNames: TextDocumentGlobal[]): void;
}
