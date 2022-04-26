import { Evaluable, EvaluableSource, KodeValue } from "../base";
import { EvaluationContext } from "./evaluation-context";
export declare class BrokenEvaluable extends Evaluable {
    constructor(source?: EvaluableSource);
    evaluate(evalCtx: EvaluationContext): KodeValue;
}
