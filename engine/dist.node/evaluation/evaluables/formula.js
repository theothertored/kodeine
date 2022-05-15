"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formula = void 0;
const kodeine_js_1 = require("../../kodeine.js");
/**
 * A formula consists of several evaluables. The values of the evaluables are concatenated to form the formula result.
 */
class Formula extends kodeine_js_1.Evaluable {
    constructor(evaluables) {
        super(kodeine_js_1.EvaluableSource.createByConcatenatingSources(evaluables));
        this.evaluables = [];
        this.evaluables = evaluables;
    }
    evaluate(evalCtx) {
        let result;
        let parts = [];
        if (this.evaluables.length === 0) {
            // no evaluables in this formula, return empty string.
            result = new kodeine_js_1.KodeValue("", this.source);
        }
        else {
            // mulitple evaluables, evaluate each one and concatenate the results.
            let output = '';
            for (var evaluable of this.evaluables) {
                try {
                    let partResult = evaluable.evaluate(evalCtx);
                    if (evalCtx.buildEvaluationTree) {
                        parts.push(evalCtx.sideEffects.lastEvaluationTreeNode);
                    }
                    output += partResult.toOutputString();
                }
                catch (err) {
                    if (err instanceof kodeine_js_1.EvaluationError) {
                        // add evaluation errors to context
                        evalCtx.sideEffects.errors.push(err);
                    }
                    else {
                        // rethrow all other errors (crashes)
                        throw err;
                    }
                }
            }
            result = new kodeine_js_1.KodeValue(output, this.source);
        }
        if (evalCtx.buildEvaluationTree) {
            evalCtx.sideEffects.lastEvaluationTreeNode = new kodeine_js_1.FormulaEvaluationTree(this, parts, result);
        }
        return result;
    }
}
exports.Formula = Formula;
//# sourceMappingURL=formula.js.map