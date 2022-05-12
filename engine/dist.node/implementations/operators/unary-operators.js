"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NegationOperator = void 0;
const kodeine_js_1 = require("../../kodeine.js");
/** Implements the only unary operator in kode, negation (unary minus). */
class NegationOperator extends kodeine_js_1.IUnaryOperator {
    getSymbol() { return '-'; }
    operation(evalCtx, operation, a) {
        if (a.isNumeric) {
            // the arugment is numeric, everything works as expected
            let value = -a.numericValue;
            if (Number.isInteger(value))
                // replicate the weird behaviour .0 being added to integers after negation
                return new kodeine_js_1.KodeValue(value + '.0');
            else
                return new kodeine_js_1.KodeValue(value);
        }
        else {
            evalCtx.sideEffects.warnings.push(new kodeine_js_1.UnaryMinusStringModeWarning(operation));
            // the argument is not numeric, panic
            // ...no, really, this is what Kustom does
            // -abc => abc-null
            return new kodeine_js_1.KodeValue(a.text + '-null', operation.source);
        }
    }
}
exports.NegationOperator = NegationOperator;
//# sourceMappingURL=unary-operators.js.map