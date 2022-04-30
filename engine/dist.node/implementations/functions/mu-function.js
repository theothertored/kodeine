"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuFunction = void 0;
const errors_js_1 = require("../../errors.js");
const kode_function_with_modes_js_1 = require("./kode-function-with-modes.js");
/** Implementation of Kustom's mu() (math utilities) function. */
class MuFunction extends kode_function_with_modes_js_1.FunctionWithModes {
    getName() { return 'mu'; }
    singleArgMode(name, func) {
        this.mode(name, ['num number'], func);
    }
    constructor() {
        super();
        this.singleArgMode('ceil', Math.ceil);
        this.singleArgMode('floor', Math.floor);
        this.singleArgMode('sqrt', Math.sqrt);
        this.mode('round', ['num number', 'num decimals?'], function (number, decimals) {
            if (decimals === undefined) {
                return Math.round(number);
            }
            else {
                if (decimals < 0) {
                    throw new errors_js_1.InvalidArgumentError('mu(round)', 'decimals', 2, this.call.args[2], decimals, 'The number of decimal places cannot be negative. Kustom will throw "mu: 45".');
                }
                else {
                    let powerOf10 = 10 ** decimals;
                    return Math.round(number * powerOf10) / powerOf10;
                }
            }
        });
        // TODO
        // this.mode('min',
        //     ['num values...'],
        //     function (number: number, decimals?: number) {
        //         return 0;
        //     }
        // );
        // TODO
        // this.mode('max',
        //     ['num values...'],
        //     function (number: number, decimals?: number) {
        //         return 0;
        //     }
        // );
        this.singleArgMode('abs', Math.abs);
        this.singleArgMode('cos', (number) => Math.cos(number / 180 * Math.PI));
        this.singleArgMode('sin', (number) => Math.sin(number / 180 * Math.PI));
        this.singleArgMode('tan', (number) => Math.tan(number / 180 * Math.PI));
        this.singleArgMode('acos', (number) => Math.acos(number) / Math.PI * 180);
        this.singleArgMode('asin', (number) => Math.asin(number) / Math.PI * 180);
        this.singleArgMode('atan', (number) => Math.atan(number) / Math.PI * 180);
        this.singleArgMode('log', Math.log10);
        this.mode('pow', ['num number', 'num exponent'], function (number, exponent) {
            return number ** exponent;
        });
        this.singleArgMode('ln', Math.log);
        this.mode('rnd', ['num min', 'num max'], function (min, max) {
            return min + Math.floor(Math.random() * (max - min + 1));
        });
        this.mode('h2d', ['txt hex'], function (hex) {
            let output = Number('0x' + hex);
            if (isNaN(output)) {
                throw new errors_js_1.InvalidArgumentError('mu(h2d)', 'hex', 1, this.call.args[1], hex, `Value "${hex}" could not be parsed as a hexadecimal number.`);
            }
            else {
                return output;
            }
        });
        this.mode('d2h', ['num number'], function (number) {
            return number.toString(16);
        });
    }
}
exports.MuFunction = MuFunction;
//# sourceMappingURL=mu-function.js.map