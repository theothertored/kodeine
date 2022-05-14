"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DfFunction = void 0;
const kodeine_js_1 = require("../../../kodeine.js");
class DfFunction extends kodeine_js_1.IKodeFunction {
    getName() { return 'df'; }
    call(evalCtx, call, args) {
        throw new kodeine_js_1.EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}
exports.DfFunction = DfFunction;
//# sourceMappingURL=df-function.js.map