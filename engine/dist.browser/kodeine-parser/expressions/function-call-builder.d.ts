import { WhitespaceToken } from "engine/src/kodeine-lexer/formula-tokens.js";
import { Evaluable, FormulaToken, CommaToken, ParsingContext, FunctionOccurence, IExpressionBuilder, OperatorToken, QuotedValueToken, UnquotedValueToken } from "../../kodeine.js";
/** Parsing helper class that can be fed tokens and then builds a {@link FunctionCall} evaluable. */
export declare class FunctionCallBuilder extends IExpressionBuilder {
    /** The parsing context for this builder. */
    private readonly _parsingCtx;
    /** The function occurence that started this function call. */
    private readonly _functionOccurence;
    /** Tokens between the opening and closing parenthesis of this function call. */
    private _innerTokens;
    /** An expression builder for building arguments. */
    private _currentArgumentBuilder;
    /** An array of evaluables representing arguments of this function call that were already built. */
    private _args;
    /**
     * Constructs a {@link FunctionCallBuilder} with a given parsing context and a function occurence that started this function call.
     * @param parsingCtx The parsing context for this function call builder.
     * @param functionOccurence The function occurrence that started this function call.
     */
    constructor(parsingCtx: ParsingContext, functionOccurence: FunctionOccurence);
    addEvaluable(evaluable: Evaluable): void;
    addValue(token: (QuotedValueToken | UnquotedValueToken)): void;
    addOperator(token: OperatorToken): void;
    addWhitespace(token: WhitespaceToken): void;
    /**
     * Builds the current argument and prepares for the next one.
     * @param comma The comma token that ended the current argument.
     * @throws {KodeSyntaxError} Argument missing.
     */
    nextArgument(comma: CommaToken): void;
    /**
     * Builds the current argument and then builds a function call with all previously built arguments.
     * @param closingToken The token that closes this function call (most likely a closing parenthesis token).
     * @returns A {@link FunctionCall} evaluable.
     */
    build(closingToken: FormulaToken): Evaluable;
}
