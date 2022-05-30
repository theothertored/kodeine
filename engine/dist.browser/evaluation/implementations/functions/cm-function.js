import { KodeValue, IKodeFunction, InvalidArgumentCountError, InvalidArgumentError } from "../../../kodeine.js";
import { ArgbColor } from "../helpers/argb-color.js";
import { clamp } from "../helpers/utils.js";
/** Implementation of Kustom's cm() (color maker) function. */
export class CmFunction extends IKodeFunction {
    getName() { return 'cm'; }
    call(evalCtx, call, args) {
        // valid calls:
        // num r, num g, num b                                  constructs an ARGB color from given RGB values
        // num a, num r, num g, num b                           constructs an ARGB color from given ARGB values
        // num a, num rOrH, num gOrH, num bOrH, txt mode        constructs an ARGB color from given ARGB or AHSV values, depending on the mode (h for HSV, anything else for RGB)
        /** Helper function to check if the argument at given {@link index} is numeric, and, if it is, prepare it for use. */
        const checkNumeric = (index, argNames, max = 255) => {
            if (args[index].isNumeric)
                return clamp(Math.round(args[index].numericValue), 0, max);
            else
                throw new InvalidArgumentError('cm()', argNames[index], index, call.args[index], args[index], 'Argument must be numeric.');
        };
        /** The constructed color. */
        let color;
        if (args.length < 3) {
            throw new InvalidArgumentCountError(call, 'Expected at least 3 arguments.');
        }
        else if (args.length > 5) {
            throw new InvalidArgumentCountError(call, 'Expected at most 5 arguments.');
        }
        else if (args.length === 3) {
            // 3 arguments - construct color from RGB values
            const argNames = ['r', 'g', 'b'];
            color = new ArgbColor(255, checkNumeric(0, argNames), checkNumeric(1, argNames), checkNumeric(2, argNames));
        }
        else if (args.length === 4 || args[4].text !== 'h') {
            // 4 arguments or 5 arguments AND mode is not h - construct color from ARGB values
            const argNames = ['a', 'r', 'g', 'b'];
            color = new ArgbColor(checkNumeric(0, argNames), checkNumeric(1, argNames), checkNumeric(2, argNames), checkNumeric(3, argNames));
        }
        else {
            // 5 arguments AND mode is h - construct color from AHSV values
            let argNames = ['a', 'h', 's', 'v'];
            color = ArgbColor.fromAHSV(checkNumeric(0, argNames), checkNumeric(1, argNames), checkNumeric(2, argNames, 100) / 100, checkNumeric(3, argNames, 100) / 100);
        }
        // return the constructed color
        return new KodeValue(color.toARGBString(), call.source);
    }
}
//# sourceMappingURL=cm-function.js.map