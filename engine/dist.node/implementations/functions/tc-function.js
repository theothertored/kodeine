"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcFunction = void 0;
const errors_js_1 = require("../../errors.js");
const kode_function_with_modes_js_1 = require("./kode-function-with-modes.js");
/** Implementation of Kustom's tc() (text converter) function. */
class TcFunction extends kode_function_with_modes_js_1.FunctionWithModes {
    getName() { return 'tc'; }
    _cut(text, startOrLength, length) {
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
        let self = this;
        this.mode('low', ['txt text'], function (text) {
            return text.toLowerCase();
        });
        this.mode('up', ['txt text'], function (text) {
            return text.toUpperCase();
        });
        this.mode('cap', ['txt text'], function (text) {
            // Kustom doesn't capitalize letters after a new line, only after spaces and at the start of the string.
            return text.replace(/(?<=^| )./g, match => match.toUpperCase());
        });
        this.mode('cut', ['txt text', 'num startOrLength', 'num length?'], self._cut);
        this.mode('ell', ['txt text', 'num startOrLength', 'num length?'], function (text, startOrLength, length) {
            let output = self._cut(text, startOrLength, length);
            if (output != '' && output.length < text.length)
                return output + '...';
            else
                return output;
        });
        this.mode('count', ['txt text', 'txt searchFor'], function (text, searchFor) {
            let count = 0;
            for (let i = 0; i < text.length; i++) {
                if (text[i] == searchFor[0] && text.substring(i, i + searchFor.length) == searchFor) {
                    count++;
                    i += searchFor.length - 1;
                }
            }
            return count;
        });
        this.mode('utf', ['txt hexCode'], function (hexCode) {
            let parsedCode = Number('0x' + hexCode);
            if (isNaN(parsedCode)) {
                throw new errors_js_1.InvalidArgumentError(`tc(utf)`, 'hexCode', 1, this.call.args[1], hexCode, 'Value could not be parsed as a hexadecimal number.');
            }
            else {
                try {
                    let b = String.fromCodePoint(parsedCode);
                    return b;
                }
                catch (err) {
                    throw new errors_js_1.InvalidArgumentError(`tc(utf)`, 'hexCode', 1, this.call.args[1], hexCode, 'Value is not a valid character code.');
                }
            }
        });
        this.mode('len', ['txt text'], function (text) {
            return text.length;
        });
        this.mode('n2w', ['txt text'], function (text) {
            const million = 1000000;
            const billion = 1000000000;
            const zeroToNineteen = [
                'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
                'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
            ];
            const tens = ['zero', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
            // converts numbers between 0 and 19
            const convertUnder20 = (n) => {
                return zeroToNineteen[n];
            };
            // converts numbers between 0 and 100
            const convertUnderHundred = (n) => {
                if (n < 20) {
                    return convertUnder20(n);
                }
                else {
                    let tenCount = Math.floor(n / 10);
                    let output = tens[tenCount];
                    let rest = n % 10;
                    if (rest > 0) {
                        return `${output} ${convertUnder20(rest)}`;
                    }
                    else {
                        return output;
                    }
                }
            };
            // converts numbers between 0 and 999
            const convertUnderThousand = (n) => {
                if (n < 100) {
                    return convertUnderHundred(n);
                }
                else {
                    let hundredCount = Math.floor(n / 100);
                    let output = convertUnder20(hundredCount);
                    let rest = n % 100;
                    if (rest > 0)
                        return `${output} hundred ${convertUnderHundred(rest)}`;
                    else
                        return output;
                }
            };
            // converts numbers between 0 and 999,999
            const convertUnderMillion = (n) => {
                if (n < 1000) {
                    return convertUnderThousand(n);
                }
                else {
                    let thousandCount = Math.floor(n / 1000);
                    let output = convertUnderThousand(thousandCount);
                    let rest = n % 1000;
                    if (rest > 0)
                        return `${output} thousand ${convertUnderThousand(rest)}`;
                    else
                        return output;
                }
            };
            // converts numbers between 0 and 999,999,999
            const convertUnderBillion = (n) => {
                if (n < million) {
                    return convertUnderMillion(n);
                }
                else {
                    let millionCount = Math.floor(n / million);
                    let output = convertUnderThousand(millionCount);
                    let rest = n % million;
                    if (rest > 0)
                        return `${output} million ${convertUnderMillion(rest)}`;
                    else
                        return `${output} million`;
                }
            };
            // converts numbers between 0 and 2,147,483,647
            const convert = (n) => {
                if (n < billion) {
                    return convertUnderBillion(n);
                }
                else {
                    let billionCount = Math.floor(n / billion);
                    // billion count can be at most 2
                    let output = convertUnder20(billionCount);
                    let rest = n % billion;
                    if (rest > 0)
                        return `${output} billion ${convertUnderBillion(rest)}`;
                    else
                        return `${output} billion`;
                }
            };
            let expr = /-?\d+/g;
            return text.replace(expr, match => {
                const max = 2 ** 31 - 1;
                let num = Number(match);
                if (-num > max) {
                    throw new errors_js_1.InvalidArgumentError('tc(n2w)', 'text', 1, this.call.args[1], match, `Negative numbers throw an error when their absolute value is over the max value for a signed 32 bit int (${max}).`);
                }
                return convert(Math.min(Math.abs(num), max));
            });
        });
    }
}
exports.TcFunction = TcFunction;
//# sourceMappingURL=tc-function.js.map