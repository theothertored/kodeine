import * as vscode from 'vscode';
import { ParsingContext, ParsingContextBuilder, ParsingWarning } from '../../engine/dist.node/kodeine-parser/parsing-context.js';
import { KodeineParser } from '../../engine/dist.node/kodeine-parser/kodeine-parser.js';
import { EvaluationContext } from '../../engine/dist.node/evaluables/evaluation-context.js';
import { KodeParsingError } from 'engine/src/errors.js';

let outChannel: vscode.OutputChannel;
let diagColl: vscode.DiagnosticCollection;

let parsingCtx: ParsingContext;
let parser: KodeineParser;
let evalCtx: EvaluationContext;

export function activate(extCtx: vscode.ExtensionContext) {

    // create an output channel for formula results
    outChannel = vscode.window.createOutputChannel('Formula Result');
    extCtx.subscriptions.push(outChannel); // register it as disposable

    // reveal the output channel in the UI
    outChannel.show(true);


    // create a diagnostic collection for errors and warnings
    diagColl = vscode.languages.createDiagnosticCollection('Formula diagnostics');
    extCtx.subscriptions.push(diagColl); // register it as disposable


    // prepare kodeine engine
    parsingCtx = ParsingContextBuilder.buildDefault();
    parser = new KodeineParser(parsingCtx);
    evalCtx = new EvaluationContext();


    // check the language of the currently opened editor
    if (vscode.window.activeTextEditor?.document.languageId === 'kode') {

        // the user is currently editing kode, evaluate the current content of the document
        evaluateToOutput(vscode.window.activeTextEditor.document);

    } else {

        // the user is not editing kode, inform (this should not happen, since the activation event is onLanguage:kode)
        outChannel.replace('Activate a text editor with its language set to kode to see live evaluation results.');

    }


    // listen to active editor changes
    extCtx.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(ev => {

        if (ev?.document?.languageId === 'kode')
            evaluateToOutput(ev.document);

    }));

    // listen to text document changes
    extCtx.subscriptions.push(vscode.workspace.onDidChangeTextDocument(ev => {

        if (ev?.document?.languageId === 'kode')
            evaluateToOutput(ev.document);

    }));

    // listen to the command for opening the formula result window
    extCtx.subscriptions.push(vscode.commands.registerCommand('kodeine.formulaResult', () => {

        outChannel.show(true);

    }));

}

function evaluateToOutput(document: vscode.TextDocument) {

    // create a list of diagnostics (warnings, errors etc.) that will replace the current list for the evaluated document
    let diags: vscode.Diagnostic[] = [];

    // get formula text from the document
    let formulaText = document.getText();

    try {

        // parse the formula text into an evaluable formula
        let formula = parser.parse(formulaText);

        // evaluate the parsed formula
        let result = formula.evaluate(evalCtx);

        // count how many parsing and evaluation errors popped up
        let errCount = parsingCtx.sideEffects.errors.length + evalCtx.sideEffects.errors.length;

        if (errCount > 0) {

            // at least one error encountered, merge them in order of appearance, one per line, and show in output
            let errorMessages = [];

            // parsing error index, evaluation error index
            let pi = 0; let ei = 0;

            for (let i = 0; i < errCount; i++) {

                if (
                    pi < parsingCtx.sideEffects.errors.length
                    && (
                        ei >= evalCtx.sideEffects.errors.length
                        || parsingCtx.sideEffects.errors[pi].token.getStartIndex() < evalCtx.sideEffects.errors[ei].evaluable.source!.getStartIndex()
                    )
                ) {

                    // parsing index is in range of parsing error list and current parsing error starts earlier than current eval error
                    errorMessages.push(parsingCtx.sideEffects.errors[pi].message);
                    pi++

                } else {

                    // parsing index out of range of parsing error list or current eval error starts earlier than current parsing error
                    errorMessages.push(evalCtx.sideEffects.errors[ei].message);
                    ei++

                }

            }

            if (result.text) {

                // there is a result besides the error messages
                outChannel.replace(`${result.text}\n\nFormula contains ${errCount} error${errCount === 1 ? '' : 's'}:\n${errorMessages.join('\n')}`);

            } else {

                // no result, just error messages
                outChannel.replace(errorMessages.join('\n'));

            }

        } else {

            // no errors encountered, simply output the result
            outChannel.replace(result.text);

        }

    } catch (err: any) {

        // unexpected error, print to output
        outChannel.replace('kodeine crashed: ' + err?.toString());

    }

    if (parsingCtx.sideEffects.warnings.length > 0) {

        // got some warnings, convert to diags
        parsingCtx.sideEffects.warnings.forEach(warning => {

            diags.push({
                severity: vscode.DiagnosticSeverity.Warning,
                range: new vscode.Range(
                    document.positionAt(warning.tokens[0].getStartIndex()),
                    document.positionAt(warning.tokens[warning.tokens.length - 1].getEndIndex())
                ),
                message: warning.message,
                code: '', source: ''
            });

        });

    }

    if (parsingCtx.sideEffects.errors.length > 0) {

        // got some errors, convert to diags
        parsingCtx.sideEffects.errors.forEach(error => {

            diags.push({
                severity: vscode.DiagnosticSeverity.Error,
                range: new vscode.Range(
                    document.positionAt(error.token.getStartIndex()),
                    document.positionAt(error.token.getEndIndex())
                ),
                message: error.message,
                code: '', source: ''
            });

        });

    }

    if (evalCtx.sideEffects.warnings.length > 0) {

        // got some warnings, convert to diags
        evalCtx.sideEffects.warnings.forEach(warning => {

            diags.push({
                severity: vscode.DiagnosticSeverity.Warning,
                range: new vscode.Range(
                    document.positionAt(warning.evaluable.source!.getStartIndex()),
                    document.positionAt(warning.evaluable.source!.getEndIndex())
                ),
                message: warning.message,
                code: '', source: ''
            });

        });

    }

    if (evalCtx.sideEffects.errors.length > 0) {

        // got some errors, convert to diags
        evalCtx.sideEffects.errors.forEach(error => {

            diags.push({
                severity: vscode.DiagnosticSeverity.Error,
                range: new vscode.Range(
                    document.positionAt(error.evaluable.source!.getStartIndex()),
                    document.positionAt(error.evaluable.source!.getEndIndex())
                ),
                message: error.message,
                code: '', source: ''
            });

        });

    }

    // apply the created list to the problems panel
    diagColl.set(vscode.window.activeTextEditor!.document.uri, diags);

}
