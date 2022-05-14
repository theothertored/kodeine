import * as vscode from 'vscode';
import { FormulaEvaluationTree } from '../../engine/dist.node/kodeine.js';
export declare class EvaluationStepsTextDocumentContentProvider implements vscode.TextDocumentContentProvider {
    static readonly scheme: string;
    onDidChange?: vscode.Event<vscode.Uri> | undefined;
    private _onDidChangeEmitter;
    /** Maps source URIs to their evaluation trees. */
    private readonly _sourceUriToEvaluationTreeMap;
    constructor();
    private _getSourceDocUriFrom;
    provideTextDocumentContent(stepsUri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string>;
    getStepsDocumentUriFor(sourceDoc: vscode.TextDocument): vscode.Uri;
    updateEvaluationTreeFor(sourceDoc: vscode.TextDocument, tree: FormulaEvaluationTree): void;
    removeEvaluationTreeFor(sourceDoc: vscode.TextDocument): void;
    notifyDocumentClosed(sourceDoc: vscode.TextDocument): void;
}
