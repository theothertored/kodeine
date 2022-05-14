"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationStepsTextDocumentContentProvider = void 0;
const vscode = require("vscode");
class EvaluationStepsTextDocumentContentProvider {
    constructor() {
        this._path = 'evaluation steps ';
        this._onDidChangeEmitter = new vscode.EventEmitter();
        this.onDidChange = this._onDidChangeEmitter.event;
        this._sourceUriToEvaluationTreeMap = new Map();
    }
    provideTextDocumentContent(uri, token) {
        let sourceUriString = vscode.Uri.parse(decodeURIComponent(uri.query.split('=')[1])).toString();
        let evaluationTree = this._sourceUriToEvaluationTreeMap.get(sourceUriString);
        return evaluationTree?.printEvaluationSteps() ?? '';
    }
    _getStepsDocumentUri(sourceUri) {
        return vscode.Uri.parse(`${EvaluationStepsTextDocumentContentProvider.scheme}:${this._path}?for=${encodeURIComponent(sourceUri.toString())}`);
    }
    registerSource(sourceUri, evaluationTree) {
        if (this.isSourceRegistered(sourceUri)) {
            this.notifyDocumentChanged(sourceUri, evaluationTree);
        }
        else {
            this._sourceUriToEvaluationTreeMap.set(sourceUri.toString(), evaluationTree);
            this._onDidChangeEmitter.fire(this._getStepsDocumentUri(sourceUri));
        }
        return this._getStepsDocumentUri(sourceUri);
    }
    isSourceRegistered(sourceUri) {
        return this._sourceUriToEvaluationTreeMap.has(sourceUri.toString());
    }
    notifyDocumentChanged(sourceUri, evaluationTree) {
        if (this.isSourceRegistered(sourceUri)) {
            this._sourceUriToEvaluationTreeMap.set(sourceUri.toString(), evaluationTree);
            this._onDidChangeEmitter.fire(this._getStepsDocumentUri(sourceUri));
        }
    }
    notifyDocumentClosed(sourceUri) {
        this._sourceUriToEvaluationTreeMap.delete(sourceUri.toString());
    }
}
exports.EvaluationStepsTextDocumentContentProvider = EvaluationStepsTextDocumentContentProvider;
EvaluationStepsTextDocumentContentProvider.scheme = 'formulaevaluationsteps';
//# sourceMappingURL=evaluation-steps-text-document-content-provider.js.map