"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LvFunction = void 0;
const kodeine_js_1 = require("../../../kodeine.js");
/** Implementation of Kustom's `lv()` function. */
class LvFunction extends kodeine_js_1.IKodeFunction {
    getName() { return 'lv'; }
    call(evalCtx, call, args) {
        if (args.length < 1) {
            // disallow no argument calls
            throw new kodeine_js_1.InvalidArgumentCountError(call, 'At least one argument required.');
        }
        else if (args.length === 1) {
            // 1 argument - get mode, return value of local variable or empty string
            let value = evalCtx.sideEffects.localVariables.get(args[0].text);
            if (!value) {
                evalCtx.sideEffects.warnings.push(new kodeine_js_1.EvaluationWarning(call, `Local variable "${args[0].text}" not found.`));
            }
            return new kodeine_js_1.KodeValue(value || '', call.source);
        }
        else if (args.length === 2) {
            // 2 arguments - set variable and return empty string
            evalCtx.sideEffects.localVariables.set(args[0].text, args[1]);
            return new kodeine_js_1.KodeValue('', call.source);
        }
        else {
            // too many arguments
            throw new kodeine_js_1.InvalidArgumentCountError(call, 'Expected at most two arguments.');
        }
    }
}
exports.LvFunction = LvFunction;
//# sourceMappingURL=lv-function.js.map