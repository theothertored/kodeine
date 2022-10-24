import * as vscode from 'vscode';
import { ParsingContext, KodeineParser, EvaluationContext } from '../../engine/dist.node/kodeine.js';
import { EvaluationTreeDocumentManager } from './evaluation-tree-document-manager.js';
import { GlobalDocumentManager } from './global-document-manager.js';
/** Handles evaluating formula documents and the side effects of doing so. */
export declare class FormulaDocumentEvaluationManager {
    private readonly _outChannel;
    private readonly _diagColl;
    private readonly _globalDocManager;
    private readonly _evalTreeDocManager;
    private readonly _parsingCtx;
    private readonly _parser;
    private readonly _evalCtx;
    private readonly _documentFormulaMap;
    private _lastEvaluatedDoc;
    constructor(extCtx: vscode.ExtensionContext, outChannel: vscode.OutputChannel, diagColl: vscode.DiagnosticCollection, globalDocManager: GlobalDocumentManager, evalTreeDocManager: EvaluationTreeDocumentManager, parsingCtx: ParsingContext, parser: KodeineParser, evalCtx: EvaluationContext);
    private _initEvents;
    /** Should be called when a text document changes, is opened, is activated etc. */
    private _reactToDocumentChange;
    /**
     * Evaluates a given kode document to the formula result output channel.
     * Also handles updating the evaluation tree, evaluation steps and dependent formulas.
     */
    evaluateToOutput(document: vscode.TextDocument, forceReparse?: boolean): void;
    /** Reevaluates the most recently evaluated document, if exists. */
    reevaluateLastEvaluatedDocument(): void;
    /**
     * Internal implementation for evaluating a document.
     * @param forceReparse Set to true to reparse the formula, even if cached.
     * @param silentMode Set to true to disable printing to output and updating dependent formulas.
     */
    private _evaluate;
    /**
     * Reevaluates all documents that have evaluation steps open.
     * Should be called when something in the environment changes and the evaluation result could be affected (ex. globals).
     */
    reevaluateDocumentsWithOpenEvaluationSteps(): void;
}
