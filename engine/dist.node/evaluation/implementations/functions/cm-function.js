"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmFunction = void 0;
const kodeine_js_1 = require("../../../kodeine.js");
const argb_color_js_1 = require("../helpers/argb-color.js");
const utils_js_1 = require("../helpers/utils.js");
/** Implementation of Kustom's cm() (color maker) function. */
class CmFunction extends kodeine_js_1.IKodeFunction {
    getName() { return 'cm'; }
    call(evalCtx, call, args) {
        // valid calls:
        // num r, num g, num b                                  constructs an ARGB color from given RGB values
        // num a, num r, num g, num b                           constructs an ARGB color from given ARGB values
        // num a, num rOrH, num gOrH, num bOrH, txt mode        constructs an ARGB color from given ARGB or AHSV values, depending on the mode (h for HSV, anything else for RGB)
        /** Helper function to check if the argument at given {@link index} is numeric, and, if it is, prepare it for use. */
        const checkNumeric = (index, argNames, max = 255) => {
            if (args[index].isNumeric)
                return (0, utils_js_1.clamp)(Math.round(args[index].numericValue), 0, max);
            else
                throw new kodeine_js_1.InvalidArgumentError('cm()', argNames[index], index, call.args[index], args[index], 'Argument must be numeric.');
        };
        /** The constructed color. */
        let color;
        if (args.length < 3) {
            throw new kodeine_js_1.InvalidArgumentCountError(call, 'Expected at least 3 arguments.');
        }
        else if (args.length > 5) {
            throw new kodeine_js_1.InvalidArgumentCountError(call, 'Expected at most 5 arguments.');
        }
        else if (args.length === 3) {
            // 3 arguments - construct color from RGB values
            const argNames = ['r', 'g', 'b'];
            color = new argb_color_js_1.ArgbColor(255, checkNumeric(0, argNames), checkNumeric(1, argNames), checkNumeric(2, argNames));
        }
        else if (args.length === 4 || args[4].text !== 'h') {
            // 4 arguments or 5 arguments AND mode is not h - construct color from ARGB values
            const argNames = ['a', 'r', 'g', 'b'];
            color = new argb_color_js_1.ArgbColor(checkNumeric(0, argNames), checkNumeric(1, argNames), checkNumeric(2, argNames), checkNumeric(3, argNames));
        }
        else {
            // 5 arguments AND mode is h - construct color from AHSV values
            let argNames = ['a', 'h', 's', 'v'];
            color = argb_color_js_1.ArgbColor.fromAHSV(checkNumeric(0, argNames), checkNumeric(1, argNames), checkNumeric(2, argNames, 100) / 100, checkNumeric(3, argNames, 100) / 100);
        }
        // return the constructed color
        return new kodeine_js_1.KodeValue(color.toARGBString(), call.source);
    }
}
exports.CmFunction = CmFunction;
//# sourceMappingURL=cm-function.js.map