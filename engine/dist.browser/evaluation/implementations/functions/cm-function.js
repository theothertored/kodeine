import { KodeValue, IKodeFunction, InvalidArgumentCountError, InvalidArgumentError } from "../../../kodeine.js";
import { ArgbColor } from "../helpers/argb-color.js";
const clamp = (value, min, max) => value < min ? min : value > max ? max : value;
export class CmFunction extends IKodeFunction {
    getName() { return 'cm'; }
    call(evalCtx, call, args) {
        const checkNumeric = (index, argNames, max = 255) => {
            if (args[index].isNumeric)
                return clamp(Math.round(args[index].numericValue), 0, max);
            else
                throw new InvalidArgumentError('cm()', argNames[index], index, call.args[index], args[index], 'Argument must be numeric.');
        };
        let color;
        if (args.length < 3) {
            throw new InvalidArgumentCountError(call, 'Expected at least 3 arguments.');
        }
        else if (args.length > 5) {
            throw new InvalidArgumentCountError(call, 'Expected at most 5 arguments.');
        }
        else if (args.length === 3) {
            // 3 arguments - create colour from RGB values
            let argNames = ['r', 'g', 'b'];
            color = new ArgbColor(255, checkNumeric(0, argNames), checkNumeric(1, argNames), checkNumeric(2, argNames));
        }
        else if (args.length === 4 || args[4].text !== 'h') {
            // 4 arguments or 5 arguments AND mode is not h - create colour from ARGB values
            let argNames = ['a', 'r', 'g', 'b'];
            color = new ArgbColor(checkNumeric(0, argNames), checkNumeric(1, argNames), checkNumeric(2, argNames), checkNumeric(3, argNames));
        }
        else {
            // 5 arguments AND mode is h - create colour from AHSV values
            let argNames = ['a', 'h', 's', 'v'];
            color = ArgbColor.fromAHSV(checkNumeric(0, argNames), checkNumeric(1, argNames), checkNumeric(2, argNames, 100) / 100, checkNumeric(3, argNames, 100) / 100);
        }
        return new KodeValue(color.toARGBString(), call.source);
    }
}
//# sourceMappingURL=cm-function.js.map