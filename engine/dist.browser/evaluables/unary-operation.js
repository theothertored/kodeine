import { Evaluable } from "../base.js";
/** An operation consisting of a unary operator and an evaluable argument. */
export class UnaryOperation extends Evaluable {
    /**
     * Constructs a binary operation from an operator and two arguments.
     * @param operator The operator.
     * @param arg The only argument.
     * @param source Optionally, the source of this operation.
     */
    constructor(operator, arg, source) {
        super(source);
        this.operator = operator;
        this.arg = arg;
    }
    evaluate(evalCtx) {
        return this.operator.operation(evalCtx, this, this.arg.evaluate(evalCtx));
    }
}
//# sourceMappingURL=unary-operation.js.map