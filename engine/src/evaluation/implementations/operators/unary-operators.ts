import {
    KodeValue,
    IUnaryOperator,
    EvaluationContext,
    UnaryOperation,
    UnaryMinusStringModeWarning
} from "../../../kodeine.js";

/** Implements the only unary operator in kode, negation (unary minus). */
export class NegationOperator extends IUnaryOperator {

    getSymbol() { return '-'; }

    operation(evalCtx: EvaluationContext, operation: UnaryOperation, a: KodeValue): KodeValue {

        if (a.isNumeric) {

            // the arugment is numeric, everything works as expected
            let value = -a.numericValue;
            if (Number.isInteger(value))
                // replicate the weird behaviour .0 being added to integers after negation
                return new KodeValue(value + '.0');

            else
                return new KodeValue(value);


        } else {

            evalCtx.sideEffects.warnings.push(new UnaryMinusStringModeWarning(operation));

            // the argument is not numeric, panic
            // ...no, really, this is what Kustom does
            // -abc => abc-null
            return new KodeValue(a.text + '-null', operation.source);

        }
    }

}
