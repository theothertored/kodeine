import { Evaluable, IUnaryOperator, EvaluableSource, EvaluationContext, KodeValue } from "../base.js";

export class UnaryOperation extends Evaluable {

    public readonly operator: IUnaryOperator;
    public readonly arg: Evaluable;

    constructor(operator: IUnaryOperator, arg: Evaluable, source?: EvaluableSource) {
        super(source);
        this.operator = operator;
        this.arg = arg;
    }

    public evaluate(env: EvaluationContext): KodeValue {
        return this.operator.operation(this.arg.evaluate(env));
    }

}
