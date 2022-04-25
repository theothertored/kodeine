import { Evaluable } from "../base.js";
/** An operation consisting of an binary operator and two evaluable arguments. */
export class BinaryOperation extends Evaluable {
    /**
     * Constructs a binary operation from an operator and two arguments.
     * @param operator The operator.
     * @param argA The left hand side argument.
     * @param argB The right hand side argument.
     * @param source Optionally, the source of this operation.
     */
    constructor(operator, argA, argB, source) {
        super(source);
        this.operator = operator;
        this.argA = argA;
        this.argB = argB;
    }
    /** Evaluates both arguments and runs the operation using the resulting values. */
    evaluate(evalCtx) {
        return this.operator.operation(evalCtx, this, this.argA.evaluate(evalCtx), this.argB.evaluate(evalCtx));
    }
}
//# sourceMappingURL=binary-operation.js.map