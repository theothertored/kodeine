import { KodeValue, IBinaryOperator, BinaryOperation, EvaluationContext } from "../../../kodeine.js";
/**
 * Base class for operators that work in one way if both arguments are numeric,
 * and otherwise concatenate with the operator symbol in the middle.
 * @example <caption>Example two mode operator.</caption>
 * 2 / 2    // returns 1
 * "a" / 2  // returns "a/2"
 */
export declare abstract class TwoModeBinaryOperator extends IBinaryOperator {
    /** Selects between a numeric mode and default text mode. */
    operation(evalCtx: EvaluationContext, operation: BinaryOperation, a: KodeValue, b: KodeValue): KodeValue;
    /**
     * Implements the numeric mode of this operator.
     * @param a Left hand side numeric argument.
     * @param b Right hand side numeric argument.
     * @returns Numeric mode operation result.
     */
    abstract numericMode(a: number, b: number): (number | boolean);
    /**
     * Implements the text mode of this operator.
     * The default implementation concatenates two values together
     * and inserts the operator symbol in the middle.
     * @param a The left hand side argument.
     * @param b The right hand side argument.
     * @returns Text mode operation result.
     */
    textMode(a: KodeValue, b: KodeValue): string;
}
