import { Evaluable } from "../base.js";
import { InternalEvaluationError } from "../errors.js";
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
    evaluate(env) {
        try {
            return this.operator.operation(this.arg.evaluate(env));
        }
        catch (err) {
            if (err instanceof InternalEvaluationError) {
                // if an internal evaluation was thrown, we need to convert it
                // to an external one with this operation as the evaluable
                throw err.toExternalError(this);
            }
            else {
                throw err;
            }
        }
    }
}
//# sourceMappingURL=unary-operation.js.map