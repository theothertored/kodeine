"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmFunction = void 0;
const kodeine_js_1 = require("../../../kodeine.js");
const argb_color_js_1 = require("../helpers/argb-color.js");
const clamp = (value, min, max) => value < min ? min : value > max ? max : value;
class CmFunction extends kodeine_js_1.IKodeFunction {
    getName() { return 'cm'; }
    call(evalCtx, call, args) {
        const checkNumeric = (index, argNames, max = 255) => {
            if (args[index].isNumeric)
                return clamp(Math.round(args[index].numericValue), 0, max);
            else
                throw new kodeine_js_1.InvalidArgumentError('cm()', argNames[index], index, call.args[index], args[index], 'Argument must be numeric.');
        };
        let color;
        if (args.length < 3) {
            throw new kodeine_js_1.InvalidArgumentCountError(call, 'Expected at least 3 arguments.');
        }
        else if (args.length > 5) {
            throw new kodeine_js_1.InvalidArgumentCountError(call, 'Expected at most 5 arguments.');
        }
        else if (args.length === 3) {
            // 3 arguments - create colour from RGB values
            let argNames = ['r', 'g', 'b'];
            color = new argb_color_js_1.ArgbColor(255, checkNumeric(0, argNames), checkNumeric(1, argNames), checkNumeric(2, argNames));
        }
        else if (args.length === 4 || args[4].text !== 'h') {
            // 4 arguments or 5 arguments AND mode is not h - create colour from ARGB values
            let argNames = ['a', 'r', 'g', 'b'];
            color = new argb_color_js_1.ArgbColor(checkNumeric(0, argNames), checkNumeric(1, argNames), checkNumeric(2, argNames), checkNumeric(3, argNames));
        }
        else {
            // 5 arguments AND mode is h - create colour from AHSV values
            let argNames = ['a', 'h', 's', 'v'];
            color = argb_color_js_1.ArgbColor.fromAHSV(checkNumeric(0, argNames), checkNumeric(1, argNames), checkNumeric(2, argNames, 100) / 100, checkNumeric(3, argNames, 100) / 100);
        }
        return new kodeine_js_1.KodeValue(color.toARGBString(), call.source);
    }
}
exports.CmFunction = CmFunction;
//# sourceMappingURL=cm-function.js.map