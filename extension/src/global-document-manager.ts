import * as vscode from 'vscode';
import { BidirectionalMap } from './bidirectional-map.js';
import { EvaluationStepsTextDocumentContentProvider } from './evaluation-steps-text-document-content-provider.js';
import { GlobalTreeDataProvider } from './global-tree-data-provider.js';

/** A helper type containing a related global name and its source document. */
export type GlobalDocument = { globalName: string, doc: vscode.TextDocument };

/** Keeps track of global variables and their source documents. */
export class GlobalDocumentManager {

    /** Duration of a status bar message, in ms. */
    public static readonly statusBarMessageTimeout = 5000;
    /** The id of the view to register the {@link _globalTreeDataProvider} in. */
    public static readonly globalListViewId = 'globalList';

    /** A two-way map between global names and their source document. */
    private readonly _globalsMap = new BidirectionalMap<string, vscode.TextDocument>();
    /** A {@link vscode.TreeDataProvider} for displaying the global list UI. */
    private readonly _globalTreeDataProvider: GlobalTreeDataProvider = new GlobalTreeDataProvider();

    /** An event emitter for {@link onGlobalRemoved}. */
    private readonly _onGlobalRemoved = new vscode.EventEmitter<GlobalDocument>();
    /** An event fired when a global is removed. */
    public readonly onGlobalRemoved = this._onGlobalRemoved.event;
    
    /** An event emitter for {@link onGlobalAdded}. */
    private readonly _onGlobalAdded = new vscode.EventEmitter<GlobalDocument>();
    /** An event fired when a global is added. */
    public readonly onGlobalAdded = this._onGlobalAdded.event;
    
    /** An event emitter for {@link onGlobalsCleared}. */
    private readonly _onGlobalsCleared = new vscode.EventEmitter<void>();
    /** An event fired when all globals are cleared. */
    public readonly onGlobalsCleared = this._onGlobalsCleared.event;

    constructor(extCtx: vscode.ExtensionContext) {

        this.initGlobalsMap(extCtx);
        this.initCommands(extCtx);
        this.initGlobalListUI(extCtx);
        this.initEvents(extCtx);

    }

    initGlobalsMap(extCtx: vscode.ExtensionContext) {

        // TODO: load globals from storage

    }

    initCommands(extCtx: vscode.ExtensionContext) {

        // register commands from this._commands
        for (const commandName in this._commands) {
            extCtx.subscriptions.push(
                vscode.commands.registerCommand(`kodeine.${commandName}`, this._commands[commandName])
            );
        }

    }

    initGlobalListUI(extCtx: vscode.ExtensionContext) {

        // load globals into the global tree data provider
        this._globalTreeDataProvider.updateGlobalDocuments(this.getGlobalDocuments());

        extCtx.subscriptions.push(
            vscode.window.registerTreeDataProvider(GlobalDocumentManager.globalListViewId, this._globalTreeDataProvider)
        );

    }

    initEvents(extCtx: vscode.ExtensionContext) {
        extCtx.subscriptions.push(
            vscode.workspace.onDidCloseTextDocument(doc => this.onDidCloseTextDocument(doc))
        );
    }


    // EVENTS

    onDidCloseTextDocument(doc: vscode.TextDocument): any {
        
        if(
            doc.isUntitled
            && doc.languageId === 'kode' 
            && this._globalsMap.hasB(doc)
        ) {
            // an untitled document backing a global was closed, delete the global and inform the user
            let globalName = this.getGlobalNameFor(doc);
            this.removeGlobal(doc);

            vscode.window.showWarningMessage(`gv(${globalName}) has been removed.`, {
                detail: `The untitled document gv(${globalName}) was linked to was closed.`,
                modal: true
            });
        }

    }



    // GET

    getGlobalNameFor(doc: vscode.TextDocument): string | undefined {
        return this._globalsMap.getByB(doc);
    }

    getGlobalDocuments(): GlobalDocument[] {
        return Array.from(this._globalsMap.entries()).map(e => ({ globalName: e[0], doc: e[1] }))
    }

    getIsValidGlobalDocument(doc?: vscode.TextDocument): boolean {
        return !!doc && doc.languageId === 'kode' && doc.uri.scheme !== EvaluationStepsTextDocumentContentProvider.scheme;
    }


    // ADD, REMOVE, CLEAR

    addGlobal(globalName: string, doc: vscode.TextDocument) {

        this._globalsMap.add(globalName, doc);
        this._onGlobalAdded.fire({ globalName, doc })
        this._notifyGlobalsChanged();

    }

    removeGlobal(globalNameOrDoc: string | vscode.TextDocument) {

        if (typeof globalNameOrDoc === 'string') {

            let doc = this._globalsMap.getByA(globalNameOrDoc);

            if (doc) {
                this._globalsMap.deleteByA(globalNameOrDoc);
                this._onGlobalRemoved.fire({ globalName: globalNameOrDoc, doc });
                this._notifyGlobalsChanged();
            }


        } else {

            let globalName = this._globalsMap.getByB(globalNameOrDoc);

            if (globalName) {
                this._globalsMap.deleteByB(globalNameOrDoc);
                this._onGlobalRemoved.fire({ globalName, doc: globalNameOrDoc });
                this._notifyGlobalsChanged();
            }
        }


    }

    clearGlobals(): void {

        this._globalsMap.clear();
        this._onGlobalsCleared.fire();
        this._notifyGlobalsChanged();

    }


    // NOTIFY

    private _notifyGlobalsChanged(): void {
        this._globalTreeDataProvider.updateGlobalDocuments(this.getGlobalDocuments());
    }


    // COMMANDS

    private readonly _commands: Record<string, (...args: any) => any> = {

        addGlobal: () => {

            // check if the current document is a valid global document
            if (!this.getIsValidGlobalDocument(vscode.window.activeTextEditor?.document)) {
                return;
            }

            vscode.window.showInputBox({

                title: 'Name the global',
                prompt: 'Remember that Kustom limits this name to 8 characters.',

                validateInput: text => {
                    if (!text) {
                        return 'Global name cannot be empty.'
                    } else if (text.length === 2) {
                        return 'Kustom doesn\'t really like two letter global names because it confuses them with function names.';
                    } else {
                        return null;
                    }
                }

            }).then(globalName => {

                if (globalName) {

                    // normalize global name
                    globalName = globalName.trim().toLowerCase();

                    // associate the document with the global name
                    this.addGlobal(globalName, vscode.window.activeTextEditor!.document);

                    // notify the user in the way vscode wants us to (notifications can't auto-dismiss)
                    vscode.window.setStatusBarMessage(`gv(${globalName}) has been added.`, GlobalDocumentManager.statusBarMessageTimeout);

                }

            });

        },

        removeGlobal: (globalDocument?: GlobalDocument) => {

            if (globalDocument) {

                // a global to remove was given (global list icon click)
                this.removeGlobal(globalDocument.globalName);

            } else {

                // a global to remove was not given, let the user pick from a list
                vscode.window.showQuickPick(

                    this.getGlobalDocuments()
                        .map(globalDocument => ({
                            label: globalDocument.globalName,
                            description: globalDocument.doc.uri.toString(),
                            globalDocument
                        }))

                ).then(pickedItem => {

                    if (pickedItem) {

                        this.removeGlobal(pickedItem.globalDocument.globalName);

                        // notify the user in the way vscode wants us to (notifications can't auto-dismiss)
                        vscode.window.setStatusBarMessage(`gv(${pickedItem.globalDocument.globalName}) has been removed.`, GlobalDocumentManager.statusBarMessageTimeout);

                    }

                });

            }

        },

        clearGlobals: () => {

            this.clearGlobals();
            vscode.window.setStatusBarMessage(`All globals have been removed.`, GlobalDocumentManager.statusBarMessageTimeout);

        },

        openGlobalDocument: (uri: vscode.Uri) => {

            vscode.window.showTextDocument(uri);

        }

    };

}
