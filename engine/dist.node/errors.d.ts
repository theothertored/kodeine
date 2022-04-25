import { Evaluable, IFormulaToken } from "./base.js";
import { FunctionCall } from "./evaluables/function-call.js";
import { UnquotedValueToken } from "./kodeine-lexer/formula-tokens.js";
/** A base class for errors thrown by kodeine that does not extend {@link Error} - because that breaks `instanceof`. */
export declare class KodeError {
    message: string;
    constructor(message: string);
}
/** An error thrown by the parser. */
export declare class KodeParseError extends KodeError {
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
export declare class EvaluationError extends KodeError {
    /** The evaluable that threw this evaluation error. */
    evaluable: Evaluable;
    /**
     * Constructs an {@link EvaluationError} with an evaluable and a message.
     * @param evaluable The evaluable that threw the error.
     * @param message A message explaining the error.
     */
    constructor(evaluable: Evaluable, message: string);
}
/** An error thrown when a function was called with an invalid number of arguments. */
export declare class InvalidArgumentCountError extends EvaluationError {
    /**
     * Constructs a {@link InvalidArgumentCountError} with a function call with an invalid number of arguments and a message.
     * @param funcCall The function call with an invalid number of arguments.
     * @param message A message explaining the error.
     */
    constructor(funcCall: FunctionCall, message: string);
}
export declare class RegexEvaluationError extends EvaluationError {
    /**
     * Constructs a {@link InvalidArgumentCountError} with a function call with an invalid number of arguments and a message.
     * @param funcCall The function call with an invalid number of arguments.
     * @param message A message explaining the error.
     */
    constructor(evaluable: Evaluable, message: string);
}
/**
 * An error thrown internally by an implementation of a function or operator.
 * Should be caught by the parent evaluble and rethrown as an EvaluationError.
 *
 * **This is an internal error class that, ideally, should never make it outside the formula.**
 */
export declare abstract class InternalEvaluationError {
    /** The error message. */
    message: string;
    /**
     * Constructs an {@link InternalEvaluationError} with a given message.
     * @param message The message to construct the error with.
     */
    constructor(message: string);
    /** Converts this internal error to an error that can be thrown outside of the formula. */
    abstract toExternalError(evaluable: Evaluable): EvaluationError;
}
/** An internal invalid argument count error to be thrown by function implementations. */
export declare class InternalInvalidArgumentCountError extends InternalEvaluationError {
    toExternalError(evaluable: FunctionCall): InvalidArgumentCountError;
}
/** An internal regex error to be thrown by function or operator implementations. */
export declare class InternalRegexEvaluationError extends InternalEvaluationError {
    toExternalError(evaluable: Evaluable): InvalidArgumentCountError;
}
