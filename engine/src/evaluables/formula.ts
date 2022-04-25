import { Evaluable, EvaluableSource, KodeValue } from "../base.js";
import { EvaluationContext } from "./evaluation-context.js";

/**
 * A formula consists of several evaluables. The values of the evaluables are concatenated to form the formula result.
 */
export class Formula extends Evaluable {

    public readonly evaluables: Evaluable[] = [];

    constructor(evaluables: Evaluable[]) {
        super(EvaluableSource.createByConcatenatingSources(evaluables));
        this.evaluables = evaluables;
    }

    evaluate(evalCtx: EvaluationContext): KodeValue {

        evalCtx.clearSideEffects();

        if (this.evaluables.length === 0) {

            // no evaluables in this formula, return empty string.
            return new KodeValue("");

        } else if (this.evaluables.length === 1) {

            // there is only one evaluable, evaluate it and return the result.
            return this.evaluables[0].evaluate(evalCtx);

        } else {

            // mulitple evaluables, evaluate each one and concatenate the results.
            
            let output = '';

            for (var evaluable of this.evaluables) {
                output += evaluable.evaluate(evalCtx).text;
            }

            return new KodeValue(output);

        }
    }
}