import {
    IUnaryOperator,
    Evaluable,
    EvaluableSource,
    EvaluationContext,
    EvaluatedUnaryOperation,
    KodeValue
} from "../../kodeine.js";

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

        if (evalCtx.buildEvaluationTree) {

            // we are building an evaluation tree

            let argResult = this.arg.evaluate(evalCtx);
            let argNode = evalCtx.sideEffects.lastEvaluationTreeNode!;

            let result = this.operator.operation(evalCtx, this, argResult);

            evalCtx.sideEffects.lastEvaluationTreeNode = new EvaluatedUnaryOperation(
                this, argNode, result
            );

            return result;

        } else {

            // we are not building an evaluation tree, simple call
            return this.operator.operation(evalCtx, this, this.arg.evaluate(evalCtx));

        }

    }

}
