"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formula = void 0;
const base_js_1 = require("../base.js");
/**
 * A formula consists of several evaluables. The values of the evaluables are concatenated to form the formula result.
 */
class Formula extends base_js_1.Evaluable {
    constructor(evaluables) {
        super(base_js_1.EvaluableSource.createByConcatenatingSources(evaluables));
        this.evaluables = [];
        this.evaluables = evaluables;
    }
    evaluate(env) {
        if (this.evaluables.length === 0) {
            // no evaluables in this formula, return empty string.
            return new base_js_1.KodeValue("");
        }
        else if (this.evaluables.length === 1) {
            // there is only one evaluable, evaluate it and return the result.
            return this.evaluables[0].evaluate(env);
        }
        else {
            // mulitple evaluables, evaluate each one and concatenate the results.
            let output = '';
            for (var evaluable of this.evaluables) {
                output += evaluable.evaluate(env).text;
            }
            return new base_js_1.KodeValue(output);
        }
    }
}
exports.Formula = Formula;
//# sourceMappingURL=formula.js.map