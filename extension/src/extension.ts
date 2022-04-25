import * as vscode from 'vscode';
import { ParsingContextBuilder } from '../../engine/dist.node/kodeine-parser/parsing-context.js';
import { KodeineParser } from '../../engine/dist.node/kodeine-parser/kodeine-parser.js';
import { EvaluationContext } from '../../engine/dist.node/evaluables/evaluation-context.js';
import { KodeParseError, EvaluationError, KodeError } from '../../engine/dist.node/errors.js';

export function activate(context: vscode.ExtensionContext) {

    let outChannel = vscode.window.createOutputChannel('Formula Result', 'kode');
    outChannel.show(true);

    let parseCtx = ParsingContextBuilder.buildDefault();
    let parser = new KodeineParser(parseCtx);
    let evalCtx = new EvaluationContext();

    let diagColl = vscode.languages.createDiagnosticCollection('Formula diagnostics');

    let evaluateToOutput = (document: vscode.TextDocument) => {

        // create a list of diagnostics (warnings, errors etc.)
        let diags: vscode.Diagnostic[] = [];

        try {

            evalCtx.clearSideEffects();

            let formulaText = document.getText();
            let formula = parser.parse(formulaText);

            let result = formula.evaluate(evalCtx);

            outChannel.replace(result.text);

        } catch (err: any) {

            if (err instanceof KodeError) {

                outChannel.replace(err.message);

                if (err instanceof KodeParseError) {

                    diags.push({
                        severity: vscode.DiagnosticSeverity.Error,
                        range: new vscode.Range(
                            document.positionAt(err.token.getStartIndex()),
                            document.positionAt(err.token.getEndIndex())
                        ),
                        message: err.message,
                        code: '',
                        source: ''
                    });

                } else if (err instanceof EvaluationError) {

                    diags.push({
                        severity: vscode.DiagnosticSeverity.Error,
                        range: new vscode.Range(
                            document.positionAt(err.evaluable.source!.getStartIndex()),
                            document.positionAt(err.evaluable.source!.getEndIndex())
                        ),
                        message: err.message,
                        code: '',
                        source: ''
                    });

                } else {

                    diags.push({
                        severity: vscode.DiagnosticSeverity.Error,
                        range: new vscode.Range(
                            document.positionAt(0),
                            document.positionAt(Number.MAX_VALUE)
                        ),
                        message: err.message,
                        code: '',
                        source: ''
                    });

                }


            } else {

                outChannel.replace('kodeine crashed: ' + err?.toString());

            }
        }

        if (evalCtx.sideEffects.warnings.length > 0) {

            evalCtx.sideEffects.warnings.forEach(warning => {

                // found some warnings
                diags.push({
                    severity: vscode.DiagnosticSeverity.Warning,
                    range: new vscode.Range(
                        document.positionAt(warning.evaluable.source!.getStartIndex()),
                        document.positionAt(warning.evaluable.source!.getEndIndex())
                    ),
                    message: warning.message,
                    code: '',
                    source: ''
                });

            });

        }
        
        // apply the created list to the problems panel
        diagColl.set(vscode.window.activeTextEditor!.document.uri, diags);

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
