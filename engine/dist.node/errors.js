"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidArgumentCountError = exports.EvaluationError = exports.UnrecognizedTokenError = exports.KodeFunctionNotFoundError = exports.KodeSyntaxError = exports.KodeParseError = exports.CustomError = void 0;
class CustomError {
    constructor(message) {
        this.message = message;
    }
}
exports.CustomError = CustomError;
/** An error thrown by the parser. */
class KodeParseError extends CustomError {
    /** Constructs a {@link KodeParseError} with a source token and a prefixed message. */
    constructor(prefix, token, message) {
        super(`${prefix} around index ${token.getStartIndex()}: ${message}`);
        this.token = token;
    }
}
exports.KodeParseError = KodeParseError;
/** A generic syntax error. */
class KodeSyntaxError extends KodeParseError {
    /**
     * Constructs a {@link KodeSyntaxError} with a source token and a message.
     * @param token The token the error is related to.
     * @param message A message explaning the error.
     */
    constructor(token, message) {
        super('Syntax error', token, message);
    }
}
exports.KodeSyntaxError = KodeSyntaxError;
/** Thrown when a function call was parsed, but the function implementation was not found in the parsing environment. */
class KodeFunctionNotFoundError extends KodeParseError {
    /**
     * Constructs a {@link KodeFunctionNotFoundError} with an unquoted value token representing the function name.
     * @param token The unquoted value token representing the function name.
     */
    constructor(token) {
        super('Function not found', token, `Function with name "${token.getSourceText()}" was not found.`);
    }
}
exports.KodeFunctionNotFoundError = KodeFunctionNotFoundError;
/** Thrown when the lexer produced a token that the parser did not recognize. */
class UnrecognizedTokenError extends KodeParseError {
    /**
     * Constructs a {@link UnrecognizedTokenError} with the token that was not recognized.
     * @param token The token that was not recognized.
     */
    constructor(token) {
        super('Unrecognized token', token, `Token "${token.getName()}" was not recognized by the parser.`);
    }
}
exports.UnrecognizedTokenError = UnrecognizedTokenError;
/** A generic error thrown during formula evaluation. */
class EvaluationError extends CustomError {
    /**
     * Constructs an {@link EvaluationError} with a message.
     * @param message A message explaining the error.
     */
    constructor(message) {
        super(`Evaluation error: ${message}`);
    }
}
exports.EvaluationError = EvaluationError;
/** An error thrown when a function was called with an invalid number of arguments. */
class InvalidArgumentCountError extends EvaluationError {
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
exports.InvalidArgumentCountError = InvalidArgumentCountError;
//# sourceMappingURL=errors.js.map