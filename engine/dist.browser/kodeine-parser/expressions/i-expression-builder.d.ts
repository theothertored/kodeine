import { WhitespaceToken } from "engine/src/kodeine-lexer/formula-tokens.js";
import { Evaluable, FormulaToken, OperatorToken, QuotedValueToken, UnquotedValueToken } from "../../kodeine.js";
/** Represents an expression builder that can be fed tokens and builds an evaluable. */
export declare abstract class IExpressionBuilder {
    /**
     * Adds a value from a quoted or unquoted value token to the expression.
     * @param token The value token to create a kode value from.
     * @throws {KodeSyntaxError} A value cannot follow another value.
     */
    abstract addValue(token: (QuotedValueToken | UnquotedValueToken)): void;
    /**
     * Adds an evaluable to the expression.
     * @param evaluable The evaluable to add
     * @throws {KodeSyntaxError} A value cannot follow another value.
     */
    abstract addEvaluable(evaluable: Evaluable): void;
    /**
     * Adds an operator occurence from a token to the expression.
     * @param token The operator token to create an operator occurence from.
     * @throws {KodeSyntaxError} Left hand side argument for binary operator missing.
     * @throws {KodeSyntaxError} Unary operator cannot have a left hand side argument.
     * @throws {KodeSyntaxError} Unrecognized operator.
     */
    abstract addOperator(token: OperatorToken): void;
    /**
     * Adds a whitespace token to the expression.
     * @param token The whitespace token to be added to the expression's source.
     */
    abstract addWhitespace(token: WhitespaceToken): void;
    /**
     * Builds the expression.
     */
    abstract build(closingToken: FormulaToken): Evaluable;
}
