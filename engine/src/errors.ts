import {
    Evaluable,
    FunctionCall,
    KodeValue,
    FormulaToken,
    UnquotedValueToken
} from "./kodeine.js";

/** A base class for errors thrown by kodeine that does not extend {@link Error} - because that breaks `instanceof`. */
export class KodeError {

    public message: string;

    constructor(message: string) {
        this.message = message;
    }

}

/** An error thrown by the parser. */
export class KodeParsingError extends KodeError {

    /** The token this error is related to. */
    public token: FormulaToken;

    /** Constructs a {@link KodeParsingError} with a source token and a prefixed message. */
    constructor(prefix: string, token: FormulaToken, message: string) {
        super(`${prefix} around index ${token.getStartIndex()}: ${message}`);
        this.token = token;
    }
}

/** A generic syntax error. */
export class KodeSyntaxError extends KodeParsingError {

    /** 
     * Constructs a {@link KodeSyntaxError} with a source token and a message. 
     * @param token The token the error is related to.
     * @param message A message explaning the error.
     */
    constructor(token: FormulaToken, message: string) {
        super('Syntax error', token, message);
    }

}

/** Thrown when a function call was parsed, but the function implementation was not found in the parsing environment. */
export class KodeFunctionNotFoundError extends KodeParsingError {

    /** 
     * Constructs a {@link KodeFunctionNotFoundError} with an unquoted value token representing the function name. 
     * @param token The unquoted value token representing the function name.
     */
    constructor(token: UnquotedValueToken) {
        super('Function not found', token, `Function with name "${token.getSourceText()}" was not found.`);
    }

}

export class UnquotedValueAndFunctionNameCollisionError extends KodeParsingError {

    /** 
     * Constructs a {@link UnquotedValueAndFunctionNameCollisionError} with an unquoted value token for which the collision occurred. 
     * @param token The unquoted value token that collided with a function name.
     */
    constructor(token: UnquotedValueToken) {
        super(
            'Unquoted string & function name collision', token, 
            `"${token.getSourceText()}" is a function name. Kustom will throw "err: null", even though this value is not followed by an opening parenthesis.`
        );
    }

}

/** Thrown when the lexer produced a token that the parser did not recognize. */
export class UnrecognizedTokenError extends KodeParsingError {

    /**
     * Constructs a {@link UnrecognizedTokenError} with the token that was not recognized. 
     * @param token The token that was not recognized.
     */
    constructor(token: FormulaToken) {
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
    constructor(funcCall: FunctionCall, message: string, funcDescription?: string) {
        super(funcCall, `Invalid argument count for ${funcDescription || funcCall.func.getName() + '()'}: ${message}`)
    }

}

/** An error thrown when a function was called with an invalid argument. */
export class InvalidArgumentError extends EvaluationError {

    /** 
     * Constructs a {@link InvalidArgumentError} with a function call with the invalid argument and a message. 
     * @param funcDescription A description of the function that was called with an invalid argument (ex. fl(), tc(reg) etc.).
     * @param argumentName The name of the argument.
     * @param argumentIndex The index of the argument.
     * @param argumentSource The evaluable that returned the invalid argument value.
     * @param invalidValue The value that was invalid.
     * @param message A message explaining the error.
     */
    constructor(funcDescription: string, argumentName: string, argumentIndex: number, argumentSource: Evaluable, invalidValue: string | number | KodeValue, message: string) {
        super(argumentSource, `Value ${invalidValue instanceof KodeValue ? invalidValue.toOutputString() : invalidValue} given for argument "${argumentName}" (#${argumentIndex}) for ${funcDescription} is invalid: ${message}`)
    }

}

/** An error thrown when a regex expression passed to a function or operator throws an exception. */
export class RegexEvaluationError extends EvaluationError {
    /** 
     * Constructs a {@link InvalidArgumentCountError} with a function call with an invalid number of arguments and a message. 
     * @param funcCall The function call with an invalid number of arguments.
     * @param message A message explaining the error.
     */
    constructor(evaluable: Evaluable, message: string) {
        super(evaluable, `Regex error: ${message}`)
    }
}
