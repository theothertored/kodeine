"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const parsing_context_js_1 = require("../../engine/dist.node/kodeine-parser/parsing-context.js");
const kodeine_parser_js_1 = require("../../engine/dist.node/kodeine-parser/kodeine-parser.js");
const evaluation_context_js_1 = require("../../engine/dist.node/evaluables/evaluation-context.js");
const errors_js_1 = require("../../engine/dist.node/errors.js");
function activate(context) {
    let outChannel = vscode.window.createOutputChannel('Formula Result');
    outChannel.show(true);
    let parseCtx = parsing_context_js_1.ParsingContextBuilder.buildDefault();
    let parser = new kodeine_parser_js_1.KodeineParser(parseCtx);
    let evalCtx = new evaluation_context_js_1.EvaluationContext();
    let diagColl = vscode.languages.createDiagnosticCollection('Formula diagnostics');
    let evaluateToOutput = (document) => {
        // create a list of diagnostics (warnings, errors etc.)
        let diags = [];
        let formulaText = document.getText();
        try {
            let formula = parser.parse(formulaText);
            let result = formula.evaluate(evalCtx);
            let warnCount = parseCtx.sideEffects.warnings.length + evalCtx.sideEffects.warnings.length;
            let errCount = evalCtx.sideEffects.errors.length;
            if (warnCount + errCount > 0) {
                if (result.text) {
                    outChannel.replace(`${result.text}\n\n${evalCtx.sideEffects.errors.map(e => e.message).join('\n')}`);
                }
                else {
                    outChannel.replace(evalCtx.sideEffects.errors.map(e => e.message).join('\n'));
                }
            }
            else {
                outChannel.replace(result.text);
            }
        }
        catch (err) {
            if (err instanceof errors_js_1.KodeParsingError) {
                diags.push({
                    severity: vscode.DiagnosticSeverity.Error,
                    range: new vscode.Range(document.positionAt(err.token.getStartIndex()), document.positionAt(err.token.getEndIndex())),
                    message: err.message,
                    code: '',
                    source: ''
                });
                outChannel.replace(err.message);
            }
            else {
                outChannel.replace('kodeine crashed: ' + err?.toString());
            }
        }
        if (parseCtx.sideEffects.warnings.length > 0) {
            // got some warnings, convert to diags
            parseCtx.sideEffects.warnings.forEach(warning => {
                diags.push({
                    severity: vscode.DiagnosticSeverity.Warning,
                    range: new vscode.Range(document.positionAt(warning.tokens[0].getStartIndex()), document.positionAt(warning.tokens[warning.tokens.length - 1].getEndIndex())),
                    message: warning.message,
                    code: '',
                    source: ''
                });
            });
        }
        if (evalCtx.sideEffects.warnings.length > 0) {
            // got some warnings, convert to diags
            evalCtx.sideEffects.warnings.forEach(warning => {
                diags.push({
                    severity: vscode.DiagnosticSeverity.Warning,
                    range: new vscode.Range(document.positionAt(warning.evaluable.source.getStartIndex()), document.positionAt(warning.evaluable.source.getEndIndex())),
                    message: warning.message,
                    code: '',
                    source: ''
                });
            });
        }
        if (evalCtx.sideEffects.errors.length > 0) {
            // got some errors, convert to diags
            evalCtx.sideEffects.errors.forEach(error => {
                diags.push({
                    severity: vscode.DiagnosticSeverity.Error,
                    range: new vscode.Range(document.positionAt(error.evaluable.source.getStartIndex()), document.positionAt(error.evaluable.source.getEndIndex())),
                    message: error.message,
                    code: '',
                    source: ''
                });
            });
        }
        // apply the created list to the problems panel
        diagColl.set(vscode.window.activeTextEditor.document.uri, diags);
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