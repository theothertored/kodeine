import * as vscode from 'vscode';

import { FormulaEvaluationTree } from '../../engine/dist.node/kodeine.js';

export class EvaluationStepsTextDocumentContentProvider implements vscode.TextDocumentContentProvider {

    public readonly scheme: string = 'formulaevaluationsteps';

    private readonly _path = 'evaluation steps ';

    public onDidChange?: vscode.Event<vscode.Uri> | undefined;
    private _onDidChangeEmitter: vscode.EventEmitter<vscode.Uri>;

    /** Maps source URIs to their evaluation trees. */
    private readonly _sourceUriToEvaluationTreeMap: Map<string, FormulaEvaluationTree>;

    constructor() {
        this._onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
        this.onDidChange = this._onDidChangeEmitter.event;
        this._sourceUriToEvaluationTreeMap = new Map<string, FormulaEvaluationTree>();
    }

    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {

        let sourceUriString = vscode.Uri.parse(decodeURIComponent(uri.query.split('=')[1])).toString();

        let evaluationTree = this._sourceUriToEvaluationTreeMap.get(sourceUriString);

        return evaluationTree?.printEvaluationSteps() ?? '';

    }

    private _getStepsDocumentUri(sourceUri: vscode.Uri) {

        return vscode.Uri.parse(`${this.scheme}:${this._path}?for=${encodeURIComponent(sourceUri.toString())}`);

    }

    registerSource(sourceUri: vscode.Uri, evaluationTree: FormulaEvaluationTree) {

        if (this.isSourceRegistered(sourceUri)) {
            this.notifyDocumentChanged(sourceUri, evaluationTree);
        } else {
            this._sourceUriToEvaluationTreeMap.set(sourceUri.toString(), evaluationTree);
            this._onDidChangeEmitter.fire(this._getStepsDocumentUri(sourceUri));
        }

        return this._getStepsDocumentUri(sourceUri);

    }

    isSourceRegistered(sourceUri: vscode.Uri) {
        return this._sourceUriToEvaluationTreeMap.has(sourceUri.toString());
    }

    notifyDocumentChanged(sourceUri: vscode.Uri, evaluationTree: FormulaEvaluationTree) {

        if (this.isSourceRegistered(sourceUri)) {

            this._sourceUriToEvaluationTreeMap.set(sourceUri.toString(), evaluationTree);
            this._onDidChangeEmitter.fire(this._getStepsDocumentUri(sourceUri));

        }

    }

    notifyDocumentClosed(sourceUri: vscode.Uri) {
        this._sourceUriToEvaluationTreeMap.delete(sourceUri.toString());
    }

}
