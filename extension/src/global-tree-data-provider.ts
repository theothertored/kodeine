import * as vscode from 'vscode';

export class TextDocumentGlobal {

    public readonly name: string;
    public readonly document: vscode.TextDocument;

    constructor(name: string, document: vscode.TextDocument) {
        this.name = name;
        this.document = document;
    }

}

export class GlobalTreeDataProvider implements vscode.TreeDataProvider<TextDocumentGlobal> {

    private _onDidChangeTreeData: vscode.EventEmitter<TextDocumentGlobal | undefined | void> = new vscode.EventEmitter<TextDocumentGlobal | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<TextDocumentGlobal | undefined | void> = this._onDidChangeTreeData.event;

    private _globals: TextDocumentGlobal[];

    constructor(globalNames: TextDocumentGlobal[]) {
        this._globals = globalNames;
    }

    getTreeItem(element: TextDocumentGlobal): vscode.TreeItem | Thenable<vscode.TreeItem> {
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

    getChildren(element?: TextDocumentGlobal): vscode.ProviderResult<TextDocumentGlobal[]> {

        if (element)
            return undefined;
        else
            return this._globals;

    }

    notifyGlobalsChanged(globalNames: TextDocumentGlobal[]) {
        this._globals = globalNames;
        this._onDidChangeTreeData.fire(undefined);
    }
}