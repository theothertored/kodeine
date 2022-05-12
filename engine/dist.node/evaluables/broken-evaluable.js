"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrokenEvaluable = void 0;
const base_1 = require("../base");
const evaluation_tree_1 = require("./evaluation-tree");
class BrokenEvaluable extends base_1.Evaluable {
    constructor(source) {
        super(source);
    }
    evaluate(evalCtx) {
        let result = new base_1.KodeValue('', this.source);
        if (evalCtx.buildEvaluationTree) {
            evalCtx.sideEffects.lastEvaluationTreeNode = new evaluation_tree_1.CouldNotBeEvaluated(result);
        }
        return result;
    }
}
exports.BrokenEvaluable = BrokenEvaluable;
//# sourceMappingURL=broken-evaluable.js.map