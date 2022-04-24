/** An error thrown by the parser. */
export class KodeParseError extends Error {
    /** Constructs a {@link KodeParseError} with a source token and a prefixed message. */
    constructor(prefix, token, message) {
        super(`${prefix} around index ${token.getStartIndex()}: ${message}`);
    }
}
/** A generic syntax error. */
export class KodeSyntaxError extends KodeParseError {
    /**
     * Constructs a {@link KodeSyntaxError} with a source token and a message.
     * @param token The token the error is related to.
     * @param message A message explaning the error.
     */
    constructor(token, message) {
        super('Syntax error', token, message);
    }
}
/** Thrown when a function call was parsed, but the function implementation was not found in the parsing environment. */
export class KodeFunctionNotFoundError extends KodeParseError {
    /**
     * Constructs a {@link KodeFunctionNotFoundError} with an unquoted value token representing the function name.
     * @param token The unquoted value token representing the function name.
     */
    constructor(token) {
        super('Function not found', token, `Function with name "${token.getSourceText()}" was not found.`);
    }
}
/** Thrown when the lexer produced a token that the parser did not recognize. */
export class UnrecognizedTokenError extends KodeParseError {
    /**
     * Constructs a {@link UnrecognizedTokenError} with the token that was not recognized.
     * @param token The token that was not recognized.
     */
    constructor(token) {
        super('Unrecognized token', token, `Token "${token.getName()}" was not recognized by the parser.`);
    }
}
/** A generic error thrown during formula evaluation. */
export class EvaluationError extends Error {
    /**
     * Constructs an {@link EvaluationError} with a message.
     * @param message A message explaining the error.
     */
    constructor(message) {
        super(`Evaluation error: ${message}`);
    }
}
/** An error thrown when a function was called with an invalid number of arguments. */
export class InvalidArgumentCountError extends EvaluationError {
    /**
     * Constructs a {@link InvalidArgumentCountError} with a function call with an invalid number of arguments and a message.
     * @param func The function that was called with an invalid number of arguments.
     * @param message A message explaining the error.
     */
    constructor(func, message) {
        super(`Not enough arguments given for ${func.getName()}(): ${message}`);
        this.func = func;
    }
}
//# sourceMappingURL=errors.js.map