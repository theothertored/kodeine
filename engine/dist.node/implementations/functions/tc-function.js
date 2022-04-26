"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcFunction = void 0;
const kode_function_with_modes_js_1 = require("./kode-function-with-modes.js");
class TcFunction extends kode_function_with_modes_js_1.FunctionWithModes {
    getName() { return 'tc'; }
    constructor() {
        super();
        this.mode('cut', ['txt text', 'num startOrLength', 'num length?'], function (text, startOrLength, length) {
            if (length) {
                if (length <= 0)
                    return '';
                else if (startOrLength < 0)
                    return text.substring(text.length + startOrLength, text.length + startOrLength + length);
                else
                    return text.substring(startOrLength, startOrLength + length);
            }
            else if (startOrLength < 0) {
                return text.substring(text.length + startOrLength);
            }
            else {
                return text.substring(0, startOrLength);
            }
        });
        this.mode('low', ['txt text'], function (text) {
            return text.toLowerCase();
        });
    }
}
exports.TcFunction = TcFunction;
//# sourceMappingURL=tc-function.js.map