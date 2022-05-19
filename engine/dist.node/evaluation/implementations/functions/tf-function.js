"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TfFunction = void 0;
const kodeine_js_1 = require("../../../kodeine.js");
const kustom_date_helper_js_1 = require("../helpers/kustom-date-helper.js");
const timespan_js_1 = require("../helpers/timespan.js");
class TfFunction extends kodeine_js_1.IKodeFunction {
    getName() { return 'tf'; }
    call(evalCtx, call, args) {
        if (args.length == 0) {
            throw new kodeine_js_1.InvalidArgumentCountError(call, 'At least one argument required.');
        }
        else if (args.length > 2) {
            throw new kodeine_js_1.InvalidArgumentCountError(call, 'Expected one or two arguments.');
        }
        if (args[0].isDate || !args[0].isNumeric) {
            // formatting date
            let date = args[0].isDate ? args[0].dateValue : kustom_date_helper_js_1.KustomDateHelper.parseKustomDateString(evalCtx.getNow(), args[0].text);
            let timespan = new timespan_js_1.TimeSpan(Math.trunc((date.valueOf() - evalCtx.getNow().valueOf()) / 1000));
            if (args.length === 2) {
                // manual format
                let format = args[1].text;
                return new kodeine_js_1.KodeValue(timespan.format(format), call.source);
            }
            else {
                // pretty-print (ex. 2 minutes ago)
                return new kodeine_js_1.KodeValue(timespan.prettyPrintRelative(), call.source);
            }
        }
        else {
            let duration = args[0].numericValue;
            let timespan = new timespan_js_1.TimeSpan(duration);
            if (args.length === 2) {
                // manual format
                let format = args[1].text;
                return new kodeine_js_1.KodeValue(timespan.format(format), call.source);
            }
            else {
                // pretty-print (ex. 2 minutes)
                return new kodeine_js_1.KodeValue(timespan.prettyPrintAbsolute(), call.source);
            }
        }
    }
}
exports.TfFunction = TfFunction;
//# sourceMappingURL=tf-function.js.map