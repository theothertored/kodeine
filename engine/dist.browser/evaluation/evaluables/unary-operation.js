import { Evaluable, EvaluatedUnaryOperation } from "../../kodeine.js";
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
        if (evalCtx.buildEvaluationTree) {
            // we are building an evaluation tree
            let argResult = this.arg.evaluate(evalCtx);
            let argNode = evalCtx.sideEffects.lastEvaluationTreeNode;
            let result = this.operator.operation(evalCtx, this, argResult);
            evalCtx.sideEffects.lastEvaluationTreeNode = new EvaluatedUnaryOperation(this, argNode, result);
            return result;
        }
        else {
            // we are not building an evaluation tree, simple call
            return this.operator.operation(evalCtx, this, this.arg.evaluate(evalCtx));
        }
    }
}
//# sourceMappingURL=unary-operation.js.map