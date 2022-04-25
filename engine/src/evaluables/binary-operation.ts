import { IBinaryOperator, Evaluable, KodeValue } from "../base.js";
import { EvaluableSource } from "../base.js";
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
    evaluate(evalCtx: EvaluationContext): KodeValue {

        return this.operator.operation(evalCtx, this, this.argA.evaluate(evalCtx), this.argB.evaluate(evalCtx));
                    
    }

}
