import * as vscode from 'vscode';
import {
    ParsingContext, ParsingContextBuilder,
    KodeineParser,
    EvaluationContext,
    Formula
} from '../../engine/dist.node/kodeine.js';
import { EvaluationTreeDocumentManager } from './evaluation-tree-document-manager.js';
import { GlobalDocumentManager } from './global-document-manager.js';
import { FormulaDocumentEvaluationManager } from './formula-document-evaluation-manager.js';

let outChannel: vscode.OutputChannel;
let diagColl: vscode.DiagnosticCollection;

let parsingCtx: ParsingContext;
let parser: KodeineParser;
let evalCtx: EvaluationContext;

let globalDocManager: GlobalDocumentManager;
let evalTreeDocManager: EvaluationTreeDocumentManager;

let formulaDocEvalManager: FormulaDocumentEvaluationManager;


/** Activates the extension. */
export function activate(extCtx: vscode.ExtensionContext) {

    // VSCODE API INIT

    // create an output channel for formula results
    outChannel = vscode.window.createOutputChannel('Formula Result');
    outChannel.show(true); // reveal the output channel in the UI

    // create a diagnostic collection for errors and warnings
    diagColl = vscode.languages.createDiagnosticCollection('Formula Diagnostics');

    extCtx.subscriptions.push(

        // register disposables
        outChannel,
        diagColl,

        // register commands
        vscode.commands.registerCommand('kodeine.formulaResult', command_formulaResult),

        // register event listeners
        vscode.workspace.onDidChangeConfiguration(ev => onConfigurationChanged(ev))

    );


    // KODEINE INIT

    // prepare kodeine engine
    parsingCtx = ParsingContextBuilder.buildDefault();
    parser = new KodeineParser(parsingCtx);
    evalCtx = new EvaluationContext();

    // enable evaluation tree building in the context
    evalCtx.buildEvaluationTree = true;

    // initialize a global document manager to handle globals
    globalDocManager = new GlobalDocumentManager(
        extCtx,
        parsingCtx.getOperatorSymbolsLongestFirst(),
        parsingCtx.getFunctionNames()
    );

    // initialize an evaluation tree document manager to handle evaluation trees
    evalTreeDocManager = new EvaluationTreeDocumentManager(extCtx);

    // initialize a formula document evaluation manager to handle evaluating documents and the side effects of doing so
    formulaDocEvalManager = new FormulaDocumentEvaluationManager(
        extCtx,
        outChannel, diagColl,
        globalDocManager, evalTreeDocManager,
        parsingCtx, parser, evalCtx
    );

    if (vscode.window.activeTextEditor?.document) {
        // there is an active text editor, evaluate its document
        // we know this is a kode document because the activation event requires a kode document
        formulaDocEvalManager.evaluateToOutput(vscode.window.activeTextEditor?.document);
    }

}

function onConfigurationChanged(ev: vscode.ConfigurationChangeEvent): any {

    if (ev.affectsConfiguration('kodeine')) {
        // configuration has changed, reevaluate the last evaluated document
        // and all documents with open side effects
        formulaDocEvalManager.reevaluateLastEvaluatedDocument();
        formulaDocEvalManager.reevaluateDocumentsWithOpenEvaluationSteps();
    }

}

function command_formulaResult() {
    outChannel.show(true);
}

