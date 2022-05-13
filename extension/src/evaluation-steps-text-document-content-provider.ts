import { EvaluationStepReplacement, FormulaEvaluationTree } from '../../engine/dist.node/kodeine.js';
import * as vscode from 'vscode';

export class EvaluationStepsTextDocumentContentProvider implements vscode.TextDocumentContentProvider {

    public readonly scheme: string = 'formulaevaluationsteps';

    private readonly _pathPrefix = 'evaluation steps ';

    public onDidChange?: vscode.Event<vscode.Uri> | undefined;
    private _onDidChangeEmitter: vscode.EventEmitter<vscode.Uri>;

    private readonly _evaluationTrees: Map<string, FormulaEvaluationTree>;

    constructor() {
        this._onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
        this.onDidChange = this._onDidChangeEmitter.event;
        this._evaluationTrees = new Map<string, FormulaEvaluationTree>();
    }

    private _getTreeName(uri: vscode.Uri): string {
        return uri.path.replace(this._pathPrefix, '');
    }

    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {

        let name = this._getTreeName(uri);
        let evaluationTree = this._evaluationTrees.get(name);

        if (evaluationTree) {

            let originalText = evaluationTree.formula.getSourceText();

            // get source text replacements for evaluation steps
            let stepReplacements: EvaluationStepReplacement[] = [];
            evaluationTree.addStepReplacementsTo(stepReplacements);

            let output = `-- formula text --\n\n${originalText}`;

            let lastStepText = originalText;

            for (let i = 0; i < stepReplacements.length; i++) {

                const replacement = stepReplacements[i];
                let startIndex = replacement.startIndex;

                for (let j = 0; j < i; j++) {

                    const prevReplacement = stepReplacements[j];

                    if (prevReplacement.startIndex < replacement.startIndex) {
                        startIndex = startIndex - prevReplacement.sourceLength + prevReplacement.replacementText.length;
                    }

                }

                output += `\n\n-- step ${i + 1} --\n\n${lastStepText.substring(0, startIndex)}${replacement.replacementText}${lastStepText.substring(startIndex + replacement.sourceLength)}`;

            }

            output += `\n\n-- result --\n\n${evaluationTree.result.text}`;

            return output;

        } else {

            return '';

        }

    }

    registerEvaluationTree(evaluationTree: FormulaEvaluationTree) {

        let index = this._evaluationTrees.entries.length;

        while (this._evaluationTrees.has(index.toString())) {
            index++;
        }

        this._evaluationTrees.set(index.toString(), evaluationTree);

        return vscode.Uri.parse(`${this.scheme}:${this._pathPrefix}${index}`);

    }

    notifyChanged(uri: vscode.Uri) {
        this._onDidChangeEmitter.fire(uri);
    }

    notifyDocumentClosed(uri: vscode.Uri) {
        let name = this._getTreeName(uri);
        this._evaluationTrees.delete(name);
    }

}
