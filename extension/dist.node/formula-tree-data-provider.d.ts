import * as vscode from 'vscode';
import { Formula } from '../../engine/dist.node/evaluables/formula.js';
export declare class FormulaTreeDataProvider implements vscode.TreeDataProvider<any> {
    private _formula;
    private _sourceDocument;
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<any | undefined | void>;
    getChildren(element?: any): vscode.ProviderResult<any[]>;
    getTreeItem(element: any): vscode.TreeItem | Thenable<vscode.TreeItem>;
    setFormula(formula: Formula | null): void;
}
