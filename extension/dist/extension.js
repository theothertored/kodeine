"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const parsing_context_js_1 = require("../../engine/dist.node/kodeine-parser/parsing-context.js");
const kodeine_parser_js_1 = require("../../engine/dist.node/kodeine-parser/kodeine-parser.js");
const evaluation_context_js_1 = require("../../engine/dist.node/evaluables/evaluation-context.js");
function activate(context) {
    let outChannel = vscode.window.createOutputChannel('Formula Result');
    outChannel.show(true);
    let parsingCtx = parsing_context_js_1.ParsingContextBuilder.buildDefault();
    let parser = new kodeine_parser_js_1.KodeineParser(parsingCtx);
    let evalCtx = new evaluation_context_js_1.EvaluationContext();
    let diagColl = vscode.languages.createDiagnosticCollection('Formula diagnostics');
    let evaluateToOutput = (document) => {
        // create a list of diagnostics (warnings, errors etc.)
        let diags = [];
        let formulaText = document.getText();
        try {
            let formula = parser.parse(formulaText);
            let result = formula.evaluate(evalCtx);
            let warnCount = parsingCtx.sideEffects.warnings.length + evalCtx.sideEffects.warnings.length;
            let errCount = parsingCtx.sideEffects.errors.length + evalCtx.sideEffects.errors.length;
            if (errCount > 0) {
                // merge errors in order
                let errors = '';
                let pi = 0;
                let ei = 0;
                for (let i = 0; i < errCount; i++) {
                    if (pi < parsingCtx.sideEffects.errors.length
                        && (ei >= evalCtx.sideEffects.errors.length
                            || parsingCtx.sideEffects.errors[pi].token.getStartIndex() < evalCtx.sideEffects.errors[ei].evaluable.source.getStartIndex())) {
                        errors += parsingCtx.sideEffects.errors[pi].message + '\n';
                        pi++;
                    }
                    else {
                        errors += evalCtx.sideEffects.errors[ei].message + '\n';
                        ei++;
                    }
                }
                if (result.text) {
                    outChannel.replace(`${result.text}\n\nFormula contains ${errCount} error${errCount === 1 ? '' : 's'}:\n${errors}`);
                }
                else {
                    outChannel.replace(errors);
                }
            }
            else {
                outChannel.replace(result.text);
            }
        }
        catch (err) {
            outChannel.replace('kodeine crashed: ' + err?.toString());
        }
        if (parsingCtx.sideEffects.warnings.length > 0) {
            // got some warnings, convert to diags
            parsingCtx.sideEffects.warnings.forEach(warning => {
                diags.push({
                    severity: vscode.DiagnosticSeverity.Warning,
                    range: new vscode.Range(document.positionAt(warning.tokens[0].getStartIndex()), document.positionAt(warning.tokens[warning.tokens.length - 1].getEndIndex())),
                    message: warning.message,
                    code: '',
                    source: ''
                });
            });
        }
        if (parsingCtx.sideEffects.errors.length > 0) {
            // got some errors, convert to diags
            parsingCtx.sideEffects.errors.forEach(error => {
                diags.push({
                    severity: vscode.DiagnosticSeverity.Error,
                    range: new vscode.Range(document.positionAt(error.token.getStartIndex()), document.positionAt(error.token.getEndIndex())),
                    message: error.message,
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