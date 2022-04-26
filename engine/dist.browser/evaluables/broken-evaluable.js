import { Evaluable, KodeValue } from "../base";
export class BrokenEvaluable extends Evaluable {
    constructor(source) {
        super(source);
    }
    evaluate(evalCtx) {
        return new KodeValue('', this.source);
    }
}
//# sourceMappingURL=broken-evaluable.js.map