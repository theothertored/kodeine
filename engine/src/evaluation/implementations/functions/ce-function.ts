import {
    KodeValue,
    IKodeFunction,
    EvaluationError,
    EvaluationContext,
    FunctionCall,
    InvalidArgumentCountError,
    InvalidArgumentError
} from "../../../kodeine.js";
import { ArgbColor } from "../helpers/argb-color.js";
import { clamp } from "../helpers/utils.js";

/** An object containing implementations of all simple `ce()` modes. */
const simpleModes: Record<string, (color: ArgbColor) => ArgbColor> = {

    invert: color => color.invertRGB(),

    comp: color => color.shiftHue(180),

    contrast: color => {

        const threshold = 149;
        // calculate fast perceived luminance
        const lum = (0.299 * color.r + 0.587 * color.g + 0.114 * color.b);

        if (lum <= threshold)
            // color is considered dark, return white
            return new ArgbColor(255, 255, 255, 255);
        else
            // color is considered light, return black
            return new ArgbColor(255, 0, 0, 0);

    }
};

/** Possible modes for the amount argument for `ce()` complex modes.  
 * `s` = set, `a` = add, `r` = remove. */
type AmountMode = 's' | 'a' | 'r';

/** An object containing implementations of all complex `ce()` modes (ie. modes taking an additional amount argument). */
const complexModes: Record<string, (color: ArgbColor, amountMode: AmountMode, amountValue: number) => ArgbColor> = {

    alpha: (color, amountMode, amountValue) =>
        amountMode === 's' ? color.setAlpha(amountValue)
            : amountMode === 'a' ? color.setAlpha(color.a + Math.round(amountValue / 100 * 255))
                : color.setAlpha(color.a - Math.round(amountValue / 100 * 255)),

    sat: (color, amountMode, amountValue) =>
        amountMode === 's' ? color.setSaturation(amountValue / 100)
            : amountMode === 'a' ? color.addSaturation(amountValue / 100)
                : color.addSaturation(-amountValue / 100),

    lum: (color, amountMode, amountValue) =>
        amountMode === 's' ? color.setLuminance(amountValue / 100)
            : amountMode === 'a' ? color.addLuminance(amountValue / 100)
                : color.addLuminance(-amountValue / 100)
};

/** Implementation of Kustom's ce() (color editor) function. */
export class CeFunction extends IKodeFunction {

    getName() { return 'ce'; }

    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {

        // valid calls:
        // txt color, txt mode                      simple mode
        // txt color, txt mode, any amount          complex mode - amount can be a number or a number with a mode (ex. 30, a50, r20)
        // txt color1, txt color2, num percentage   linearly interpolate between two given colors

        if (args.length < 2) {

            throw new InvalidArgumentCountError(call, 'Expected at least two arguments.');

        } else if (args.length > 3) {

            throw new InvalidArgumentCountError(call, 'Expected at most three arguments.');

        } else {

            // got 2 or 3 arguments
            // the first argument is always interpreted as a color, if it can't be parsed, the default is transparent black (#00000000)
            let color = ArgbColor.parse(args[0].text);
            let mode = args[1].text;

            // try to get a simple mode implementation
            let simpleModeImplementation = simpleModes[mode];

            if (simpleModeImplementation) {

                // simple mode implementation found, run it ignoring the 3rd argument
                return new KodeValue(simpleModeImplementation(color).toARGBString(), call.source);

            } else {

                // no simple mode implementation found, try to get a complex more implementation
                let complexModeImplementation = complexModes[mode];

                if (complexModeImplementation) {

                    // complex mode implementation found

                    if (args.length < 3 || args[2].isNumeric) {

                        // amount argument was not given or was given and is numeric
                        // TODO: find out what happens when the 3rd argument is not given
                        return new KodeValue(complexModeImplementation(color, 's', args.length < 3 ? 0 : args[2].numericValue).toARGBString(), call.source);

                    } else {

                        // amount argument was given and is not numeric

                        let amountText = args.length < 3 ? '' : args[2].text.trim().toLowerCase();

                        // check if amount argument text is a number prefixed with one letter (number can be negative or a float)
                        if (/^.-?\d+\.?\d*$|^.-?\.\d+$/.test(amountText)) {

                            // amount argument text is a number prefixed with a letter
                            // any letter other than a or r is treated as set mode
                            let amountMode: AmountMode = amountText[0] === 'a' ? 'a' : amountText[0] === 'r' ? 'r' : 's';

                            // parse the rest of the string as a number, ignore decimal places
                            let amountValue = Math.trunc(Number(amountText.substring(1)));

                            if (amountValue < 0)
                                // negative values don't crash but they do nothing
                                return new KodeValue(color.toARGBString(), call.source);
                            else
                                // run the complex mode implementation with given color, amount mode and amount
                                return new KodeValue(complexModeImplementation(color, amountMode, amountValue).toARGBString(), call.source);

                        } else {

                            // invalid amount format
                            throw new InvalidArgumentError(`ce(${mode})`, 'amount', 2, call.args[2], args[2], 'The amount should be a number optionally preceded by one letter (a or r).');

                        }

                    }

                } else {

                    // linearly interpolate between two colors
                    // kustom actually interprets the mixing amount the same as the amount in other modes

                    let percentageValue: number;

                    if (args.length < 3) {

                        // if the amount was not given, default to 0
                        percentageValue = 0;

                    } else if (args[2].isNumeric) {

                        // the percentage is numeric (good)
                        percentageValue = args[2].numericValue;

                    } else if (/^.-?\d+\.?\d*$|^.-?\.\d+$/.test(args[2].text)) {

                        // percentage argument matches the amount format, ignore the mode but take the value
                        percentageValue = Number(args[2].text.substring(1));

                    } else {

                        // percentage argument does not match the amount format
                        throw new InvalidArgumentError(`ce(${mode})`, 'amount', 2, call.args[2], args[2], 'The amount should be a number optionally preceded by one letter (a or r).');

                    }

                    // lineraly interpolate between given colors
                    return new KodeValue(ArgbColor.lerp(color, ArgbColor.parse(args[1].text), clamp(percentageValue, -100, 100) / 100).toARGBString(), call.source);

                }

            }

        }

    }

}