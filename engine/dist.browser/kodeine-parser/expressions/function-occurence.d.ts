import { IKodeFunction, FormulaToken } from "../../kodeine.js";
/**
 * An occurence of a function call in an evaluable part of a formula.
 * Consists of the function name token ({@link funcNameToken}), opening parenthesis token ({@link openingParenthesisToken})
 * and the {@link IKodeFunction} referred to by the {@link funcNameToken}.
 */
export declare class FunctionOccurence {
    /** The token representing the name of this function. */
    readonly openingTokens: FormulaToken[];
    /** The {@link IKodeFunction} referred to by the {@link funcNameToken}. */
    readonly func: IKodeFunction;
    /**
     * Constructs a function occurence from an {@link IKodeFunction}, a function name token and an opening parenthesis token.
     * @param func The {@link IKodeFunction} being referred to by the {@link funcNameToken}.
     * @param openingTokens The tokens opening this function call.
     */
    constructor(func: IKodeFunction, ...openingTokens: FormulaToken[]);
}
