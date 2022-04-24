import { IFormulaToken, IKodeFunction } from "./base.js";
import { UnquotedValueToken } from "./kodeine-lexer/formula-tokens.js";
export declare class CustomError {
    message: string;
    constructor(message: string);
}
/** An error thrown by the parser. */
export declare class KodeParseError extends CustomError {
    /** The token this error is related to. */
    token: IFormulaToken;
    /** Constructs a {@link KodeParseError} with a source token and a prefixed message. */
    constructor(prefix: string, token: IFormulaToken, message: string);
}
/** A generic syntax error. */
export declare class KodeSyntaxError extends KodeParseError {
    /**
     * Constructs a {@link KodeSyntaxError} with a source token and a message.
     * @param token The token the error is related to.
     * @param message A message explaning the error.
     */
    constructor(token: IFormulaToken, message: string);
}
/** Thrown when a function call was parsed, but the function implementation was not found in the parsing environment. */
export declare class KodeFunctionNotFoundError extends KodeParseError {
    /**
     * Constructs a {@link KodeFunctionNotFoundError} with an unquoted value token representing the function name.
     * @param token The unquoted value token representing the function name.
     */
    constructor(token: UnquotedValueToken);
}
/** Thrown when the lexer produced a token that the parser did not recognize. */
export declare class UnrecognizedTokenError extends KodeParseError {
    /**
     * Constructs a {@link UnrecognizedTokenError} with the token that was not recognized.
     * @param token The token that was not recognized.
     */
    constructor(token: IFormulaToken);
}
/** A generic error thrown during formula evaluation. */
export declare class EvaluationError extends CustomError {
    /**
     * Constructs an {@link EvaluationError} with a message.
     * @param message A message explaining the error.
     */
    constructor(message: string);
}
/** An error thrown when a function was called with an invalid number of arguments. */
export declare class InvalidArgumentCountError extends EvaluationError {
    /**
     * The function that was called with an invalid number of arguments.
     * @todo Make this hold a specific {@link FunctionCall} instead of just the function implementation.
    */
    readonly func: IKodeFunction;
    /**
     * Constructs a {@link InvalidArgumentCountError} with a function call with an invalid number of arguments and a message.
     * @param func The function that was called with an invalid number of arguments.
     * @param message A message explaining the error.
     */
    constructor(func: IKodeFunction, message: string);
}
