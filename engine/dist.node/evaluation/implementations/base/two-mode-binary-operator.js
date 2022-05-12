"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoModeBinaryOperator = void 0;
const kodeine_js_1 = require("../../../kodeine.js");
/**
 * Base class for operators that work in one way if both arguments are numeric,
 * and otherwise concatenate with the operator symbol in the middle.
 * @example <caption>Example two mode operator.</caption>
 * 2 / 2    // returns 1
 * "a" / 2  // returns "a/2"
 */
class TwoModeBinaryOperator extends kodeine_js_1.IBinaryOperator {
    /** Selects between a numeric mode and default text mode. */
    operation(evalCtx, operation, a, b) {
        if (a.isNumeric && b.isNumeric) {
            // both values are numeric, run numeric mode
            return new kodeine_js_1.KodeValue(this.numericMode(a.numericValue, b.numericValue), operation.source);
        }
        else {
            // at least one of the values is not numeric, run text mode
            return new kodeine_js_1.KodeValue(this.textMode(a, b), operation.source);
        }
    }
    /**
     * Implements the text mode of this operator.
     * The default implementation concatenates two values together
     * and inserts the operator symbol in the middle.
     * @param a The left hand side argument.
     * @param b The right hand side argument.
     * @returns Text mode operation result.
     */
    textMode(a, b) {
        // if either a or b is numeric, concat the numeric value instead of the text value.
        // for example, 2.000 + "text" => 2text
        if (a.isNumeric)
            return a.numericValue + this.getSymbol() + b.text;
        else if (b.isNumeric)
            return a.text + this.getSymbol() + b.numericValue;
        else
            return a.text + this.getSymbol() + b.text;
    }
}
exports.TwoModeBinaryOperator = TwoModeBinaryOperator;
//# sourceMappingURL=two-mode-binary-operator.js.map