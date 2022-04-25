import { Evaluable, IFormulaToken, IKodeFunction } from "./base.js";
import { FunctionCall } from "./evaluables/function-call.js";
import { UnquotedValueToken } from "./kodeine-lexer/formula-tokens.js";

/** A base class for errors thrown by kodeine that does not extend {@link Error} - because that breaks `instanceof`. */
export class KodeError {

    public message: string;

    constructor(message: string) {
        this.message = message;
    }

}

/** An error thrown by the parser. */
export class KodeParseError extends KodeError {

    /** The token this error is related to. */
    public token: IFormulaToken;

    /** Constructs a {@link KodeParseError} with a source token and a prefixed message. */
    constructor(prefix: string, token: IFormulaToken, message: string) {
        super(`${prefix} around index ${token.getStartIndex()}: ${message}`);
        this.token = token;
    }
}

/** A generic syntax error. */
export class KodeSyntaxError extends KodeParseError {

    /** 
     * Constructs a {@link KodeSyntaxError} with a source token and a message. 
     * @param token The token the error is related to.
     * @param message A message explaning the error.
     */
    constructor(token: IFormulaToken, message: string) {
        super('Syntax error', token, message);
    }

}

/** Thrown when a function call was parsed, but the function implementation was not found in the parsing environment. */
export class KodeFunctionNotFoundError extends KodeParseError {

    /** 
     * Constructs a {@link KodeFunctionNotFoundError} with an unquoted value token representing the function name. 
     * @param token The unquoted value token representing the function name.
     */
    constructor(token: UnquotedValueToken) {
        super('Function not found', token, `Function with name "${token.getSourceText()}" was not found.`);
    }

}

/** Thrown when the lexer produced a token that the parser did not recognize. */
export class UnrecognizedTokenError extends KodeParseError {

    /**
     * Constructs a {@link UnrecognizedTokenError} with the token that was not recognized. 
     * @param token The token that was not recognized.
     */
    constructor(token: IFormulaToken) {
        super('Unrecognized token', token, `Token "${token.getName()}" was not recognized by the parser.`);
    }

}


/** A generic error thrown during formula evaluation. */
export class EvaluationError extends KodeError {

    /** The evaluable that threw this evaluation error. */
    public evaluable: Evaluable;

    /**
     * Constructs an {@link EvaluationError} with an evaluable and a message.
     * @param evaluable The evaluable that threw the error.
     * @param message A message explaining the error.
     */
    constructor(evaluable: Evaluable, message: string) {
        super(`Evaluation error: ${message}`);
        this.evaluable = evaluable;
    }

}

/** An error thrown when a function was called with an invalid number of arguments. */
export class InvalidArgumentCountError extends EvaluationError {

    /** 
     * Constructs a {@link InvalidArgumentCountError} with a function call with an invalid number of arguments and a message. 
     * @param funcCall The function call with an invalid number of arguments.
     * @param message A message explaining the error.
     */
    constructor(funcCall: FunctionCall, message: string) {
        super(funcCall, `Not enough arguments given for ${funcCall.func.getName()}(): ${message}`)
    }

}


/** 
 * An error thrown internally by an implementation of a function or operator. 
 * Should be caught by the parent evaluble and rethrown as an EvaluationError.
 * 
 * **This is an internal error class that, ideally, should never make it outside the formula.**
 */
export abstract class InternalEvaluationError {

    /** The error message. */
    public message: string;

    /** 
     * Constructs an {@link InternalEvaluationError} with a given message. 
     * @param message The message to construct the error with.
     */
    constructor(message: string) {
        this.message = message;
    }

    /** Converts this internal error to an error that can be thrown outside of the formula. */
    abstract toExternalError(evaluable: Evaluable): EvaluationError;

}

/** An internal invalid argument count error to be thrown by function implementations. */
export class InternalInvalidArgumentCountError extends InternalEvaluationError {

    toExternalError(evaluable: FunctionCall): InvalidArgumentCountError {
        return new InvalidArgumentCountError(evaluable, this.message);
    }

}