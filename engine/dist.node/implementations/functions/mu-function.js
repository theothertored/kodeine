"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuFunction = void 0;
const kodeine_js_1 = require("../../kodeine.js");
/** Implementation of Kustom's mu() (math utilities) function. */
class MuFunction extends kodeine_js_1.KodeFunctionWithModes {
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
                    throw new kodeine_js_1.InvalidArgumentError('mu(round)', 'decimals', 2, this.call.args[2], decimals, 'The number of decimal places cannot be negative. Kustom will throw "mu: 45".');
                }
                else {
                    let powerOf10 = 10 ** decimals;
                    return Math.round(number * powerOf10) / powerOf10;
                }
            }
        });
        this.mode('min', ['num values[2]'], function (values) {
            return Math.min(...values);
        });
        this.mode('max', ['num values[2]'], function (values) {
            return Math.max(...values);
        });
        this.singleArgMode('abs', Math.abs);
        this.singleArgMode('cos', n => Math.cos(n / 180 * Math.PI));
        this.singleArgMode('sin', n => Math.sin(n / 180 * Math.PI));
        this.singleArgMode('tan', n => Math.tan(n / 180 * Math.PI));
        this.singleArgMode('acos', n => Math.acos(n) / Math.PI * 180);
        this.singleArgMode('asin', n => Math.asin(n) / Math.PI * 180);
        this.singleArgMode('atan', n => Math.atan(n) / Math.PI * 180);
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
                throw new kodeine_js_1.InvalidArgumentError('mu(h2d)', 'hex', 1, this.call.args[1], hex, `Value "${hex}" could not be parsed as a hexadecimal number.`);
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