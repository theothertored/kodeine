import { IUnaryOperator, KodeValue } from "../base.js";
import { EvaluationContext, UnaryMinusStringModeWarning } from "../evaluables/evaluation-context.js";
import { UnaryOperation } from "../evaluables/unary-operation.js";

/** Implements the only unary operator in kode, negation (unary minus). */
export class NegationOperator extends IUnaryOperator {

    getSymbol() { return '-'; }

    operation(evalCtx: EvaluationContext, operation: UnaryOperation, a: KodeValue): KodeValue {

        if (a.isNumeric) {

            // the arugment is numeric, everything works as expected
            return new KodeValue(-a.numericValue);

        } else {

            evalCtx.sideEffects.warnings.push(new UnaryMinusStringModeWarning(operation));

            // the argument is not numeric, panic
            // ...no, really, this is what kustom does
            // -abc => abc-null
            return new KodeValue(a.text + '-null', operation.source);

        }
    }

}
