import { Evaluable, IUnaryOperator, EvaluableSource, KodeValue } from "../base.js";
import { EvaluationContext } from "./evaluation-context.js";

/** An operation consisting of a unary operator and an evaluable argument. */
export class UnaryOperation extends Evaluable {

    /** The operator. */
    public readonly operator: IUnaryOperator;

    /** The only argument. */
    public readonly arg: Evaluable;

    /**
     * Constructs a binary operation from an operator and two arguments.
     * @param operator The operator.
     * @param arg The only argument.
     * @param source Optionally, the source of this operation.
     */
    constructor(operator: IUnaryOperator, arg: Evaluable, source?: EvaluableSource) {
        super(source);
        this.operator = operator;
        this.arg = arg;
    }

    public evaluate(evalCtx: EvaluationContext): KodeValue {
        
        return this.operator.operation(evalCtx, this, this.arg.evaluate(evalCtx));
        
    }

}