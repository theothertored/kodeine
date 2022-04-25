"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NegationOperator = void 0;
const base_js_1 = require("../base.js");
const evaluation_context_js_1 = require("../evaluables/evaluation-context.js");
/** Implements the only unary operator in kode, negation (unary minus). */
class NegationOperator extends base_js_1.IUnaryOperator {
    getSymbol() { return '-'; }
    operation(evalCtx, operation, a) {
        if (a.isNumeric) {
            // the arugment is numeric, everything works as expected
            return new base_js_1.KodeValue(-a.numericValue);
        }
        else {
            evalCtx.sideEffects.warnings.push(new evaluation_context_js_1.UnaryMinusStringModeWarning(operation));
            // the argument is not numeric, panic
            // ...no, really, this is what kustom does
            // -abc => abc-null
            return new base_js_1.KodeValue(a.text + '-null');
        }
    }
}
exports.NegationOperator = NegationOperator;
//# sourceMappingURL=unary-operators.js.map