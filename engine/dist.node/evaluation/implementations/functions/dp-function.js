"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DpFunction = void 0;
const kodeine_js_1 = require("../../../kodeine.js");
const kustom_date_helper_js_1 = require("../helpers/kustom-date-helper.js");
/** Implementation of Kustom's dp() (date parser) function. */
class DpFunction extends kodeine_js_1.IKodeFunction {
    getName() { return 'dp'; }
    call(evalCtx, call, args) {
        if (args.length === 0) {
            // 0 arguments, return current date
            return new kodeine_js_1.KodeValue(evalCtx.getNow(), call.source);
        }
        else if (args.length === 1) {
            // 1 argument, parse it as kustom date string
            return new kodeine_js_1.KodeValue(kustom_date_helper_js_1.KustomDateHelper.parseKustomDateString(evalCtx.getNow(), args[0].text), call.source);
        }
        else {
            // more than 1 argument
            throw new kodeine_js_1.InvalidArgumentCountError(call, 'Expected 0 or 1 arguments.');
        }
    }
}
exports.DpFunction = DpFunction;
//# sourceMappingURL=dp-function.js.map