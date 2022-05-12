import * as vscode from 'vscode';
import { Formula } from '../../engine/dist.node/evaluables/formula.js';
import { Evaluable, KodeValue } from '../../engine/dist.node/base.js';
import { EvaluationContext } from '../../engine/dist.node/evaluables/evaluation-context.js';
declare class EvaluationResultTreeElement {
    readonly result: KodeValue;
    constructor(result: KodeValue);
}
declare class FormulaPartsTreeElement {
    readonly parts: Evaluable[];
    constructor(parts: Evaluable[]);
}
declare class ArgumentsTreeElement {
    readonly args: Evaluable[];
    constructor(args: Evaluable[]);
}
declare type FormulaTreeElement = Evaluable | EvaluationResultTreeElement | ArgumentsTreeElement | FormulaPartsTreeElement;
export declare class FormulaTreeDataProvider implements vscode.TreeDataProvider<FormulaTreeElement> {
    private _evalCtx;
    private _formula;
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<FormulaTreeElement | undefined | void>;
    constructor(evalCtx: EvaluationContext);
    getEvalResult(element: Evaluable): EvaluationResultTreeElement;
    getChildren(element?: FormulaTreeElement): vscode.ProviderResult<FormulaTreeElement[]>;
    getTreeItem(element: FormulaTreeElement): vscode.TreeItem | Thenable<vscode.TreeItem>;
    setFormula(formula: Formula | null): void;
}
export {};
