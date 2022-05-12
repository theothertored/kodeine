import { Evaluable, CouldNotBeEvaluated, KodeValue } from "../kodeine.js";
export class BrokenEvaluable extends Evaluable {
    constructor(source) {
        super(source);
    }
    evaluate(evalCtx) {
        let result = new KodeValue('', this.source);
        if (evalCtx.buildEvaluationTree) {
            evalCtx.sideEffects.lastEvaluationTreeNode = new CouldNotBeEvaluated(result);
        }
        return result;
    }
}
//# sourceMappingURL=broken-evaluable.js.map