import { Evaluable, IFormulaToken } from "../../base.js";
import { OperatorToken, QuotedValueToken, UnquotedValueToken } from "../../kodeine-lexer/formula-tokens.js";
import { ParsingContext } from "../parsing-context.js";
/** Parsing helper class that can be fed tokens and then builds an evaluable tree. */
export declare class ExpressionBuilder {
    /** The parsing context. Contains information on what functions and operators exist and ties their names/symbols to implementations. */
    protected readonly _parseCtx: ParsingContext;
    /**
     * Whether the built expression should include starting and ending tokens in its source.
     * Should be true for expressions in parentheses and root formula expressions (between dollar signs).
     */
    protected readonly _includeSurroundingTokens: boolean;
    /** The token or tokens that started this expression (opening parenthesis, dollar sign, function name + opening parenthesis etc.). */
    protected readonly _startingTokens: IFormulaToken[];
    /**
     * Constructs an expression builder with a given parsing context.
     * @param parseCtx The parsing context for this expression builder.
     * @param includeSurroundingTokens Whether the built expression should include starting and ending tokens in its source.
     * @param startingTokens The token or tokens that started the built expression.
     */
    constructor(parseCtx: ParsingContext, includeSurroundingTokens: boolean, ...startingTokens: IFormulaToken[]);
    /** Elements of the built expression. Expressions consist of evaluables and operators. */
    private _elements;
    /** Returns the current last element of {@link _elements}. */
    private _getLastElement;
    addValue(token: (QuotedValueToken | UnquotedValueToken)): void;
    addEvaluable(evaluable: Evaluable): void;
    addOperator(token: OperatorToken): void;
    /** Returns whether this expression has any elements. */
    getIsEmpty(): boolean;
    /**
     * Builds an evaluable tree from added expression elements.
     * @param closingToken The token that is closing this expression (closing parenthesis, dollar sign etc.).
     * @returns An evaluable tree. If {@link includeSurroundingTokens} is `true`, returns an {@link Expression}
     * wrapping an evaluable and containing the opening and closing tokens in its source.
     * Otherwise, returns the root (last-in-order) evaluable of the expression.
     */
    build(closingToken: IFormulaToken): Evaluable;
}
