import * as vscode from 'vscode';
/** A helper type containing a related global name and its source document. */
export declare type GlobalDocument = {
    globalName: string;
    doc: vscode.TextDocument;
};
/** Keeps track of global variables and their source documents. */
export declare class GlobalDocumentManager {
    /** Duration of a status bar message, in ms. */
    static readonly statusBarMessageTimeout = 5000;
    /** The id of the view to register the {@link _globalTreeDataProvider} in. */
    static readonly globalListViewId = "globalList";
    /** A two-way map between global names and their source document. */
    private readonly _globalsMap;
    /** A {@link vscode.TreeDataProvider} for displaying the global list UI. */
    private readonly _globalTreeDataProvider;
    /** An event emitter for {@link onGlobalRemoved}. */
    private readonly _onGlobalRemoved;
    /** An event fired when a global is removed. */
    readonly onGlobalRemoved: vscode.Event<GlobalDocument>;
    /** An event emitter for {@link onGlobalAdded}. */
    private readonly _onGlobalAdded;
    /** An event fired when a global is added. */
    readonly onGlobalAdded: vscode.Event<GlobalDocument>;
    /** An event emitter for {@link onGlobalsCleared}. */
    private readonly _onGlobalsCleared;
    /** An event fired when all globals are cleared. */
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
    private _notifyGlobalsChanged;
    private readonly _commands;
}
