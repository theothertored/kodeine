import { Evaluable, IFormulaToken, ILexer, IFormulaStringParser, KodeValue, ICharReader } from "../base.js";
import { EvaluableSource } from "../base.js";
import { KodeFunctionNotFoundError, KodeSyntaxError, UnrecognizedTokenError } from "../errors.js";
import { Formula } from "../evaluables/formula.js";
import { ClosingParenthesisToken, CommaToken, DollarSignToken, OpeningParenthesisToken, OperatorToken, QuotedValueToken, UnclosedQuotedValueToken, UnquotedValueToken, WhitespaceToken } from "../kodeine-lexer/formula-tokens.js";
import { KodeineLexer } from "../kodeine-lexer/kodeine-lexer.js";
import { StringCharReader } from "../string-char-reader.js";
import { ExpressionBuilder } from "./expressions/expression-builder.js";
import { FunctionCallBuilder } from "./expressions/function-call-builder.js";
import { FunctionOccurence } from "./expressions/function-occurence.js";
import { IExpressionBuilder } from "./expressions/i-expression-builder.js";
import { ParsingContext } from "./parsing-context.js";

/** 
 * Values representing the current state of the parser. 
 * - {@link Default}: Not in an evaluable part of the formula
 * - {@link Kode}: In an evaluable part of the formula
*/
export enum KodeineParserState {
    Default, Kode
}

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
export class KodeineParser implements IFormulaStringParser {

    /** The parsing context. Contains function and operator implementations. */
    private _env: ParsingContext;

    /** Constructs a {@link KodeineParser} with a parsing context.*/
    constructor(env: ParsingContext) {
        this._env = env;
    }

    parse(source: string | ICharReader | ILexer): Formula {

        if (typeof source === 'string') {

            let charReader = new StringCharReader(source);
            let lexer = new KodeineLexer(charReader, this._env.getOperatorSymbolsLongestFirst());
            return this._parseCore(lexer);

        } else if (source instanceof ICharReader) {

            let lexer = new KodeineLexer(source, this._env.getOperatorSymbolsLongestFirst());
            return this._parseCore(lexer);

        } else if (source instanceof ILexer) {

            return this._parseCore(source);

        } else {

            throw new Error('Cannot parse the given source.');

        }

    }

    /** The actual parser implementation - takes an {@link ILexer}, produces a {@link Formula}. */
    private _parseCore(lexer: ILexer): Formula {

        /** The current state of the parser. */
        let state = KodeineParserState.Default;

        /** 
         * A formula contains a list of evaluables that are concatenated together after evaluation. 
         * This variable is used to constrcut that list as the formula is being parsed.
         */
        let formulaEvaluables: Evaluable[] = [];

        /** Holds all tokens that were read since the start of the current plain text or evaluable part. */
        let tokenBuffer: IFormulaToken[] = [];

        /**
         * - An expression builder is created and pushed to the stack when an evaluable part begins.
         * - Each subexpression or function call pushes a builder to this stack.  
         * - New expression tokens are added to the last builder in the stack.  
         * - A closing parenthesis causes the last builder to be popped of the stack, built and added to the new last builder as an evaluable.
         */
        let exprBuilderStack: IExpressionBuilder[] = [];

        /** Returns the first non-whitespace token from the end of the buffer. */
        function getPrevNonWhitespaceToken() {

            if (tokenBuffer.length === 0) {

                // token buffer is empty
                return null;

            } else {

                // start from the last index of the buffer
                let index = tokenBuffer.length - 1;
                let token = tokenBuffer[index];

                // go backwards until there are no more tokens or a non whitespace token is encountered
                while (token && token instanceof WhitespaceToken) {
                    index--;
                    token = tokenBuffer[index];
                }

                // return the token that was found or null if every token in the buffer is a whitespace token
                return token ?? null;

            }

        };

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

                if (token instanceof DollarSignToken) {

                    // this is a dollar sign token, a formula is beginning
                    state = KodeineParserState.Kode;

                    // add a base expression builder to the stack
                    exprBuilderStack = [new ExpressionBuilder(this._env, true, token)];

                    // check the token buffer
                    if (tokenBuffer.length > 0) {

                        // we read some plain text tokens before this point, add them to formula evaluables
                        formulaEvaluables.push(new KodeValue(
                            tokenBuffer.map(t => t.getSourceText()).join(''),
                            new EvaluableSource(...tokenBuffer)
                        ));

                    }

                    // start a new buffer with the dollar sign token already in
                    tokenBuffer = [token];

                } else {

                    // any other token goes straight into the buffer
                    tokenBuffer.push(token);

                }

            } else if (state === KodeineParserState.Kode) {

                // we are currently in an evaluable part

                // expected tokens:
                // WhitespaceToken, 
                // QuotedValueToken, UnquotedValueToken, OperatorToken,
                // OpeningParenthesisToken, ClosingParenthesisToken, CommaToken, 
                // DollarSignToken, UnclosedQuotedValueToken

                if (token instanceof UnquotedValueToken) {

                    // an unquoted value token could be a normal unquoted value, or the start of a function call
                    // we need to see the following tokens to know

                    let offset = 0;
                    let nextToken = lexer.peek(1, offset++)[0];

                    if (nextToken instanceof WhitespaceToken) {

                        // the next token being a whitespace token doesn't give us anything useful
                        while (nextToken && nextToken instanceof WhitespaceToken) {

                            nextToken = lexer.peek(1, offset++)[0];

                        }

                        // after the loop above there are no more tokens or we have a non-whitespace token in nextToken
                    }

                    if (nextToken instanceof OpeningParenthesisToken) {

                        // the next non-whitespace token is an opening parenthesis token, this is the start of a function call

                        // override the default buffer pushing behaviour
                        skipPushingToBuffer = true;

                        // the function name token has already been consumed, and push it to the buffer
                        tokenBuffer.push(token);

                        let whitespaceTokens: IFormulaToken[] = [];

                        if (offset > 1) {
                            // consume all following whitespace tokens and push them to the buffer
                            whitespaceTokens = lexer.consume(offset - 1)
                            tokenBuffer.push(...whitespaceTokens);
                        }

                        // consume the opening parenthesis token and push it to the buffer
                        lexer.consume(1);
                        tokenBuffer.push(nextToken);

                        // get function implementation from the parsing context
                        let funcName = token.getValue();
                        let func = this._env.findFunction(funcName);

                        if (func) {

                            // implementation found, create a function call builder and push it to the stack
                            exprBuilderStack.push(new FunctionCallBuilder(
                                this._env,
                                new FunctionOccurence(func, token, ...whitespaceTokens, nextToken)
                            ));

                        } else {

                            // function not found, throw
                            throw new KodeFunctionNotFoundError(token);

                        }

                    } else {

                        // this is not a function call, let the current expression builder handle the token
                        peekLastExprBuilder().addValue(token);

                    }


                } else if (token instanceof QuotedValueToken) {

                    // pass the token to the current expression builder and let it throw exceptions if necessary
                    peekLastExprBuilder().addValue(token);


                } else if (token instanceof OperatorToken) {

                    // pass the token to the current expression builder and let it throw exceptions if necessary
                    peekLastExprBuilder().addOperator(token);


                } else if (token instanceof OpeningParenthesisToken) {

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

                    } else if (prevToken instanceof UnquotedValueToken) {

                        // if the previous token is an unquoted value token, interpret this as a function call
                        // this should never happen, but the error exists as a sanity check
                        throw new KodeSyntaxError(token, `Unquoted value followed by an opening parenthesis wasn't picked up as a function call.`);

                    } else {

                        // the parenthesis cannot follow any other token
                        throw new KodeSyntaxError(token, `An opening parenthesis cannot follow a(n) ${prevToken.getName()}.`);

                    }

                } else if (token instanceof CommaToken) {

                    // a comma means the end of the current function argument

                    // check if we are currently building a function call
                    let lastExprBuilder = peekLastExprBuilder();

                    if (lastExprBuilder instanceof FunctionCallBuilder) {

                        // building a function call, let the builder handle the comma
                        lastExprBuilder.nextArgument(token);

                    } else {

                        // not building a function call, the comma is invalid
                        throw new KodeSyntaxError(token, `A comma cannot appear outside of function calls.`);

                    }


                } else if (token instanceof ClosingParenthesisToken) {

                    // a closing parenthesis means the end of the current subexpression

                    // check if we have subexpressions
                    if (exprBuilderStack.length <= 1) {

                        // no subexpressions - the closing parenthesis is invalid
                        throw new KodeSyntaxError(token, `Too many closing parentheses.`);

                    } else {

                        // pop the last expression bulilder from the stack and build it
                        let evaluable = exprBuilderStack.pop()!.build(token);

                        // add the built evaluable to the new last expression builder
                        peekLastExprBuilder().addEvaluable(evaluable);

                    }

                } else if (token instanceof DollarSignToken) {

                    // a dollar sign token ends the current evaluable part

                    // override the default pushing to buffer behaviour - we are resetting the buffer after this token
                    skipPushingToBuffer = true;

                    // check if there are unclosed subexpressions
                    if (exprBuilderStack.length > 1) {

                        // there are unclosed subexpressions, missing closing parentheses
                        throw new KodeSyntaxError(token, `Unclosed parentheses (${exprBuilderStack.length - 1}).`);

                    }

                    // pop the root expression builder from the stack, build it
                    let evaluable = exprBuilderStack.pop()!.build(token);

                    // add the built evaluable directly to formula evaluables
                    formulaEvaluables.push(evaluable);

                    // switch the state back to plain text
                    state = KodeineParserState.Default;

                    // reset the buffer
                    tokenBuffer = [];

                } else if (token instanceof UnclosedQuotedValueToken) {

                    // an unclosed quoted value token causes the entire formula to be treated like plain text,
                    // except the leading $ gets removed from the output.
                    state = KodeineParserState.Default;

                    if (tokenBuffer.length > 0) {

                        // we read some plain text tokens before this point, add a plain text part
                        formulaEvaluables.push(new KodeValue(
                            tokenBuffer.slice(1).map(t => t.getSourceText()).join(''),
                            new EvaluableSource(...tokenBuffer)
                        ));

                    }

                    tokenBuffer = [];

                    // there should be no more tokens after an unclosed quoted value token

                } else if (token instanceof WhitespaceToken) {

                    // do nothing with whitespace, but don't throw UnrecognizedTokenError
                    // TODO: put whitespace tokens in evaluable sources?

                } else {

                    // forgot to implement something, or the lexer produced an unexpected token
                    throw new UnrecognizedTokenError(token);

                }

                if (!skipPushingToBuffer) {

                    // the default behaviour was not overriden, so push the current token to the buffer
                    tokenBuffer.push(token);

                }

            } else {

                // this should never happen
                throw new Error('Invalid parser state.');

            }
        }

        // we read all tokens the lexer had to offer

        if (tokenBuffer.length > 0) {

            if (state === KodeineParserState.Default) {

                // we read some plain text tokens before this point, add a plain text part
                formulaEvaluables.push(new KodeValue(

                    tokenBuffer.map(t => t.getSourceText()).join(''),
                    new EvaluableSource(...tokenBuffer)

                ));

            } else {
                
                // we read an opening dollar sign, but not a closing one
                // in this case, kustom prints all tokens except the opening dollar sign as plain text
                formulaEvaluables.push(new KodeValue(
                    tokenBuffer.slice(1).map(t => t.getSourceText()).join(''),
                    new EvaluableSource(...tokenBuffer)
                ));

            }
        }

        let formula = new Formula(formulaEvaluables);

        return formula;
    }

}
