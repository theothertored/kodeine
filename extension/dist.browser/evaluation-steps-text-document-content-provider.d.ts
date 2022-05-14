import * as vscode from 'vscode';
import { FormulaEvaluationTree } from '../../engine/dist.node/kodeine.js';
/** Handles printing evaluation steps for formula source documents. */
export declare class EvaluationStepsTextDocumentContentProvider implements vscode.TextDocumentContentProvider {
    /** The scheme for virtual documents containing evaluation steps. */
    static readonly scheme: string;
    /** An event emitter for {@link onDidChange}. */
    private _onDidChangeEmitter;
    onDidChange: vscode.Event<vscode.Uri>;
    /** Maps source URIs (stringified) to their latest evaluation trees. */
    private readonly _sourceUriToEvaluationTreeMap;
    /** Extracts a source document URI from the URI of a steps document. */
    private _getSourceDocUriFrom;
    /** Consumed by vscode. Returns a string containing the evaluation steps for a formula source document passed in {@link stepsUri}. */
    provideTextDocumentContent(stepsUri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string>;
    /**
     * Returns an evaluation steps document URI for a given formula source document.
     * @param sourceDoc The formula source document.
     * @returns A steps document URI for the given source document.
     */
    getStepsDocumentUriFor(sourceDoc: vscode.TextDocument): vscode.Uri;
    /**
     * Overwrites the latest evaluation tree for a given formula source document.
     * @param sourceDoc The formula source document to update the evaluation tree for.
     * @param tree The latest evaluation tree for the formula source document.
     */
    updateEvaluationTreeFor(sourceDoc: vscode.TextDocument, tree: FormulaEvaluationTree): void;
    /**
     * Removes the evaluation tree for a given formula source document.
     * Intended to be used after the formula source document was closed and keeping the evaluation tree is no longer necessary.
     * @param sourceDoc The source document to remove the evaluation tree for.
     */
    removeEvaluationTreeFor(sourceDoc: vscode.TextDocument): void;
}
