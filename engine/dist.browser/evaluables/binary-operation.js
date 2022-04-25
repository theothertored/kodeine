import { Evaluable } from "../base.js";
import { InternalEvaluationError } from "../errors.js";
/** An operation consisting of an binary operator and two evaluable arguments. */
export class BinaryOperation extends Evaluable {
    /**
     * Constructs a binary operation from an operator and two arguments.
     * @param operator The operator.
     * @param argA The left hand side argument.
     * @param argB The right hand side argument.
     * @param source Optionally, the source of this operation.
     */
    constructor(operator, argA, argB, source) {
        super(source);
        this.operator = operator;
        this.argA = argA;
        this.argB = argB;
    }
    /** Evaluates both arguments and runs the operation using the resulting values. */
    evaluate(env) {
        try {
            // run the operation to obtain a kode value
            let kodeVal = this.operator.operation(env, this, this.argA.evaluate(env), this.argB.evaluate(env));
            // the value resulting from this operation should have the same source as the operation 
            kodeVal.source = this.source;
            return kodeVal;
        }
        catch (err) {
            if (err instanceof InternalEvaluationError) {
                // if an internal evaluation was thrown, we need to convert it
                // to an external one with this operation as the evaluable
                throw err.toExternalError(this);
            }
            else {
                throw err;
            }
        }
    }
}
//# sourceMappingURL=binary-operation.js.map