import { Evaluable, FormulaToken, KodeValue } from "./base.js";
import { FunctionCall } from "./evaluables/function-call.js";
import { UnquotedValueToken } from "./kodeine-lexer/formula-tokens.js";
/** A base class for errors thrown by kodeine that does not extend {@link Error} - because that breaks `instanceof`. */
export declare class KodeError {
    message: string;
    constructor(message: string);
}
/** An error thrown by the parser. */
export declare class KodeParsingError extends KodeError {
    /** The token this error is related to. */
    token: FormulaToken;
    /** Constructs a {@link KodeParsingError} with a source token and a prefixed message. */
    constructor(prefix: string, token: FormulaToken, message: string);
}
/** A generic syntax error. */
export declare class KodeSyntaxError extends KodeParsingError {
    /**
     * Constructs a {@link KodeSyntaxError} with a source token and a message.
     * @param token The token the error is related to.
     * @param message A message explaning the error.
     */
    constructor(token: FormulaToken, message: string);
}
/** Thrown when a function call was parsed, but the function implementation was not found in the parsing environment. */
export declare class KodeFunctionNotFoundError extends KodeParsingError {
    /**
     * Constructs a {@link KodeFunctionNotFoundError} with an unquoted value token representing the function name.
     * @param token The unquoted value token representing the function name.
     */
    constructor(token: UnquotedValueToken);
}
/** Thrown when the lexer produced a token that the parser did not recognize. */
export declare class UnrecognizedTokenError extends KodeParsingError {
    /**
     * Constructs a {@link UnrecognizedTokenError} with the token that was not recognized.
     * @param token The token that was not recognized.
     */
    constructor(token: FormulaToken);
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
    constructor(funcCall: FunctionCall, message: string, funcDescription?: string);
}
/** An error thrown when a function was called with an invalid argument. */
export declare class InvalidArgumentError extends EvaluationError {
    /**
     * Constructs a {@link InvalidArgumentError} with a function call with the invalid argument and a message.
     * @param funcDescription A description of the function that was called with an invalid argument (ex. fl(), tc(reg) etc.).
     * @param argumentName The name of the argument.
     * @param argumentIndex The index of the argument.
     * @param argumentSource The evaluable that returned the invalid argument value.
     * @param invalidValue The value that was invalid.
     * @param message A message explaining the error.
     */
    constructor(funcDescription: string, argumentName: string, argumentIndex: number, argumentSource: Evaluable, invalidValue: string | number | KodeValue, message: string);
}
/** An error thrown when a regex expression passed to a function or operator throws an exception. */
export declare class RegexEvaluationError extends EvaluationError {
    /**
     * Constructs a {@link InvalidArgumentCountError} with a function call with an invalid number of arguments and a message.
     * @param funcCall The function call with an invalid number of arguments.
     * @param message A message explaining the error.
     */
    constructor(evaluable: Evaluable, message: string);
}
