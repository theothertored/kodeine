"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expression = void 0;
const base_js_1 = require("../base.js");
const evaluation_tree_js_1 = require("./evaluation-tree.js");
/**
 * An expression is a set of evaluables and operators.
 * The {@link Expression} class wraps an {@link evaluable}
 * that is the last-in-order operation in the expression,
 * but it also keeps track of the tokens that surround the expression in its {@link source}
 *
 * For example, `(2 + 2 * 2)` would have an addition binary operation as its {@link evaluable}
 * and include the opening and closing parentheses in its source tokens
 * *(then the addition binary operation would have the multiplication binary operation as its right hand side argument)*.
 */
class Expression extends base_js_1.Evaluable {
    /**
     * Constructs an expression from an evaluable and, optionally, a source.
     * @param evaluable The last-in-order operation of this expression, or the only evaluable of this expression.
     * @param source Optionally, a source of this expression.
     */
    constructor(evaluable, source) {
        super(source);
        this.evaluable = evaluable;
    }
    evaluate(evalCtx) {
        let result = this.evaluable.evaluate(evalCtx);
        if (evalCtx.buildEvaluationTree) {
            evalCtx.sideEffects.lastEvaluationTreeNode = new evaluation_tree_js_1.EvaluatedExpression(evalCtx.sideEffects.lastEvaluationTreeNode, result);
        }
        return result;
    }
}
exports.Expression = Expression;
//# sourceMappingURL=expression.js.map