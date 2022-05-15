import {
    KodeValue,
    IBinaryOperator,
    BinaryOperation,
    EvaluationContext
} from "../../../kodeine.js";

/** 
 * Base class for operators that work in one way if both arguments are numeric,
 * and otherwise concatenate with the operator symbol in the middle.
 * @example <caption>Example two mode operator.</caption>
 * 2 / 2    // returns 1
 * "a" / 2  // returns "a/2"
 */
export abstract class TwoModeBinaryOperator extends IBinaryOperator {

    /** Selects between a numeric mode and default text mode. */
    operation(evalCtx: EvaluationContext, operation: BinaryOperation, a: KodeValue, b: KodeValue): KodeValue {

        if (!isNaN(a.numericValue) && !isNaN(b.numericValue)) {

            // both values are numeric, run numeric mode
            return new KodeValue(this.numericMode(a.numericValue, b.numericValue), operation.source);

        } else {

            // at least one of the values is not numeric, run text mode
            return new KodeValue(this.textMode(a, b), operation.source);

        }
    }

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
    textMode(a: KodeValue, b: KodeValue): string {

        // if either a or b is numeric, concat the numeric value instead of the text value.
        // for example, 2.000 + "text" => 2text

        if (!isNaN(a.numericValue))
            return a.numericValue + this.getSymbol() + b.text;

        else if (!isNaN(b.numericValue))
            return a.text + this.getSymbol() + b.numericValue;

        else
            return a.text + this.getSymbol() + b.text;

    }
}
