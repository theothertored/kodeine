import { IFormulaToken, IKodeFunction } from "./base.js";
import { UnquotedValueToken } from "./kodeine-lexer/formula-tokens.js";

export class KodeParseError extends Error {
    public token: IFormulaToken;
    constructor(prefix: string, token: IFormulaToken, message: string) {
        super(`${prefix} at index ${token.getStartIndex()}: ${message}`);
    }
}

export class KodeSyntaxError extends KodeParseError {
    constructor(token: IFormulaToken, message: string) {
        super('Syntax error', token, message);
    }
}

export class KodeFunctionNotFoundError extends KodeParseError {
    constructor(token: UnquotedValueToken) {
        super('Function not found', token, `Function with name "${token.getSourceText()}" was not found.`);
    }
}

export class UnrecognizedTokenError extends KodeParseError {
    constructor(token: IFormulaToken) {
        super('Unrecognized token', token, `Token "${token.getName()}" was not recognized by the parser.`);
    }
}


export class EvaluationError extends Error {
    constructor(message) {
        super(`Evaluation error: ${message}`);
    }
}

export class NotEnoughArgumentsError extends EvaluationError {
    public readonly func: IKodeFunction;

    constructor(func: IKodeFunction, message: string) {
        super(`Not enough arguments given for ${func.getName()}(): ${message}`)
    }

}
