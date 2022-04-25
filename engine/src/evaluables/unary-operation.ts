import { Evaluable, IUnaryOperator, EvaluableSource, EvaluationContext, KodeValue } from "../base.js";
import { InternalEvaluationError } from "../errors.js";

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

        try {

        return this.operator.operation(this.arg.evaluate(env));


        } catch (err) {

            if (err instanceof InternalEvaluationError) {

                // if an internal evaluation was thrown, we need to convert it
                // to an external one with this operation as the evaluable
                throw err.toExternalError(this);

            } else {
                throw err;
            }

        }

    }

}
