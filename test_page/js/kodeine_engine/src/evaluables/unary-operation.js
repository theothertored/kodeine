import { Evaluable } from "../base.js";
export class UnaryOperation extends Evaluable {
    constructor(operator, arg, source) {
        super(source);
        this.operator = operator;
        this.arg = arg;
    }
    evaluate(env) {
        return this.operator.operation(this.arg.evaluate(env));
    }
}
//# sourceMappingURL=unary-operation.js.map