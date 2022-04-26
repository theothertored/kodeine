import { Evaluable, EvaluableSource, KodeValue } from "../base";
import { EvaluationContext } from "./evaluation-context";

export class BrokenEvaluable extends Evaluable {

    constructor(source?: EvaluableSource) {
        super(source);
    }

    evaluate(evalCtx: EvaluationContext): KodeValue {
        return new KodeValue('', this.source);
    }

}