"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationStepsTextDocumentContentProvider = void 0;
const vscode = require("vscode");
class EvaluationStepsTextDocumentContentProvider {
    constructor() {
        this._onDidChangeEmitter = new vscode.EventEmitter();
        this.onDidChange = this._onDidChangeEmitter.event;
        this._sourceUriToEvaluationTreeMap = new Map();
    }
    _getSourceDocUriFrom(stepsUri) {
        return vscode.Uri.parse(decodeURIComponent(stepsUri.query.split('=')[1]));
    }
    provideTextDocumentContent(stepsUri, token) {
        let sourceUriString = this._getSourceDocUriFrom(stepsUri).toString();
        let evaluationTree = this._sourceUriToEvaluationTreeMap.get(sourceUriString);
        return evaluationTree?.printEvaluationSteps() ?? '';
    }
    getStepsDocumentUriFor(sourceDoc) {
        return vscode.Uri.parse(`${EvaluationStepsTextDocumentContentProvider.scheme}:${sourceDoc.fileName}.steps?for=${encodeURIComponent(sourceDoc.uri.toString())}`);
    }
    updateEvaluationTreeFor(sourceDoc, tree) {
        this._sourceUriToEvaluationTreeMap.set(sourceDoc.uri.toString(), tree);
        this._onDidChangeEmitter.fire(this.getStepsDocumentUriFor(sourceDoc));
    }
    removeEvaluationTreeFor(sourceDoc) {
        this._sourceUriToEvaluationTreeMap.delete(sourceDoc.uri.toString());
    }
    notifyDocumentClosed(sourceDoc) {
        this._sourceUriToEvaluationTreeMap.delete(sourceDoc.uri.toString());
    }
}
exports.EvaluationStepsTextDocumentContentProvider = EvaluationStepsTextDocumentContentProvider;
EvaluationStepsTextDocumentContentProvider.scheme = 'formulaevaluationsteps';
//# sourceMappingURL=evaluation-steps-text-document-content-provider.js.map