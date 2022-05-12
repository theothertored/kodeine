import { Evaluable, EvaluableSource, KodeValue } from "../base";
import { EvaluationContext } from "./evaluation-context";
import { CouldNotBeEvaluated } from "./evaluation-tree";

export class BrokenEvaluable extends Evaluable {

    constructor(source?: EvaluableSource) {
        super(source);
    }

    evaluate(evalCtx: EvaluationContext): KodeValue {

        let result = new KodeValue('', this.source);

        if (evalCtx.buildEvaluationTree) {

            evalCtx.sideEffects.lastEvaluationTreeNode = new CouldNotBeEvaluated(result);

        }

        return result;
    }

}