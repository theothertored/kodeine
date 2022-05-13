import { FormulaEvaluationTree } from '../../engine/dist.node/kodeine.js';
import * as vscode from 'vscode';
export declare class EvaluationStepsTextDocumentContentProvider implements vscode.TextDocumentContentProvider {
    readonly scheme: string;
    private readonly _pathPrefix;
    onDidChange?: vscode.Event<vscode.Uri> | undefined;
    private _onDidChangeEmitter;
    private readonly _evaluationTrees;
    constructor();
    private _getTreeName;
    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string>;
    registerEvaluationTree(evaluationTree: FormulaEvaluationTree): vscode.Uri;
    notifyChanged(uri: vscode.Uri): void;
    notifyDocumentClosed(uri: vscode.Uri): void;
}
