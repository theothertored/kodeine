import { EvaluationError, Evaluable, EvaluableSource, FormulaEvaluationTree, KodeValue } from "../kodeine.js";
/**
 * A formula consists of several evaluables. The values of the evaluables are concatenated to form the formula result.
 */
export class Formula extends Evaluable {
    constructor(evaluables) {
        super(EvaluableSource.createByConcatenatingSources(evaluables));
        this.evaluables = [];
        this.evaluables = evaluables;
    }
    evaluate(evalCtx) {
        let result;
        let parts = [];
        if (this.evaluables.length === 0) {
            // no evaluables in this formula, return empty string.
            result = new KodeValue("", this.source);
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
                    output += partResult.text;
                }
                catch (err) {
                    if (err instanceof EvaluationError) {
                        // add evaluation errors to context
                        evalCtx.sideEffects.errors.push(err);
                    }
                    else {
                        // rethrow all other errors (crashes)
                        throw err;
                    }
                }
            }
            result = new KodeValue(output, this.source);
        }
        if (evalCtx.buildEvaluationTree) {
            evalCtx.sideEffects.lastEvaluationTreeNode = new FormulaEvaluationTree(parts, result);
        }
        return result;
    }
}
//# sourceMappingURL=formula.js.map