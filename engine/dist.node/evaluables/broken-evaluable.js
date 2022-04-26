"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrokenEvaluable = void 0;
const base_1 = require("../base");
class BrokenEvaluable extends base_1.Evaluable {
    constructor(source) {
        super(source);
    }
    evaluate(evalCtx) {
        return new base_1.KodeValue('', this.source);
    }
}
exports.BrokenEvaluable = BrokenEvaluable;
//# sourceMappingURL=broken-evaluable.js.map