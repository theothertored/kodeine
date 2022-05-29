import { KodeValue, IKodeFunction, InvalidArgumentCountError, InvalidArgumentError } from "../../../kodeine.js";
import { ArgbColor } from "../helpers/argb-color.js";
const clamp = (value, min, max) => value < min ? min : value > max ? max : value;
const simpleModes = {
    invert: color => color.invert(),
    comp: color => color.shiftHue(180),
    contrast: color => color
};
const complexModes = {
    alpha: (color, amountMode, amountValue) => amountMode === 's' ? color.setAlpha(amountValue)
        : amountMode === 'a' ? color.setAlpha(color.a + Math.round(amountValue / 100 * 255))
            : color.setAlpha(color.a - Math.round(amountValue / 100 * 255)),
    sat: (color, amountMode, amountValue) => amountMode === 's' ? color.setSaturation(amountValue / 100)
        : amountMode === 'a' ? color.addSaturation(amountValue / 100)
            : color.addSaturation(-amountValue / 100),
    lum: (color, amountMode, amountValue) => amountMode === 's' ? color.setLuminance(amountValue / 100)
        : amountMode === 'a' ? color.addLuminance(amountValue / 100)
            : color.addLuminance(-amountValue / 100)
};
export class CeFunction extends IKodeFunction {
    getName() { return 'ce'; }
    call(evalCtx, call, args) {
        if (args.length < 2) {
            throw new InvalidArgumentCountError(call, 'Expected at least two arguments.');
        }
        else if (args.length > 3) {
            throw new InvalidArgumentCountError(call, 'Expected at most three arguments.');
        }
        else {
            let color = ArgbColor.parse(args[0].text);
            let mode = args[1].text;
            let simpleModeImplementation = simpleModes[mode];
            if (simpleModeImplementation) {
                return new KodeValue(simpleModeImplementation(color).toARGBString(), call.source);
            }
            else {
                let complexModeImplementation = complexModes[mode];
                if (complexModeImplementation) {
                    if (args.length < 3 || args[2].isNumeric) {
                        return new KodeValue(complexModeImplementation(color, 's', args.length < 3 ? 0 : args[2].numericValue).toARGBString(), call.source);
                    }
                    else {
                        let amountText = args.length < 3 ? '' : args[2].text.trim().toLowerCase();
                        if (/^.-?\d+\.?\d*$|^.-?\.\d+$/.test(amountText)) {
                            let amountMode = amountText[0] === 'a' ? 'a' : amountText[0] === 'r' ? 'r' : 's';
                            let amountValue = Number(amountText.substring(1));
                            if (amountValue < 0)
                                // negative values don't crash but they do nothing
                                return new KodeValue(color.toARGBString(), call.source);
                            else
                                return new KodeValue(complexModeImplementation(color, amountMode, amountValue).toARGBString(), call.source);
                        }
                        else {
                            throw new InvalidArgumentError(`ce(${mode})`, 'amount', 2, call.args[2], args[2], 'The amount should be a number optionally preceded by one letter (a or r).');
                        }
                    }
                }
                else {
                    // mix two colours
                    // kustom actually interprets the mixing amount the same as the amount in other modes
                    let amountValue;
                    if (args.length < 3) {
                        amountValue = 0;
                    }
                    else if (args[2].isNumeric) {
                        amountValue = args[2].numericValue;
                    }
                    else if (/^.-?\d+\.?\d*$|^.-?\.\d+$/.test(args[2].text)) {
                        amountValue = Number(args[2].text.substring(1));
                    }
                    else {
                        throw new InvalidArgumentError(`ce(${mode})`, 'amount', 2, call.args[2], args[2], 'The amount should be a number optionally preceded by one letter (a or r).');
                    }
                    return new KodeValue(ArgbColor.mix(color, ArgbColor.parse(args[1].text), clamp(amountValue, -100, 100) / 100).toARGBString(), call.source);
                }
            }
        }
    }
}
//# sourceMappingURL=ce-function.js.map