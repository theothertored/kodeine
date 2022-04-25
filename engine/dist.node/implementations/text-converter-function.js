"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextConverterFunction = void 0;
const kode_function_with_modes_js_1 = require("./kode-function-with-modes.js");
class TextConverterFunction extends kode_function_with_modes_js_1.FunctionWithModes {
    getName() { return 'tc'; }
    constructor() {
        super();
        this.mode('cut', [
            {
                args: ['text', 'num length'],
                func: (text, length) => {
                    return text.substring(0, length);
                }
            },
            {
                args: ['text', 'num start', 'num length'],
                func: (text, start, length) => {
                    return text.substring(start, start + length);
                }
            }
        ]);
        this.mode('low', [
            {
                args: ['text'],
                func: (text) => {
                    return text.toLowerCase();
                }
            }
        ]);
    }
}
exports.TextConverterFunction = TextConverterFunction;
//# sourceMappingURL=text-converter-function.js.map