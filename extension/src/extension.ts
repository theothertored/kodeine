import * as vscode from 'vscode';
import { ParsingContextBuilder } from '../../engine/dist.node/kodeine-parser/parsing-context.js';
import { KodeineParser } from '../../engine/dist.node/kodeine-parser/kodeine-parser.js';
import { EvaluationContext } from '../../engine/dist.node/base.js';
import { KodeParseError, EvaluationError } from '../../engine/dist.node/errors.js';

export function activate(context: vscode.ExtensionContext) {

    let outChannel = vscode.window.createOutputChannel('Formula Result', 'kode');
    outChannel.show(true);

    let parseCtx = ParsingContextBuilder.buildDefault();
    let parser = new KodeineParser(parseCtx);
    let evalCtx = new EvaluationContext();

    let diagColl = vscode.languages.createDiagnosticCollection('Formula diagnostics');

    let evaluateToOutput = (document: vscode.TextDocument) => {

        // clear diagnostics
        diagColl.delete(vscode.window.activeTextEditor!.document.uri);

        try {

            let formulaText = document.getText();
            let formula = parser.parse(formulaText);
            let result = formula.evaluate(evalCtx);

            outChannel.replace(result.text);

        } catch (err: any) {

            if (err instanceof KodeParseError || err instanceof EvaluationError) {

                outChannel.replace(err.message);

                let diags: vscode.Diagnostic[] = [];

                if (err instanceof KodeParseError) {

                    diags.push({
                        severity: vscode.DiagnosticSeverity.Error,
                        range: new vscode.Range(
                            document.positionAt(err.token.getStartIndex()),
                            document.positionAt(err.token.getEndIndex())
                        ),
                        message: err.message,
                        source: 'err'
                    })

                } else {

                    diags.push({
                        severity: vscode.DiagnosticSeverity.Error,
                        range: new vscode.Range(
                            document.positionAt(0), 
                            document.positionAt(Number.MAX_VALUE)
                        ),
                        message: err.message,
                        source: 'err'
                    })

                }

                diagColl.set(vscode.window.activeTextEditor!.document.uri, diags)

            } else {
                outChannel.replace('kodeine crashed: ' + err?.toString());
            }
        }

    }

    if (vscode.window.activeTextEditor?.document.languageId === 'kode') {
        evaluateToOutput(vscode.window.activeTextEditor.document);
    } else {
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
