"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const parsing_context_js_1 = require("../../engine/dist.node/kodeine-parser/parsing-context.js");
const kodeine_parser_js_1 = require("../../engine/dist.node/kodeine-parser/kodeine-parser.js");
const base_js_1 = require("../../engine/dist.node/base.js");
const errors_js_1 = require("../../engine/dist.node/errors.js");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('kodeine.formulaResult', openFormulaResultWindow));
}
exports.activate = activate;
function openFormulaResultWindow() {
    let outChannel = vscode.window.createOutputChannel('Formula Result', 'kode');
    outChannel.show(true);
    let parseCtx = parsing_context_js_1.ParsingContextBuilder.buildDefault();
    let parser = new kodeine_parser_js_1.KodeineParser(parseCtx);
    let evalCtx = new base_js_1.EvaluationContext();
    let evaluateToOutput = (document) => {
        try {
            let formulaText = document.getText();
            let formula = parser.parse(formulaText);
            let result = formula.evaluate(evalCtx);
            outChannel.replace(result.text);
        }
        catch (err) {
            if (err instanceof errors_js_1.KodeParseError || err instanceof errors_js_1.EvaluationError) {
                outChannel.replace(err.message);
            }
            else {
                outChannel.replace('kodeine crashed: ' + err?.toString());
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
//# sourceMappingURL=extension.js.map