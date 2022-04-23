import { Evaluable } from "../base.js";
export class BinaryOperation extends Evaluable {
    constructor(operator, argA, argB, source) {
        super(source);
        this.operator = operator;
        this.argA = argA;
        this.argB = argB;
    }
    evaluate(env) {
        let kodeVal = this.operator.operation(this.argA.evaluate(env), this.argB.evaluate(env));
        // the value resulting from this operation should have the same source as the operation 
        kodeVal.source = this.source;
        return kodeVal;
    }
}
//# sourceMappingURL=binary-operation.js.map