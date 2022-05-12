"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrokenEvaluable = void 0;
const kodeine_js_1 = require("../kodeine.js");
class BrokenEvaluable extends kodeine_js_1.Evaluable {
    constructor(source) {
        super(source);
    }
    evaluate(evalCtx) {
        let result = new kodeine_js_1.KodeValue('', this.source);
        if (evalCtx.buildEvaluationTree) {
            evalCtx.sideEffects.lastEvaluationTreeNode = new kodeine_js_1.CouldNotBeEvaluated(result);
        }
        return result;
    }
}
exports.BrokenEvaluable = BrokenEvaluable;
//# sourceMappingURL=broken-evaluable.js.map