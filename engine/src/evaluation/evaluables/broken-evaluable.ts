import { 
    Evaluable, EvaluableSource,
    EvaluationContext,
    CouldNotBeEvaluated,
    KodeValue
} from "../../kodeine.js";

export class BrokenEvaluable extends Evaluable {

    constructor(source?: EvaluableSource) {
        super(source);
    }

    evaluate(evalCtx: EvaluationContext): KodeValue {

        let result = new KodeValue('', this.source);

        if (evalCtx.buildEvaluationTree) {

            evalCtx.sideEffects.lastEvaluationTreeNode = new CouldNotBeEvaluated(this, result);

        }

        return result;
    }

}