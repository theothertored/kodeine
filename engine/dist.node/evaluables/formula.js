"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formula = void 0;
const base_js_1 = require("../base.js");
const errors_js_1 = require("../errors.js");
/**
 * A formula consists of several evaluables. The values of the evaluables are concatenated to form the formula result.
 */
class Formula extends base_js_1.Evaluable {
    constructor(evaluables) {
        super(base_js_1.EvaluableSource.createByConcatenatingSources(evaluables));
        this.evaluables = [];
        this.evaluables = evaluables;
    }
    evaluate(evalCtx) {
        if (this.evaluables.length === 0) {
            // no evaluables in this formula, return empty string.
            return new base_js_1.KodeValue("");
        }
        else if (this.evaluables.length === 1) {
            try {
                // there is only one evaluable, evaluate it and return the result.
                return this.evaluables[0].evaluate(evalCtx);
            }
            catch (err) {
                if (err instanceof errors_js_1.EvaluationError) {
                    // add evaluation errors to context
                    evalCtx.sideEffects.errors.push(err);
                    return new base_js_1.KodeValue('', this.evaluables[0].source);
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
                    if (err instanceof errors_js_1.EvaluationError) {
                        // add evaluation errors to context
                        evalCtx.sideEffects.errors.push(err);
                    }
                    else {
                        // rethrow all other errors (crashes)
                        throw err;
                    }
                }
            }
            return new base_js_1.KodeValue(output);
        }
    }
}
exports.Formula = Formula;
//# sourceMappingURL=formula.js.map