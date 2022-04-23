import { KodeValue } from "../base.js";
import { EvaluableSource } from "../base.js";
import { KodeFunctionNotFoundError, KodeSyntaxError, UnrecognizedTokenError } from "../errors.js";
import { Formula } from "../evaluables/formula.js";
import { ClosingParenthesisToken, CommaToken, DollarSignToken, OpeningParenthesisToken, OperatorToken, QuotedValueToken, UnclosedQuotedValueToken, UnquotedValueToken, WhitespaceToken } from "../kodeine-lexer/formula-tokens.js";
import { ExpressionBuilder } from "./expressions/expression-builder.js";
import { FunctionCallBuilder } from "./expressions/function-call-builder.js";
import { FunctionOccurence } from "./expressions/function-occurence.js";
export var KodeineParserState;
(function (KodeineParserState) {
    KodeineParserState[KodeineParserState["Default"] = 0] = "Default";
    KodeineParserState[KodeineParserState["Kode"] = 1] = "Kode";
})(KodeineParserState || (KodeineParserState = {}));
export class KodeineParser {
    constructor(lexer, env) {
        this._state = KodeineParserState.Default;
        this._lexer = lexer;
        this._env = env;
    }
    parse() {
        let evaluables = [];
        let tokenBuffer = [];
        let exprBuilderStack = [];
        function getPrevNonWhitespaceToken(backIndex = 1) {
            // start from this index
            let index = tokenBuffer.length - backIndex;
            if (index < 0) {
                // token buffer too small
                return null;
            }
            else {
                let token = tokenBuffer[index];
                while (token && token instanceof WhitespaceToken) {
                    index--;
                    token = tokenBuffer[index];
                }
                return token;
            }
        }
        ;
        function getLastExprBuilder() {
            return exprBuilderStack[exprBuilderStack.length - 1];
        }
        while (!this._lexer.EOF()) {
            // read token
            let token = this._lexer.consume(1)[0];
            let skipPushingToBuffer = false;
            if (this._state === KodeineParserState.Default) {
                // we are currently not in a formula
                if (token instanceof DollarSignToken) {
                    // this is a dollar sign token, a formula is beginning
                    this._state = KodeineParserState.Kode;
                    // add a base expression builder to the stack
                    exprBuilderStack = [new ExpressionBuilder(this._env, false, token)];
                    if (tokenBuffer.length > 0) {
                        // we read some plain text tokens before this point, add a plain text part
                        evaluables.push(new KodeValue(tokenBuffer.map(t => t.getSourceText()).join(''), new EvaluableSource(...tokenBuffer)));
                    }
                    // reset the buffer
                    tokenBuffer = [token];
                }
                else {
                    // add any other token to the buffer
                    tokenBuffer.push(token);
                }
            }
            else if (this._state === KodeineParserState.Kode) {
                // we are currently parsing a formula
                // formula tokens:
                // WhitespaceToken, OpeningParenthesisToken, ClosingParenthesisToken, CommaToken, UnclosedQuotedValueToken, QuotedValueToken, UnquotedValueToken, OperatorToken
                if (token instanceof UnquotedValueToken) {
                    // TODO: peek next non-whitespace
                    let nextToken = this._lexer.peek(1)[0];
                    if (nextToken instanceof OpeningParenthesisToken) {
                        // consume the opening parenthesis immediately
                        this._lexer.consume(1);
                        // override the default buffer behaviour
                        skipPushingToBuffer = true;
                        tokenBuffer.push(token);
                        tokenBuffer.push(nextToken);
                        // find a function by name
                        let funcName = token.getValue();
                        let func = this._env.findFunction(funcName);
                        if (func) {
                            // found a function call, start a function call builder
                            exprBuilderStack.push(new FunctionCallBuilder(this._env, new FunctionOccurence(func, token, nextToken)));
                        }
                        else {
                            // function not found, throw
                            throw new KodeFunctionNotFoundError(token);
                        }
                    }
                    else {
                        getLastExprBuilder().addValue(token);
                    }
                }
                else if (token instanceof QuotedValueToken) {
                    // pass the token to the current expression builder and let it throw exceptions if necessary
                    getLastExprBuilder().addValue(token);
                }
                else if (token instanceof OperatorToken) {
                    // pass the token to the current expression builder and let it throw exceptions if necessary
                    getLastExprBuilder().addOperator(token);
                }
                else if (token instanceof OpeningParenthesisToken) {
                    // found an opening parenthesis - it's either a subexpression or a function call
                    // TODO: kustom has some funky behaviour around parentheses:
                    // empty parentheses don't throw even when the function name is invalid
                    // asdf() -> asdf
                    // non-empty parentheses arguments throw
                    // asdf(2) -> err: null
                    // a comma not followed by a value throws
                    // asdf(2,) -> err: argument is missing
                    // binary operators inside of parentheses work and take whatever is in front of the parenthesis as the second argument
                    // regardless of which side the operator got a value on
                    // 1(/2) -> 1/2 -> 0.5
                    // 1(2/) -> 1/2 -> 0.5
                    // 1(2-) -> -1
                    // unary minus with a value gets treated the same as a value, so it throws
                    // 1(-2) -> err: null
                    // unary minus without a value works like it was in front of the value before the parenthesis:
                    // 1(-) -> -1.0
                    // this behaviour overrides operator precedence:
                    // 2 / 2 (a +) -> 22a (a got appended first despite / having a higher precedence)
                    // and it works with subexpressions on the left as well:
                    // (2 + 2)(a +) -> 4a
                    // it does not work with following expressions:
                    // (a+)1 -> err: null
                    // but if you have an unclosed operator following the parenthesis it works:
                    // (a)1/ -> 1/a
                    // when there are multiple operators with missing arguments, the one with the highest precedence gets the value from in front of the parenthesis
                    // 2(2+/2) -> 2 / 2 + 2 -> 3
                    // this is probably a bug, but because it doesn't crash or throw, we need to find a way to simulate it
                    let prevToken = getPrevNonWhitespaceToken();
                    if (prevToken === null
                        || prevToken instanceof OperatorToken
                        || prevToken instanceof OpeningParenthesisToken
                        || prevToken instanceof DollarSignToken) {
                        // if there is no previous token or this parenthesis follows an operator,
                        // the parenthesis starts a subexpression
                        exprBuilderStack.push(new ExpressionBuilder(this._env, true, token));
                    }
                    else if (prevToken instanceof UnquotedValueToken) {
                        // if the previous token is an unquoted value token, interpret this as a function call
                        throw new KodeSyntaxError(token, `Unquoted value followed by an opening parenthesis wasn't picked up as a function call.`);
                    }
                    else {
                        throw new KodeSyntaxError(token, `An opening parenthesis cannot follow a(n) ${prevToken.getName()}.`);
                    }
                }
                else if (token instanceof CommaToken) {
                    let lastExprBuilder = getLastExprBuilder();
                    if (lastExprBuilder instanceof FunctionCallBuilder) {
                        lastExprBuilder.nextArgument(token);
                    }
                    else {
                        throw new KodeSyntaxError(token, `A comma cannot appear outside of function calls.`);
                    }
                }
                else if (token instanceof ClosingParenthesisToken) {
                    if (exprBuilderStack.length <= 1) {
                        throw new KodeSyntaxError(token, `Too many closing parentheses.`);
                    }
                    else {
                        let evaluable = exprBuilderStack.pop().build(token);
                        getLastExprBuilder().addEvaluable(evaluable);
                    }
                }
                else if (token instanceof DollarSignToken) {
                    // a dollar sign token ends the current evaluable part
                    skipPushingToBuffer = true;
                    tokenBuffer.push(token);
                    if (exprBuilderStack.length > 1) {
                        throw new KodeSyntaxError(tokenBuffer[tokenBuffer.length], `Unclosed parentheses (${exprBuilderStack.length - 1}).`);
                    }
                    evaluables.push(exprBuilderStack.pop().build(token));
                    this._state = KodeineParserState.Default;
                    tokenBuffer = [];
                }
                else if (token instanceof UnclosedQuotedValueToken) {
                    // an unclosed quoted value token causes the entire formula to be treated like plain text,
                    // except the leading $ gets removed from the output.
                    this._state = KodeineParserState.Default;
                    if (tokenBuffer.length > 0) {
                        // we read some plain text tokens before this point, add a plain text part
                        evaluables.push(new KodeValue(tokenBuffer.map(t => t.getSourceText()).join(''), new EvaluableSource(...tokenBuffer)));
                    }
                    tokenBuffer = [];
                    // there should be no more tokens after an unclosed quoted value token
                }
                else if (token instanceof WhitespaceToken) {
                    // do nothing with whitespace, but don't throw UnrecognizedTokenError
                }
                else {
                    throw new UnrecognizedTokenError(token);
                }
                if (!skipPushingToBuffer) {
                    tokenBuffer.push(token);
                }
            }
            else {
                throw new Error('Invalid parser state.');
            }
        }
        if (tokenBuffer.length > 0) {
            if (tokenBuffer.length > 0) {
                // we read some plain text tokens before this point, add a plain text part
                evaluables.push(new KodeValue(tokenBuffer.map(t => t.getSourceText()).join(''), new EvaluableSource(...tokenBuffer)));
            }
            tokenBuffer = [];
        }
        let formula = new Formula(evaluables);
        return formula;
    }
}
//# sourceMappingURL=kodeine-parser.js.map