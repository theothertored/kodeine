import * as vscode from 'vscode';
export declare type GlobalDocument = {
    globalName: string;
    doc: vscode.TextDocument;
};
export declare class GlobalDocumentManager {
    static readonly statusBarMessageTimeout = 5000;
    static readonly globalListViewId = "globalList";
    private readonly _globalsMap;
    private readonly _globalTreeDataProvider;
    private readonly _onGlobalRemoved;
    readonly onGlobalRemoved: vscode.Event<GlobalDocument>;
    private readonly _onGlobalAdded;
    readonly onGlobalAdded: vscode.Event<GlobalDocument>;
    private readonly _onGlobalsCleared;
    readonly onGlobalsCleared: vscode.Event<void>;
    constructor(extCtx: vscode.ExtensionContext);
    initGlobalsMap(extCtx: vscode.ExtensionContext): void;
    initCommands(extCtx: vscode.ExtensionContext): void;
    initGlobalListUI(extCtx: vscode.ExtensionContext): void;
    initEvents(extCtx: vscode.ExtensionContext): void;
    onDidCloseTextDocument(doc: vscode.TextDocument): any;
    getGlobalNameFor(doc: vscode.TextDocument): string | undefined;
    getGlobalDocuments(): GlobalDocument[];
    getIsValidGlobalDocument(doc?: vscode.TextDocument): boolean;
    addGlobal(globalName: string, doc: vscode.TextDocument): void;
    removeGlobal(globalNameOrDoc: string | vscode.TextDocument): void;
    clearGlobals(): void;
    notifyGlobalsChanged(): void;
    private readonly _commands;
}
