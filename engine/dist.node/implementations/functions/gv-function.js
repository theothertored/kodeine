"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GvFunction = void 0;
const base_js_1 = require("../../base.js");
const errors_js_1 = require("../../errors.js");
/** Implementation of Kustom's `gv()` function. */
class GvFunction extends base_js_1.IKodeFunction {
    getName() { return 'gv'; }
    call(evalCtx, call, args) {
        // require at least two arguments (one condition and one value)
        if (args.length < 1)
            throw new errors_js_1.InvalidArgumentCountError(call, 'At least one argument required.');
        else if (args.length > 1)
            throw new errors_js_1.InvalidArgumentCountError(call, 'Only one-argument gv() calls are currently implemented.');
        let globalName = args[0].text.trim().toLowerCase();
        if (evalCtx.sideEffects.globalNameStack.indexOf(globalName) >= 0) {
            throw new errors_js_1.EvaluationError(call, `Global reference loop detected. Global stack: ${evalCtx.sideEffects.globalNameStack.join(' > ')}.`);
        }
        else {
            // push global name to stack
            evalCtx.sideEffects.globalNameStack.push(globalName);
            let globalFormula = evalCtx.globals.get(globalName);
            if (globalFormula) {
                // evaluate global formula with the same context
                let globalValue = globalFormula.evaluate(evalCtx);
                // pop the stack to remove the global name we pushed
                evalCtx.sideEffects.globalNameStack.pop();
                // return the value of the global
                return globalValue;
            }
            else {
                // global not found, return empty string
                return new base_js_1.KodeValue('', call.source);
            }
        }
    }
}
exports.GvFunction = GvFunction;
//# sourceMappingURL=gv-function.js.map