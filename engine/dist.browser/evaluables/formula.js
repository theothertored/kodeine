import { Evaluable, EvaluableSource, KodeValue } from "../base.js";
import { EvaluationError } from "../errors.js";
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
        if (this.evaluables.length === 0) {
            // no evaluables in this formula, return empty string.
            return new KodeValue("");
        }
        else if (this.evaluables.length === 1) {
            try {
                // there is only one evaluable, evaluate it and return the result.
                return this.evaluables[0].evaluate(evalCtx);
            }
            catch (err) {
                if (err instanceof EvaluationError) {
                    // add evaluation errors to context
                    evalCtx.sideEffects.errors.push(err);
                    return new KodeValue('', this.evaluables[0].source);
                }
                else {
                    // rethrow all other errors (crashes)
                    throw err;
                }
            }
        }
        else {
            // mulitple evaluables, evaluate each one and concatenate the results.
            let output = '';
            for (var evaluable of this.evaluables) {
                try {
                    output += evaluable.evaluate(evalCtx).text;
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
            return new KodeValue(output);
        }
    }
}
//# sourceMappingURL=formula.js.map