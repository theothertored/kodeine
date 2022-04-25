import { IBinaryOperator, Evaluable, KodeValue } from "../base.js";
import { EvaluableSource } from "../base.js";
import { InternalEvaluationError } from "../errors.js";
import { EvaluationContext } from "./evaluation-context.js";

/** An operation consisting of an binary operator and two evaluable arguments. */
export class BinaryOperation extends Evaluable {

    /** The operator. */
    public readonly operator: IBinaryOperator;

    /** The left hand side argument. */
    public readonly argA: Evaluable;

    /** The right hand side argument. */
    public readonly argB: Evaluable;

    /**
     * Constructs a binary operation from an operator and two arguments.
     * @param operator The operator.
     * @param argA The left hand side argument.
     * @param argB The right hand side argument.
     * @param source Optionally, the source of this operation.
     */
    constructor(operator: IBinaryOperator, argA: Evaluable, argB: Evaluable, source?: EvaluableSource) {
        super(source);
        this.operator = operator;
        this.argA = argA;
        this.argB = argB;
    }

    /** Evaluates both arguments and runs the operation using the resulting values. */
    evaluate(env: EvaluationContext): KodeValue {

        try {
            
            // run the operation to obtain a kode value
            let kodeVal = this.operator.operation(env, this, this.argA.evaluate(env), this.argB.evaluate(env));
            
            // the value resulting from this operation should have the same source as the operation 
            kodeVal.source = this.source;
            
            return kodeVal;

        } catch (err) {

            if (err instanceof InternalEvaluationError) {

                // if an internal evaluation was thrown, we need to convert it
                // to an external one with this operation as the evaluable
                throw err.toExternalError(this);

            } else {
                throw err;
            }

        }
            
    }

}
