"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryOperation = void 0;
const kodeine_js_1 = require("../../kodeine.js");
/** An operation consisting of an binary operator and two evaluable arguments. */
class BinaryOperation extends kodeine_js_1.Evaluable {
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
        if (evalCtx.buildEvaluationTree) {
            // we are building an evaluation tree
            let argAResult = this.argA.evaluate(evalCtx);
            let argANode = evalCtx.sideEffects.lastEvaluationTreeNode;
            let argBResult = this.argB.evaluate(evalCtx);
            let argBNode = evalCtx.sideEffects.lastEvaluationTreeNode;
            let result = this.operator.operation(evalCtx, this, argAResult, argBResult);
            evalCtx.sideEffects.lastEvaluationTreeNode = new kodeine_js_1.EvaluatedBinaryOperation(this, argANode, argBNode, result);
            return result;
        }
        else {
            // we are not building an evaluation tree, simple call
            return this.operator.operation(evalCtx, this, this.argA.evaluate(evalCtx), this.argB.evaluate(evalCtx));
        }
    }
}
exports.BinaryOperation = BinaryOperation;
//# sourceMappingURL=binary-operation.js.map