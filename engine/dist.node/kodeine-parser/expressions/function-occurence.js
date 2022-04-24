"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionOccurence = void 0;
/**
 * An occurence of a function call in an evaluable part of a formula.
 * Consists of the function name token ({@link funcNameToken}), opening parenthesis token ({@link openingParenthesisToken})
 * and the {@link IKodeFunction} referred to by the {@link funcNameToken}.
 */
class FunctionOccurence {
    /**
     * Constructs a function occurence from an {@link IKodeFunction}, a function name token and an opening parenthesis token.
     * @param func The {@link IKodeFunction} being referred to by the {@link funcNameToken}.
     * @param openingTokens The tokens opening this function call.
     */
    constructor(func, ...openingTokens) {
        this.openingTokens = openingTokens;
        this.func = func;
    }
}
exports.FunctionOccurence = FunctionOccurence;
//# sourceMappingURL=function-occurence.js.map