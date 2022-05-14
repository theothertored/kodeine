"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalDocumentManager = void 0;
const vscode = require("vscode");
const bidirectional_map_js_1 = require("./bidirectional-map.js");
const evaluation_steps_text_document_content_provider_js_1 = require("./evaluation-steps-text-document-content-provider.js");
const global_tree_data_provider_js_1 = require("./global-tree-data-provider.js");
/** Keeps track of global variables and their source documents. */
class GlobalDocumentManager {
    constructor(extCtx) {
        /** A two-way map between global names and their source document. */
        this._globalsMap = new bidirectional_map_js_1.BidirectionalMap();
        /** A {@link vscode.TreeDataProvider} for displaying the global list UI. */
        this._globalTreeDataProvider = new global_tree_data_provider_js_1.GlobalTreeDataProvider();
        /** An event emitter for {@link onGlobalRemoved}. */
        this._onGlobalRemoved = new vscode.EventEmitter();
        /** An event fired when a global is removed. */
        this.onGlobalRemoved = this._onGlobalRemoved.event;
        /** An event emitter for {@link onGlobalAdded}. */
        this._onGlobalAdded = new vscode.EventEmitter();
        /** An event fired when a global is added. */
        this.onGlobalAdded = this._onGlobalAdded.event;
        /** An event emitter for {@link onGlobalsCleared}. */
        this._onGlobalsCleared = new vscode.EventEmitter();
        /** An event fired when all globals are cleared. */
        this.onGlobalsCleared = this._onGlobalsCleared.event;
        // COMMANDS
        this._commands = {
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
                            return 'Global name cannot be empty.';
                        }
                        else if (text.length === 2) {
                            return 'Kustom doesn\'t really like two letter global names because it confuses them with function names.';
                        }
                        else {
                            return null;
                        }
                    }
                }).then(globalName => {
                    if (globalName) {
                        // normalize global name
                        globalName = globalName.trim().toLowerCase();
                        // associate the document with the global name
                        this.addGlobal(globalName, vscode.window.activeTextEditor.document);
                        // notify the user in the way vscode wants us to (notifications can't auto-dismiss)
                        vscode.window.setStatusBarMessage(`gv(${globalName}) has been added.`, GlobalDocumentManager.statusBarMessageTimeout);
                    }
                });
            },
            removeGlobal: (globalDocument) => {
                if (globalDocument) {
                    // a global to remove was given (global list icon click)
                    this.removeGlobal(globalDocument.globalName);
                }
                else {
                    // a global to remove was not given, let the user pick from a list
                    vscode.window.showQuickPick(this.getGlobalDocuments()
                        .map(globalDocument => ({
                        label: globalDocument.globalName,
                        description: globalDocument.doc.uri.toString(),
                        globalDocument
                    }))).then(pickedItem => {
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
            openGlobalDocument: (uri) => {
                vscode.window.showTextDocument(uri);
            }
        };
        this.initGlobalsMap(extCtx);
        this.initCommands(extCtx);
        this.initGlobalListUI(extCtx);
        this.initEvents(extCtx);
    }
    initGlobalsMap(extCtx) {
        // TODO: load globals from storage
    }
    initCommands(extCtx) {
        // register commands from this._commands
        for (const commandName in this._commands) {
            extCtx.subscriptions.push(vscode.commands.registerCommand(`kodeine.${commandName}`, this._commands[commandName]));
        }
    }
    initGlobalListUI(extCtx) {
        // load globals into the global tree data provider
        this._globalTreeDataProvider.updateGlobalDocuments(this.getGlobalDocuments());
        extCtx.subscriptions.push(vscode.window.registerTreeDataProvider(GlobalDocumentManager.globalListViewId, this._globalTreeDataProvider));
    }
    initEvents(extCtx) {
        extCtx.subscriptions.push(vscode.workspace.onDidCloseTextDocument(doc => this.onDidCloseTextDocument(doc)));
    }
    // EVENTS
    onDidCloseTextDocument(doc) {
        if (doc.isUntitled
            && doc.languageId === 'kode'
            && this._globalsMap.hasB(doc)) {
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
    getGlobalNameFor(doc) {
        return this._globalsMap.getByB(doc);
    }
    getGlobalDocuments() {
        return Array.from(this._globalsMap.entries()).map(e => ({ globalName: e[0], doc: e[1] }));
    }
    getIsValidGlobalDocument(doc) {
        return !!doc && doc.languageId === 'kode' && doc.uri.scheme !== evaluation_steps_text_document_content_provider_js_1.EvaluationStepsTextDocumentContentProvider.scheme;
    }
    // ADD, REMOVE, CLEAR
    addGlobal(globalName, doc) {
        this._globalsMap.add(globalName, doc);
        this._onGlobalAdded.fire({ globalName, doc });
        this._notifyGlobalsChanged();
    }
    removeGlobal(globalNameOrDoc) {
        if (typeof globalNameOrDoc === 'string') {
            let doc = this._globalsMap.getByA(globalNameOrDoc);
            if (doc) {
                this._globalsMap.deleteByA(globalNameOrDoc);
                this._onGlobalRemoved.fire({ globalName: globalNameOrDoc, doc });
                this._notifyGlobalsChanged();
            }
        }
        else {
            let globalName = this._globalsMap.getByB(globalNameOrDoc);
            if (globalName) {
                this._globalsMap.deleteByB(globalNameOrDoc);
                this._onGlobalRemoved.fire({ globalName, doc: globalNameOrDoc });
                this._notifyGlobalsChanged();
            }
        }
    }
    clearGlobals() {
        this._globalsMap.clear();
        this._onGlobalsCleared.fire();
        this._notifyGlobalsChanged();
    }
    // NOTIFY
    _notifyGlobalsChanged() {
        this._globalTreeDataProvider.updateGlobalDocuments(this.getGlobalDocuments());
    }
}
exports.GlobalDocumentManager = GlobalDocumentManager;
/** Duration of a status bar message, in ms. */
GlobalDocumentManager.statusBarMessageTimeout = 5000;
/** The id of the view to register the {@link _globalTreeDataProvider} in. */
GlobalDocumentManager.globalListViewId = 'globalList';
//# sourceMappingURL=global-document-manager.js.map