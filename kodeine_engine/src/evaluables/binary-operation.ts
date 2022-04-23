import { IBinaryOperator, Evaluable, IFormulaToken, IKodeFunction, IUnaryOperator, KodeValue } from "../base.js";
import { EvaluableSource, EvaluationContext } from "../base.js";

export class BinaryOperation extends Evaluable {

    public readonly operator: IBinaryOperator;
    public readonly argA: Evaluable;
    public readonly argB: Evaluable;

    constructor(operator: IBinaryOperator, argA: Evaluable, argB: Evaluable, source?: EvaluableSource) {
        super(source);
        this.operator = operator;
        this.argA = argA;
        this.argB = argB;
    }

    evaluate(env: EvaluationContext): KodeValue {

        let kodeVal = this.operator.operation(this.argA.evaluate(env), this.argB.evaluate(env));

        // the value resulting from this operation should have the same source as the operation 
        kodeVal.source = this.source;

        return kodeVal;

    }

}
