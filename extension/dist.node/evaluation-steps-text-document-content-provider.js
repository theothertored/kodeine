"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationStepsTextDocumentContentProvider = void 0;
const vscode = require("vscode");
/** Handles printing evaluation steps for formula source documents. */
class EvaluationStepsTextDocumentContentProvider {
    constructor() {
        /** An event emitter for {@link onDidChange}. */
        this._onDidChangeEmitter = new vscode.EventEmitter();
        this.onDidChange = this._onDidChangeEmitter.event;
        /** Maps source URIs (stringified) to their latest evaluation trees. */
        this._sourceUriToEvaluationTreeMap = new Map();
    }
    /** Extracts a source document URI from the URI of a steps document. */
    static getSourceDocUriFrom(stepsUri) {
        return vscode.Uri.parse(decodeURIComponent(stepsUri.query.split('=')[1]));
    }
    /** Consumed by vscode. Returns a string containing the evaluation steps for a formula source document passed in {@link stepsUri}. */
    provideTextDocumentContent(stepsUri, token) {
        let sourceUriString = EvaluationStepsTextDocumentContentProvider.getSourceDocUriFrom(stepsUri).toString();
        let evaluationTree = this._sourceUriToEvaluationTreeMap.get(sourceUriString);
        return evaluationTree?.printEvaluationSteps() ?? '';
    }
    /**
     * Returns an evaluation steps document URI for a given formula source document.
     * @param sourceDoc The formula source document.
     * @returns A steps document URI for the given source document.
     */
    getStepsDocumentUriFor(sourceDoc) {
        return vscode.Uri.parse(`${EvaluationStepsTextDocumentContentProvider.scheme}:${sourceDoc.fileName}.steps?for=${encodeURIComponent(sourceDoc.uri.toString())}`);
    }
    /**
     * Overwrites the latest evaluation tree for a given formula source document.
     * @param sourceDoc The formula source document to update the evaluation tree for.
     * @param tree The latest evaluation tree for the formula source document.
     */
    updateEvaluationTreeFor(sourceDoc, tree) {
        this._sourceUriToEvaluationTreeMap.set(sourceDoc.uri.toString(), tree);
        this._onDidChangeEmitter.fire(this.getStepsDocumentUriFor(sourceDoc));
    }
    /**
     * Removes the evaluation tree for a given formula source document.
     * Intended to be used after the formula source document was closed and keeping the evaluation tree is no longer necessary.
     * @param sourceDoc The source document to remove the evaluation tree for.
     */
    removeEvaluationTreeFor(sourceDoc) {
        this._sourceUriToEvaluationTreeMap.delete(sourceDoc.uri.toString());
    }
}
exports.EvaluationStepsTextDocumentContentProvider = EvaluationStepsTextDocumentContentProvider;
/** The scheme for virtual documents containing evaluation steps. */
EvaluationStepsTextDocumentContentProvider.scheme = 'formulaevaluationsteps';
//# sourceMappingURL=evaluation-steps-text-document-content-provider.js.map