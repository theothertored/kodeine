"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcFunction = void 0;
const evaluation_context_js_1 = require("../../evaluables/evaluation-context.js");
const errors_js_1 = require("../../errors.js");
const number_to_text_converter_js_1 = require("../helpers/number-to-text-converter.js");
const text_capitalizer_js_1 = require("../helpers/text-capitalizer.js");
const kode_function_with_modes_js_1 = require("./kode-function-with-modes.js");
/** Implementation of Kustom's tc() (text converter) function. */
class TcFunction extends kode_function_with_modes_js_1.FunctionWithModes {
    getName() { return 'tc'; }
    /** Shared part of implementation for tc(cut) and tc(ell). */
    static _cut(text, startOrLength, length) {
        if (length) {
            // two numeric arguments passed
            if (length === 0)
                // length is zero, always return empty string
                return '';
            else if (length > 0)
                // length is positive
                if (startOrLength >= 0)
                    // start and length are positive
                    return text.substring(startOrLength, startOrLength + length);
                else 
                // start is negative, length is positive
                if (length >= Math.abs(startOrLength))
                    // starting 3 characters from end and taking >= 3 doesn't work
                    // it proably should but it does not
                    return '';
                else
                    // treat start as index from end, take length characters
                    return text.substring(text.length + startOrLength, length);
            else 
            // length is negative
            if (startOrLength > 0)
                // start is positive, length is negative
                if (length === -1 || Math.abs(length) <= startOrLength)
                    // if length is -1, return empty string (seems unintentional)
                    // if start is 3, length -3, -2 and -1 won't work
                    return '';
                else
                    // if length is less than -1, treat it as index from end but offest by start
                    return text.substring(startOrLength, startOrLength + text.length + length);
            else if (startOrLength === 0)
                // start is 0 and length is negative, treat length as index from end
                // this cannot be merged with the first condition
                // because when start is 0, length = -1 works as expected
                return text.substring(0, text.length + length);
            else
                // start and length are negative, seems to always return empty string
                return '';
        }
        else {
            // one numeric argument passed
            if (startOrLength >= 0)
                // positive or zero, treat as length (get first n characters)
                return text.substring(0, startOrLength);
            else
                // negative, treat as count from end
                return text.substring(text.length + startOrLength);
        }
    }
    constructor() {
        super();
        this.mode('low', ['txt text'], function (text) {
            return text.toLowerCase();
        });
        this.mode('up', ['txt text'], function (text) {
            return text.toUpperCase();
        });
        this.mode('cap', ['txt text'], function (text) {
            if (text === '') {
                this.evalCtx.sideEffects.warnings.push(new evaluation_context_js_1.EvaluationWarning(this.call, 'Kustom will throw "string index out of range: 1" when attempting to capitalize an empty string. This does not seem to affect function evaluation.'));
            }
            // kustom only capitalizes letters at the start of the string and after spaces
            // more about this in TextCapitalizer
            return text_capitalizer_js_1.TextCapitalizer.capitalize(text);
        });
        this.mode('cut', ['txt text', 'num startOrLength', 'num length?'], function (text, startOrLength, length) {
            // call shared implementation
            return TcFunction._cut(text, startOrLength, length);
        });
        this.mode('ell', ['txt text', 'num startOrLength', 'num length?'], function (text, startOrLength, length) {
            // call shared implementation
            let output = TcFunction._cut(text, startOrLength, length);
            if (output != '' && output.length < text.length)
                // the output was shortened and it isn't an empty string, add ellipsis
                return output + '...';
            else
                // otherwise, return the output untouched
                return output;
        });
        this.mode('count', ['txt text', 'txt searchFor'], function (text, searchFor) {
            let count = 0;
            // go through every character (there is probably a way to optimize this)
            for (let i = 0; i < text.length - searchFor.length + 1; i++) {
                // check if first character matches before checking entire substring, small optimization
                if (text[i] == searchFor[0] && text.substring(i, i + searchFor.length) == searchFor) {
                    count++;
                    // move to after the current match:
                    // tc(count, aaaa, aa) returns 2, not 3
                    i += searchFor.length - 1;
                }
            }
            return count;
        });
        this.mode('utf', ['txt hexCode'], function (hexCode) {
            // parse the code as a hex number
            let parsedCode = Number('0x' + hexCode);
            if (isNaN(parsedCode)) {
                // given code is not a hex number
                throw new errors_js_1.InvalidArgumentError(`tc(utf)`, 'hexCode', 1, this.call.args[1], hexCode, 'Value could not be parsed as a hexadecimal number.');
            }
            else {
                try {
                    // try to get a character using the code
                    return String.fromCodePoint(parsedCode);
                }
                catch (err) {
                    // couldn't get character using code, throw
                    throw new errors_js_1.InvalidArgumentError(`tc(utf)`, 'hexCode', 1, this.call.args[1], hexCode, 'Value is not a valid character code: ' + err.message);
                }
            }
        });
        this.mode('len', ['txt text'], function (text) {
            return text.length;
        });
        this.mode('n2w', ['txt text'], function (text) {
            // capture numbers with -, because negative numbers throw when their absolute value is over maximum
            // positive numbers over the maximum return the maximum, but in words
            let expr = /-?\d+/g;
            return text.replace(expr, match => {
                let num = Number(match);
                if (-num > number_to_text_converter_js_1.NumberToTextConverter.max) {
                    throw new errors_js_1.InvalidArgumentError('tc(n2w)', 'text', 1, this.call.args[1], match, `Negative numbers throw an error when their absolute value is over the max value for a signed 32 bit int (${number_to_text_converter_js_1.NumberToTextConverter.max}).`);
                }
                return (num < 0 ? '-' : '') + number_to_text_converter_js_1.NumberToTextConverter.convert(Math.min(Math.abs(num), number_to_text_converter_js_1.NumberToTextConverter.max));
            });
        });
    }
}
exports.TcFunction = TcFunction;
//# sourceMappingURL=tc-function.js.map