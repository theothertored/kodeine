import { Evaluable, EvaluableSource, EvaluationContext, KodeValue } from "../../kodeine.js";
export declare class BrokenEvaluable extends Evaluable {
    constructor(source?: EvaluableSource);
    evaluate(evalCtx: EvaluationContext): KodeValue;
}
