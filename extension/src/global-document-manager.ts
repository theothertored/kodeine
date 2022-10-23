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

    /** An array of function names to check added global names against. */
    private readonly _functionNames: string[];
    /** An array of special symbols to check added global names against. */
    private readonly _operatorSymbols: string[];

    /**
     * Constructs a {@link GlobalDocumentManager}.
     * @param extCtx The extension context.
     * @param operatorSymbols An array of operator symbols to check added global names for.
     * @param functionNames An array of function names to check added global names against.
     */
    constructor(extCtx: vscode.ExtensionContext, operatorSymbols: string[], functionNames: string[]) {

        this._operatorSymbols = operatorSymbols;
        this._functionNames = functionNames;

        this._initGlobalsMap(extCtx);
        this._initCommands(extCtx);
        this._initGlobalListUI(extCtx);
        this._initEvents(extCtx);

    }

    private _initGlobalsMap(extCtx: vscode.ExtensionContext) {

        // TODO: load globals from storage

    }

    private _initCommands(extCtx: vscode.ExtensionContext) {

        // register commands from this._commands
        for (const commandName in this._commands) {
            extCtx.subscriptions.push(
                vscode.commands.registerCommand(`kodeine.${commandName}`, this._commands[commandName])
            );
        }

    }

    private _initGlobalListUI(extCtx: vscode.ExtensionContext) {

        // load globals into the global tree data provider
        this._globalTreeDataProvider.updateGlobalDocuments(this.getGlobalDocuments());

        extCtx.subscriptions.push(
            vscode.window.registerTreeDataProvider(GlobalDocumentManager.globalListViewId, this._globalTreeDataProvider)
        );

    }

    private _initEvents(extCtx: vscode.ExtensionContext) {
        extCtx.subscriptions.push(
            vscode.workspace.onDidCloseTextDocument(doc => this._onDidCloseTextDocument(doc))
        );
    }


    // EVENTS

    private _onDidCloseTextDocument(doc: vscode.TextDocument): any {

        if (
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

                    } else if (text.endsWith('!')) {

                        // the text ends with an exclamation mark, bypass validation
                        return null;

                    } else {

                        // global name is not empty

                        // check for function name collisions

                        let segments = text.split('/');
                        let segmentIssues: { i: number, seg: string, msg: string }[] = [];
                        let quotationMarksEncountered = false;

                        for (let i = 0; i < segments.length; i++) {

                            const seg = segments[i];

                            let addIssue = (msg: string) => {
                                segmentIssues.push({ i, seg, msg });
                            }

                            if (seg === '') {
                                addIssue('is empty.');

                            } else {


                                if (seg.trimStart().length !== seg.length)
                                    addIssue('has leading whitespace.');


                                if (seg.trimEnd().length !== seg.length)
                                    addIssue('has trailing whitespace.');

                                if (seg.trim().length === 2 && this._functionNames.includes(seg.trim())) {

                                    addIssue('collides with function name. Kustom will throw "err: null".');

                                } else {

                                    if (seg.trim().length > 8)
                                        addIssue('is longer than 8 characters.');

                                    this._operatorSymbols.forEach(symbol => {

                                        if (seg.startsWith(symbol))
                                            addIssue(`starts or ends with operator "${symbol}".`);

                                        if (seg.endsWith(symbol))
                                            addIssue(`ends with operator "${symbol}".`);

                                    });

                                    ['+', '=', '!=', '~='].forEach(symbol => {
                                        if (seg.includes(symbol))
                                            addIssue(`contains operator "${symbol}" that doesn't have a generic string mode.`);
                                    });

                                    ['(', ')', '$', ',', '!', '~'].forEach(char => {
                                        if (seg.includes(char))
                                            addIssue(`contains a special character "${char}".`);
                                    });

                                    if (seg.includes('"')) {
                                        quotationMarksEncountered = true;
                                        addIssue('contains a quotation mark.');
                                    }
                                }

                            }
                        }

                        if (segmentIssues.length > 0) {

                            return `${segmentIssues.length} ${segmentIssues.length === 1 ? 'issue' : 'issues'} detected:\n`
                                + `${segmentIssues.map(iss => `- ${segments.length > 1 ? `Segment #${iss.i + 1} (${iss.seg})` : 'Name'} ${iss.msg}`).join('\n')}\n`
                                + (
                                    quotationMarksEncountered
                                        ? `This name contains at least one quotation mark. You should only continue if you know what you are doing.\n`
                                        : `This name should be used as a quoted string (ex. gv("${text}")).\n`
                                )
                                + `Type ! after the global name to bypass this warning.`
                        }

                        // if we got this far, the name is fine
                        return null;
                    }

                }

            }).then(globalName => {

                if (globalName) {

                    // normalize global name
                    globalName = globalName.trim().toLowerCase();

                    // remove the validation override character from the end, if it's there
                    if (globalName.endsWith('!'))
                        globalName = globalName.substring(0, globalName.length - 1);

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
