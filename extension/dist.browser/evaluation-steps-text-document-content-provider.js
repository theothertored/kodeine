"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationStepsTextDocumentContentProvider = void 0;
const vscode = require("vscode");
class EvaluationStepsTextDocumentContentProvider {
    constructor() {
        this.scheme = 'formulaevaluationsteps';
        this._pathPrefix = 'evaluation steps ';
        this._onDidChangeEmitter = new vscode.EventEmitter();
        this.onDidChange = this._onDidChangeEmitter.event;
        this._evaluationTrees = new Map();
    }
    _getTreeName(uri) {
        return uri.path.replace(this._pathPrefix, '');
    }
    provideTextDocumentContent(uri, token) {
        let name = this._getTreeName(uri);
        let evaluationTree = this._evaluationTrees.get(name);
        if (evaluationTree) {
            let originalText = evaluationTree.formula.getSourceText();
            // get source text replacements for evaluation steps
            let stepReplacements = [];
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
        }
        else {
            return '';
        }
    }
    registerEvaluationTree(evaluationTree) {
        let index = this._evaluationTrees.entries.length;
        while (this._evaluationTrees.has(index.toString())) {
            index++;
        }
        this._evaluationTrees.set(index.toString(), evaluationTree);
        return vscode.Uri.parse(`${this.scheme}:${this._pathPrefix}${index}`);
    }
    notifyChanged(uri) {
        this._onDidChangeEmitter.fire(uri);
    }
    notifyDocumentClosed(uri) {
        let name = this._getTreeName(uri);
        this._evaluationTrees.delete(name);
    }
}
exports.EvaluationStepsTextDocumentContentProvider = EvaluationStepsTextDocumentContentProvider;
//# sourceMappingURL=evaluation-steps-text-document-content-provider.js.map