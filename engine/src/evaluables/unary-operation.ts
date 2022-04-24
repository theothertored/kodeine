import { Evaluable, IUnaryOperator, EvaluableSource, EvaluationContext, KodeValue } from "../base.js";

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

    public evaluate(env: EvaluationContext): KodeValue {
        return this.operator.operation(this.arg.evaluate(env));
    }

}
