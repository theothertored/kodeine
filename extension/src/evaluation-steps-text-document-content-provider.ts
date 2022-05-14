import * as vscode from 'vscode';

import { FormulaEvaluationTree } from '../../engine/dist.node/kodeine.js';

/** Handles printing evaluation steps for formula source documents. */
export class EvaluationStepsTextDocumentContentProvider implements vscode.TextDocumentContentProvider {
    
    /** The scheme for virtual documents containing evaluation steps. */
    static readonly scheme: string = 'formulaevaluationsteps';

    /** An event emitter for {@link onDidChange}. */
    private _onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
    public onDidChange = this._onDidChangeEmitter.event;

    /** Maps source URIs (stringified) to their latest evaluation trees. */
    private readonly _sourceUriToEvaluationTreeMap = new Map<string, FormulaEvaluationTree>();

    /** Extracts a source document URI from the URI of a steps document. */
    private _getSourceDocUriFrom(stepsUri: vscode.Uri): vscode.Uri {
        return vscode.Uri.parse(decodeURIComponent(stepsUri.query.split('=')[1]))
    }

    /** Consumed by vscode. Returns a string containing the evaluation steps for a formula source document passed in {@link stepsUri}. */
    provideTextDocumentContent(stepsUri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {

        let sourceUriString = this._getSourceDocUriFrom(stepsUri).toString();

        let evaluationTree = this._sourceUriToEvaluationTreeMap.get(sourceUriString);

        return evaluationTree?.printEvaluationSteps() ?? '';

    }

    /**
     * Returns an evaluation steps document URI for a given formula source document.
     * @param sourceDoc The formula source document.
     * @returns A steps document URI for the given source document.
     */
    getStepsDocumentUriFor(sourceDoc: vscode.TextDocument): vscode.Uri {

        return vscode.Uri.parse(`${EvaluationStepsTextDocumentContentProvider.scheme}:${sourceDoc.fileName}.steps?for=${encodeURIComponent(sourceDoc.uri.toString())}`);

    }

    /**
     * Overwrites the latest evaluation tree for a given formula source document.
     * @param sourceDoc The formula source document to update the evaluation tree for.
     * @param tree The latest evaluation tree for the formula source document.
     */
    updateEvaluationTreeFor(sourceDoc: vscode.TextDocument, tree: FormulaEvaluationTree): void {

        this._sourceUriToEvaluationTreeMap.set(sourceDoc.uri.toString(), tree);
        this._onDidChangeEmitter.fire(this.getStepsDocumentUriFor(sourceDoc));

    }

    /**
     * Removes the evaluation tree for a given formula source document.
     * Intended to be used after the formula source document was closed and keeping the evaluation tree is no longer necessary.
     * @param sourceDoc The source document to remove the evaluation tree for.
     */
    removeEvaluationTreeFor(sourceDoc: vscode.TextDocument): void {
        this._sourceUriToEvaluationTreeMap.delete(sourceDoc.uri.toString());
    }

}