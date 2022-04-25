import { IBinaryOperator, Evaluable, KodeValue } from "../base.js";
import { EvaluableSource } from "../base.js";
import { EvaluationContext } from "./evaluation-context.js";
/** An operation consisting of an binary operator and two evaluable arguments. */
export declare class BinaryOperation extends Evaluable {
    /** The operator. */
    readonly operator: IBinaryOperator;
    /** The left hand side argument. */
    readonly argA: Evaluable;
    /** The right hand side argument. */
    readonly argB: Evaluable;
    /**
     * Constructs a binary operation from an operator and two arguments.
     * @param operator The operator.
     * @param argA The left hand side argument.
     * @param argB The right hand side argument.
     * @param source Optionally, the source of this operation.
     */
    constructor(operator: IBinaryOperator, argA: Evaluable, argB: Evaluable, source?: EvaluableSource);
    /** Evaluates both arguments and runs the operation using the resulting values. */
    evaluate(evalCtx: EvaluationContext): KodeValue;
}
