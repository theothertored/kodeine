"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KodeineParser = exports.KodeineParserState = void 0;
const kodeine_js_1 = require("../kodeine.js");
/**
 * Values representing the current state of the parser.
 * - {@link Default}: Not in an evaluable part of the formula
 * - {@link Kode}: In an evaluable part of the formula
*/
var KodeineParserState;
(function (KodeineParserState) {
    KodeineParserState[KodeineParserState["Default"] = 0] = "Default";
    KodeineParserState[KodeineParserState["Kode"] = 1] = "Kode";
})(KodeineParserState = exports.KodeineParserState || (exports.KodeineParserState = {}));
/**
 * The default kodeine parser. Uses a {@link StringCharReader} and {@link KodeineLexer}
 * to read a formula text and produce an evaluable {@link Formula} object.
 * The parser is also responsible for throwing {@link KodeSyntaxError}s when something is wrong with the formula.
 * @example
 * //Basic usage:
 * let parser = new KodeineParser(ParsingContextBuilder.buildDefault());
 * let formula = parser.parse('$2 + 2$');
 * let evalCtx = new EvaluationContext();
 * let formulaResult = formula.evaluate(evalCtx); // evaluate to a KodeValue
 * console.log(formulaResult.text);
 */
class KodeineParser {
    /** Constructs a {@link KodeineParser} with a parsing context.*/
    constructor(parsingCtx) {
        this._parsingCtx = parsingCtx;
    }
    parse(source) {
        if (typeof source === 'string') {
            let charReader = new kodeine_js_1.StringCharReader(source);
            let lexer = new kodeine_js_1.KodeineLexer(charReader, this._parsingCtx.getOperatorSymbolsLongestFirst());
            return this._parseCore(lexer);
        }
        else if (source instanceof kodeine_js_1.ICharReader) {
            let lexer = new kodeine_js_1.KodeineLexer(source, this._parsingCtx.getOperatorSymbolsLongestFirst());
            return this._parseCore(lexer);
        }
        else if (source instanceof kodeine_js_1.IFormulaTokenLexer) {
            return this._parseCore(source);
        }
        else {
            throw new Error('Cannot parse the given source.');
        }
    }
    /** The actual parser implementation - takes an {@link ILexer}, produces a {@link Formula}. */
    _parseCore(lexer) {
        this._parsingCtx.clearSideEffects();
        /** The current state of the parser. */
        let state = KodeineParserState.Default;
        /**
         * A formula contains a list of evaluables that are concatenated together after evaluation.
         * This variable is used to constrcut that list as the formula is being parsed.
         */
        let formulaEvaluables = [];
        /** Holds all tokens that were read since the start of the current plain text or evaluable part. */
        let tokenBuffer = [];
        /**
         * - An expression builder is created and pushed to the stack when an evaluable part begins.
         * - Each subexpression or function call pushes a builder to this stack.
         * - New expression tokens are added to the last builder in the stack.
         * - A closing parenthesis causes the last builder to be popped of the stack, built and added to the new last builder as an evaluable.
         */
        let exprBuilderStack = [];
        /** Returns the first non-whitespace token from the end of the buffer. */
        function getPrevNonWhitespaceToken() {
            if (tokenBuffer.length === 0) {
                // token buffer is empty
                return null;
            }
            else {
                // start from the last index of the buffer
                let index = tokenBuffer.length - 1;
                let token = tokenBuffer[index];
                // go backwards until there are no more tokens or a non whitespace token is encountered
                while (token && token instanceof kodeine_js_1.WhitespaceToken) {
                    index--;
                    token = tokenBuffer[index];
                }
                // return the token that was found or null if every token in the buffer is a whitespace token
                return token ?? null;
            }
        }
        ;
        /** Gets the last expression builder from the stack without popping it. */
        function peekLastExprBuilder() {
            return exprBuilderStack[exprBuilderStack.length - 1];
        }
        // read until there are no more tokens
        while (!lexer.EOF()) {
            // consume one token
            let token = lexer.consume(1)[0];
            /** If set to true, this iteration the default mechanism of pushing all tokens to buffer will be skipped. */
            let skipPushingToBuffer = false;
            if (state === KodeineParserState.Default) {
                // we are currently in a plain text part
                if (token instanceof kodeine_js_1.DollarSignToken) {
                    // this is a dollar sign token, a formula is beginning
                    state = KodeineParserState.Kode;
                    // add a base expression builder to the stack
                    exprBuilderStack = [new kodeine_js_1.ExpressionBuilder(this._parsingCtx, true, token)];
                    // check the token buffer
                    if (tokenBuffer.length > 0) {
                        // we read some plain text tokens before this point, add them to formula evaluables
                        formulaEvaluables.push(new kodeine_js_1.KodeValue(tokenBuffer.map(t => t.getPlainTextOutput()).join(''), new kodeine_js_1.EvaluableSource(...tokenBuffer)));
                    }
                    // start a new buffer with the dollar sign token already in
                    tokenBuffer = [token];
                }
                else {
                    // any other token goes straight into the buffer
                    tokenBuffer.push(token);
                }
            }
            else if (state === KodeineParserState.Kode) {
                try {
                    // we are currently in an evaluable part
                    // expected tokens:
                    // WhitespaceToken, 
                    // QuotedValueToken, UnquotedValueToken, OperatorToken,
                    // OpeningParenthesisToken, ClosingParenthesisToken, CommaToken, 
                    // DollarSignToken, UnclosedQuotedValueToken
                    if (token instanceof kodeine_js_1.UnquotedValueToken) {
                        // an unquoted value token could be a normal unquoted value, or the start of a function call
                        // we need to see the following tokens to know
                        let offset = 0;
                        let nextToken = lexer.peek(1, offset++)[0];
                        if (nextToken instanceof kodeine_js_1.WhitespaceToken) {
                            // the next token being a whitespace token doesn't give us anything useful
                            while (nextToken && nextToken instanceof kodeine_js_1.WhitespaceToken) {
                                nextToken = lexer.peek(1, offset++)[0];
                            }
                            // after the loop above there are no more tokens or we have a non-whitespace token in nextToken
                        }
                        if (nextToken instanceof kodeine_js_1.OpeningParenthesisToken) {
                            // the next non-whitespace token is an opening parenthesis token, this is the start of a function call
                            // override the default buffer pushing behaviour
                            skipPushingToBuffer = true;
                            // the function name token has already been consumed, and push it to the buffer
                            tokenBuffer.push(token);
                            let whitespaceTokens = [];
                            if (offset > 1) {
                                // consume all following whitespace tokens and push them to the buffer
                                whitespaceTokens = lexer.consume(offset - 1);
                                tokenBuffer.push(...whitespaceTokens);
                            }
                            // consume the opening parenthesis token and push it to the buffer
                            lexer.consume(1);
                            tokenBuffer.push(nextToken);
                            // get function implementation from the parsing context
                            let funcName = token.getValue();
                            let func = this._parsingCtx.findFunction(funcName);
                            if (func) {
                                // implementation found, create a function call builder and push it to the stack
                                exprBuilderStack.push(new kodeine_js_1.FunctionCallBuilder(this._parsingCtx, new kodeine_js_1.FunctionOccurence(func, token, ...whitespaceTokens, nextToken)));
                            }
                            else {
                                // function not found, throw
                                throw new kodeine_js_1.KodeFunctionNotFoundError(token);
                            }
                        }
                        else {
                            // this is not a function call, let the current expression builder handle the token
                            peekLastExprBuilder().addValue(token);
                        }
                    }
                    else if (token instanceof kodeine_js_1.QuotedValueToken) {
                        // pass the token to the current expression builder and let it throw exceptions if necessary
                        peekLastExprBuilder().addValue(token);
                    }
                    else if (token instanceof kodeine_js_1.OperatorToken) {
                        // pass the token to the current expression builder and let it throw exceptions if necessary
                        peekLastExprBuilder().addOperator(token);
                    }
                    else if (token instanceof kodeine_js_1.OpeningParenthesisToken) {
                        // found an opening parenthesis - it's either a subexpression or a function call
                        // TODO: Kustom has some funky behaviour around parentheses:
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
                            || prevToken instanceof kodeine_js_1.OperatorToken
                            || prevToken instanceof kodeine_js_1.OpeningParenthesisToken
                            || prevToken instanceof kodeine_js_1.DollarSignToken
                            || prevToken instanceof kodeine_js_1.CommaToken) {
                            // if there is no previous token or this parenthesis follows an operator,
                            // the parenthesis starts a subexpression
                            exprBuilderStack.push(new kodeine_js_1.ExpressionBuilder(this._parsingCtx, true, token));
                        }
                        else if (prevToken instanceof kodeine_js_1.UnquotedValueToken) {
                            // if the previous token is an unquoted value token, interpret this as a function call
                            // this should never happen, but the error exists as a sanity check
                            throw new kodeine_js_1.KodeSyntaxError(token, `Unquoted value followed by an opening parenthesis wasn't picked up as a function call.`);
                        }
                        else {
                            // the parenthesis cannot follow any other token
                            throw new kodeine_js_1.KodeSyntaxError(token, `An opening parenthesis cannot follow a(n) ${prevToken.getName()}.`);
                        }
                    }
                    else if (token instanceof kodeine_js_1.CommaToken) {
                        // a comma means the end of the current function argument
                        // check if we are currently building a function call
                        let lastExprBuilder = peekLastExprBuilder();
                        if (lastExprBuilder instanceof kodeine_js_1.FunctionCallBuilder) {
                            // building a function call, let the builder handle the comma
                            lastExprBuilder.nextArgument(token);
                        }
                        else {
                            // not building a function call, the comma is invalid
                            throw new kodeine_js_1.KodeSyntaxError(token, `A comma cannot appear outside of function calls.`);
                        }
                    }
                    else if (token instanceof kodeine_js_1.ClosingParenthesisToken) {
                        // a closing parenthesis means the end of the current subexpression
                        // check if we have subexpressions
                        if (exprBuilderStack.length <= 1) {
                            // no subexpressions - the closing parenthesis is invalid
                            throw new kodeine_js_1.KodeSyntaxError(token, `Too many closing parentheses.`);
                        }
                        else {
                            // pop the last expression bulilder from the stack and build it
                            let evaluable = exprBuilderStack.pop().build(token);
                            // add the built evaluable to the new last expression builder
                            peekLastExprBuilder().addEvaluable(evaluable);
                        }
                    }
                    else if (token instanceof kodeine_js_1.DollarSignToken) {
                        // a dollar sign token ends the current evaluable part
                        // override the default pushing to buffer behaviour - we are resetting the buffer after this token
                        skipPushingToBuffer = true;
                        // check if there are unclosed subexpressions
                        if (exprBuilderStack.length > 1) {
                            // there are unclosed subexpressions, missing closing parentheses
                            throw new kodeine_js_1.KodeSyntaxError(token, `Unclosed parentheses (${exprBuilderStack.length - 1}).`);
                        }
                        // pop the root expression builder from the stack, build it
                        let evaluable = exprBuilderStack.pop().build(token);
                        // add the built evaluable directly to formula evaluables
                        formulaEvaluables.push(evaluable);
                        // switch the state back to plain text
                        state = KodeineParserState.Default;
                        // reset the buffer
                        tokenBuffer = [];
                    }
                    else if (token instanceof kodeine_js_1.UnclosedQuotedValueToken) {
                        // an unclosed quoted value token causes the entire formula to be treated like plain text,
                        // except the leading $ gets removed from the output.
                        state = KodeineParserState.Default;
                        // override the default behaviour - we'll reset the buffer
                        // this does not really matter since an unclosed quoted value token should be the last token of any formula
                        skipPushingToBuffer = true;
                        if (tokenBuffer.length > 0) {
                            // add the unclosed quoted value token to the output
                            tokenBuffer.push(token);
                            this._parsingCtx.sideEffects.warnings.push(new kodeine_js_1.UnclosedQuotedValueWarning(...tokenBuffer));
                            // we read some plain text tokens before this point, add a plain text part
                            formulaEvaluables.push(new kodeine_js_1.KodeValue(tokenBuffer.slice(1).map(t => t.getSourceText()).join(''), new kodeine_js_1.EvaluableSource(...tokenBuffer)));
                        }
                        tokenBuffer = [];
                        // there should be no more tokens after an unclosed quoted value token
                    }
                    else if (token instanceof kodeine_js_1.WhitespaceToken) {
                        // do nothing with whitespace, but don't throw UnrecognizedTokenError
                        peekLastExprBuilder().addWhitespace(token);
                    }
                    else {
                        // forgot to implement something, or the lexer produced an unexpected token
                        throw new kodeine_js_1.UnrecognizedTokenError(token);
                    }
                    if (!skipPushingToBuffer) {
                        // the default behaviour was not overriden, so push the current token to the buffer
                        tokenBuffer.push(token);
                    }
                }
                catch (err) {
                    if (err instanceof kodeine_js_1.KodeParsingError) {
                        // catch parsing errors thrown when parsing from current token
                        // log parsing error as a side effect
                        this._parsingCtx.sideEffects.errors.push(err);
                        if (token instanceof kodeine_js_1.DollarSignToken) {
                            // error thrown when reading a dollar sign token
                            // switch state to default
                            state = KodeineParserState.Default;
                        }
                        else {
                            // error was not thrown when reading a dollar sign token,
                            // try to find a following dollar sign token
                            let nextToken;
                            // read following tokens until EOF or a dollar sign token is encountered
                            do {
                                // consume a token
                                nextToken = lexer.consume(1)[0];
                                if (token) {
                                    // store in buffer
                                    tokenBuffer.push(token);
                                    if (token instanceof kodeine_js_1.DollarSignToken) {
                                        // encountered a dollar sign token
                                        // switch state to default and continue parsing despite the parsing error
                                        state = KodeineParserState.Default;
                                        break;
                                    }
                                }
                            } while (!lexer.EOF() && token && !(token instanceof kodeine_js_1.DollarSignToken));
                        }
                        // encountered either a dollar sign token or formula ended
                        // add a broken evaluable to the formula - it will print an empty string
                        formulaEvaluables.push(new kodeine_js_1.BrokenEvaluable(new kodeine_js_1.EvaluableSource(...tokenBuffer)));
                        // clear the token buffer
                        tokenBuffer = [];
                    }
                    else {
                        // rethrow other errors (crashes)
                        throw err;
                    }
                }
            }
            else {
                // this should never happen
                throw new Error('Invalid parser state.');
            }
        }
        // we read all tokens the lexer had to offer
        if (tokenBuffer.length > 0) {
            if (state === KodeineParserState.Default) {
                // we read some plain text tokens before this point, add a plain text part
                formulaEvaluables.push(new kodeine_js_1.KodeValue(tokenBuffer.map(t => t.getPlainTextOutput()).join(''), new kodeine_js_1.EvaluableSource(...tokenBuffer)));
            }
            else {
                // we read an opening dollar sign, but not a closing one
                // in this case, Kustom prints all tokens except the opening dollar sign as plain text
                this._parsingCtx.sideEffects.warnings.push(new kodeine_js_1.UnclosedDollarSignWarning(...tokenBuffer));
                formulaEvaluables.push(new kodeine_js_1.KodeValue(tokenBuffer.slice(1).map(t => t.getSourceText()).join(''), new kodeine_js_1.EvaluableSource(...tokenBuffer)));
            }
        }
        let formula = new kodeine_js_1.Formula(formulaEvaluables);
        return formula;
    }
}
exports.KodeineParser = KodeineParser;
//# sourceMappingURL=kodeine-parser.js.map