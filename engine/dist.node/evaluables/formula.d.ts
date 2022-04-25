import { Evaluable, KodeValue } from "../base.js";
import { EvaluationContext } from "./evaluation-context.js";
/**
 * A formula consists of several evaluables. The values of the evaluables are concatenated to form the formula result.
 */
export declare class Formula extends Evaluable {
    readonly evaluables: Evaluable[];
    constructor(evaluables: Evaluable[]);
    evaluate(evalCtx: EvaluationContext): KodeValue;
}
