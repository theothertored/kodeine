import * as vscode from 'vscode';
import { FormulaEvaluationTree } from '../../engine/dist.node/kodeine.js';
export declare class EvaluationStepsTextDocumentContentProvider implements vscode.TextDocumentContentProvider {
    readonly scheme: string;
    private readonly _path;
    onDidChange?: vscode.Event<vscode.Uri> | undefined;
    private _onDidChangeEmitter;
    /** Maps source URIs to their evaluation trees. */
    private readonly _sourceUriToEvaluationTreeMap;
    constructor();
    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string>;
    private _getStepsDocumentUri;
    registerSource(sourceUri: vscode.Uri, evaluationTree: FormulaEvaluationTree): vscode.Uri;
    isSourceRegistered(sourceUri: vscode.Uri): boolean;
    notifyDocumentChanged(sourceUri: vscode.Uri, evaluationTree: FormulaEvaluationTree): void;
    notifyDocumentClosed(sourceUri: vscode.Uri): void;
}
