import { Evaluable, EvaluableSource, KodeValue } from "../base.js";
/**
 * A formula consists of several evaluables. The values of the evaluables are concatenated to form the formula result.
 */
export class Formula extends Evaluable {
    constructor(evaluables) {
        super(EvaluableSource.createByConcatenatingSources(evaluables));
        this.evaluables = [];
        this.evaluables = evaluables;
    }
    evaluate(env) {
        if (this.evaluables.length === 0) {
            // no evaluables in this formula, return empty string.
            return new KodeValue("");
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
            return new KodeValue(output);
        }
    }
}
//# sourceMappingURL=formula.js.map