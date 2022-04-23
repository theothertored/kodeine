export class KodeParseError extends Error {
    constructor(prefix, token, message) {
        super(`${prefix} at index ${token.getStartIndex()}: ${message}`);
    }
}
export class KodeSyntaxError extends KodeParseError {
    constructor(token, message) {
        super('Syntax error', token, message);
    }
}
export class KodeFunctionNotFoundError extends KodeParseError {
    constructor(token) {
        super('Function not found', token, `Function with name "${token.getSourceText()}" was not found.`);
    }
}
export class UnrecognizedTokenError extends KodeParseError {
    constructor(token) {
        super('Unrecognized token', token, `Token "${token.getName()}" was not recognized by the parser.`);
    }
}
export class EvaluationError extends Error {
    constructor(message) {
        super(`Evaluation error: ${message}`);
    }
}
export class NotEnoughArgumentsError extends EvaluationError {
    constructor(func, message) {
        super(`Not enough arguments given for ${func.getName()}(): ${message}`);
    }
}
//# sourceMappingURL=errors.js.map