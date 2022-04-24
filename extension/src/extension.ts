import * as vscode from 'vscode';
import { ParsingContextBuilder } from '../../engine/dist.node/kodeine-parser/parsing-context.js';
import { KodeineParser } from '../../engine/dist.node/kodeine-parser/kodeine-parser.js';
import { EvaluationContext } from '../../engine/dist.node/base.js';
import { KodeParseError, EvaluationError } from '../../engine/dist.node/errors.js';

export function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(vscode.commands.registerCommand(
        'kodeine.formulaResult',
        openFormulaResultWindow
    ));

}

function openFormulaResultWindow() {

    let outChannel = vscode.window.createOutputChannel('Formula Result', 'kode');
    outChannel.show(true);
    
    let parseCtx = ParsingContextBuilder.buildDefault();
    let parser = new KodeineParser(parseCtx);
    let evalCtx = new EvaluationContext();
    
    let evaluateToOutput = (document: vscode.TextDocument) => {
        
        try {
            
            let formulaText = document.getText();
            let formula = parser.parse(formulaText);
            let result = formula.evaluate(evalCtx);
            
            outChannel.replace(result.text);

        } catch (err: any) {
            
            if (err instanceof KodeParseError || err instanceof EvaluationError) {
                outChannel.replace(err.message);
            } else {
                outChannel.replace('kodeine crashed: ' + err?.toString());
            }
        }
        
    }
    
    if(vscode.window.activeTextEditor?.document.languageId === 'kode') {
        evaluateToOutput(vscode.window.activeTextEditor.document);
    } else {
        outChannel.replace('Activate a text editor with its language set to kode to see live evaluation results.');
    }

    vscode.window.onDidChangeActiveTextEditor(ev => {
        if (ev?.document?.languageId === 'kode')
            evaluateToOutput(ev.document)
    });

    vscode.workspace.onDidChangeTextDocument(ev => {
        if (ev?.document?.languageId === 'kode')
            evaluateToOutput(ev.document)
    });
}