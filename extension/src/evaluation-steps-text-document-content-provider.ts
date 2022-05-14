import * as vscode from 'vscode';

import { FormulaEvaluationTree } from '../../engine/dist.node/kodeine.js';

export class EvaluationStepsTextDocumentContentProvider implements vscode.TextDocumentContentProvider {
    
    static readonly scheme: string = 'formulaevaluationsteps';

    public onDidChange?: vscode.Event<vscode.Uri> | undefined;
    private _onDidChangeEmitter: vscode.EventEmitter<vscode.Uri>;

    /** Maps source URIs to their evaluation trees. */
    private readonly _sourceUriToEvaluationTreeMap: Map<string, FormulaEvaluationTree>;

    constructor() {
        this._onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
        this.onDidChange = this._onDidChangeEmitter.event;
        this._sourceUriToEvaluationTreeMap = new Map<string, FormulaEvaluationTree>();
    }

    private _getSourceDocUriFrom(stepsUri: vscode.Uri): vscode.Uri {
        return vscode.Uri.parse(decodeURIComponent(stepsUri.query.split('=')[1]))
    }

    provideTextDocumentContent(stepsUri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {

        let sourceUriString = this._getSourceDocUriFrom(stepsUri).toString();

        let evaluationTree = this._sourceUriToEvaluationTreeMap.get(sourceUriString);

        return evaluationTree?.printEvaluationSteps() ?? '';

    }

    getStepsDocumentUriFor(sourceDoc: vscode.TextDocument): vscode.Uri {

        return vscode.Uri.parse(`${EvaluationStepsTextDocumentContentProvider.scheme}:${sourceDoc.fileName}.steps?for=${encodeURIComponent(sourceDoc.uri.toString())}`);

    }

    updateEvaluationTreeFor(sourceDoc: vscode.TextDocument, tree: FormulaEvaluationTree): void {

        this._sourceUriToEvaluationTreeMap.set(sourceDoc.uri.toString(), tree);
        this._onDidChangeEmitter.fire(this.getStepsDocumentUriFor(sourceDoc));

    }

    removeEvaluationTreeFor(sourceDoc: vscode.TextDocument) {
        this._sourceUriToEvaluationTreeMap.delete(sourceDoc.uri.toString());
    }


    notifyDocumentClosed(sourceDoc: vscode.TextDocument): void {
        this._sourceUriToEvaluationTreeMap.delete(sourceDoc.uri.toString());
    }

}
