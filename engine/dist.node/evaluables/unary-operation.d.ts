import { Evaluable, IUnaryOperator, EvaluableSource, KodeValue } from "../base.js";
import { EvaluationContext } from "./evaluation-context.js";
/** An operation consisting of a unary operator and an evaluable argument. */
export declare class UnaryOperation extends Evaluable {
    /** The operator. */
    readonly operator: IUnaryOperator;
    /** The only argument. */
    readonly arg: Evaluable;
    /**
     * Constructs a binary operation from an operator and two arguments.
     * @param operator The operator.
     * @param arg The only argument.
     * @param source Optionally, the source of this operation.
     */
    constructor(operator: IUnaryOperator, arg: Evaluable, source?: EvaluableSource);
    evaluate(evalCtx: EvaluationContext): KodeValue;
}
