"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const parsing_context_js_1 = require("../../engine/dist.node/kodeine-parser/parsing-context.js");
const kodeine_parser_js_1 = require("../../engine/dist.node/kodeine-parser/kodeine-parser.js");
const base_js_1 = require("../../engine/dist.node/base.js");
const errors_js_1 = require("../../engine/dist.node/errors.js");
function activate(context) {
    let outChannel = vscode.window.createOutputChannel('Formula Result', 'kode');
    outChannel.show(true);
    let parseCtx = parsing_context_js_1.ParsingContextBuilder.buildDefault();
    let parser = new kodeine_parser_js_1.KodeineParser(parseCtx);
    let evalCtx = new base_js_1.EvaluationContext();
    let diagColl = vscode.languages.createDiagnosticCollection('Formula diagnostics');
    let evaluateToOutput = (document) => {
        try {
            let formulaText = document.getText();
            let formula = parser.parse(formulaText);
            let result = formula.evaluate(evalCtx);
            outChannel.replace(result.text);
            // clear diagnostics
            diagColl.delete(vscode.window.activeTextEditor.document.uri);
        }
        catch (err) {
            if (err instanceof errors_js_1.KodeError) {
                outChannel.replace(err.message);
                let diags = [];
                if (err instanceof errors_js_1.KodeParseError) {
                    diags.push({
                        severity: vscode.DiagnosticSeverity.Error,
                        range: new vscode.Range(document.positionAt(err.token.getStartIndex()), document.positionAt(err.token.getEndIndex())),
                        message: err.message,
                        code: '',
                        source: ''
                    });
                }
                else if (err instanceof errors_js_1.EvaluationError) {
                    diags.push({
                        severity: vscode.DiagnosticSeverity.Error,
                        range: new vscode.Range(document.positionAt(err.evaluable.source.getStartIndex()), document.positionAt(err.evaluable.source.getEndIndex())),
                        message: err.message,
                        code: '',
                        source: ''
                    });
                }
                else {
                    diags.push({
                        severity: vscode.DiagnosticSeverity.Error,
                        range: new vscode.Range(document.positionAt(0), document.positionAt(Number.MAX_VALUE)),
                        message: err.message,
                        code: '',
                        source: ''
                    });
                }
                diagColl.set(vscode.window.activeTextEditor.document.uri, diags);
            }
            else {
                outChannel.replace('kodeine crashed: ' + err?.toString());
                // clear diagnostics
                diagColl.delete(vscode.window.activeTextEditor.document.uri);
            }
        }
    };
    if (vscode.window.activeTextEditor?.document.languageId === 'kode') {
        evaluateToOutput(vscode.window.activeTextEditor.document);
    }
    else {
        outChannel.replace('Activate a text editor with its language set to kode to see live evaluation results.');
    }
    vscode.window.onDidChangeActiveTextEditor(ev => {
        if (ev?.document?.languageId === 'kode')
            evaluateToOutput(ev.document);
    });
    vscode.workspace.onDidChangeTextDocument(ev => {
        if (ev?.document?.languageId === 'kode')
            evaluateToOutput(ev.document);
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map