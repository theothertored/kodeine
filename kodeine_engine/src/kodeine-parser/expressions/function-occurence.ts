import { IFormulaToken, IKodeFunction } from "../../base.js";

export class FunctionOccurence {

    public readonly funcNameToken: IFormulaToken;
    public readonly openingParenthesisToken: IFormulaToken;
    public readonly func: IKodeFunction;

    constructor(func: IKodeFunction, funcNameToken: IFormulaToken, openingParenthesisToken: IFormulaToken) {
        this.funcNameToken = funcNameToken;
        this.openingParenthesisToken = openingParenthesisToken;
        this.func = func;
    }

}