/**
 * An occurence of a function call in an evaluable part of a formula.
 * Consists of the function name token ({@link funcNameToken}), opening parenthesis token ({@link openingParenthesisToken})
 * and the {@link IKodeFunction} referred to by the {@link funcNameToken}.
 */
export class FunctionOccurence {
    /**
     * Constructs a function occurence from an {@link IKodeFunction}, a function name token and an opening parenthesis token.
     * @param func The {@link IKodeFunction} being referred to by the {@link funcNameToken}.
     * @param funcNameToken The fucntion name token.
     * @param openingParenthesisToken The opening parenthesis token.
     */
    constructor(func, funcNameToken, openingParenthesisToken) {
        this.funcNameToken = funcNameToken;
        this.openingParenthesisToken = openingParenthesisToken;
        this.func = func;
    }
}
//# sourceMappingURL=function-occurence.js.map