import { EvaluationWarning } from "../../evaluables/evaluation-context.js";
import { InvalidArgumentError, RegexEvaluationError } from "../../errors.js";
import { NumberToTextConverter } from "../helpers/number-to-text-converter.js";
import { TextCapitalizer } from "../helpers/text-capitalizer.js";
import { FunctionWithModes as KodeFunctionWithModes } from "./kode-function-with-modes.js";
import { OrdinalSuffixHelper } from "../helpers/ordinal-suffix-helper.js";
import { NumberToRomanConverter } from "../helpers/number-to-roman-converter.js";
import { HtmlEntityConverter } from "../helpers/html-entitity-converter.js";
/** Implementation of Kustom's tc() (text converter) function. */
export class TcFunction extends KodeFunctionWithModes {
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
                this.evalCtx.sideEffects.warnings.push(new EvaluationWarning(this.call.args[1], 'Kustom will throw "string index out of range: 1" when attempting to capitalize an empty string. This does not seem to affect function evaluation.'));
            }
            // kustom only capitalizes letters at the start of the string and after spaces
            // more about this in TextCapitalizer
            return TextCapitalizer.capitalize(text);
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
                throw new InvalidArgumentError(`tc(utf)`, 'hexCode', 1, this.call.args[1], hexCode, 'Value could not be parsed as a hexadecimal number.');
            }
            else {
                try {
                    // try to get a character using the code
                    return String.fromCodePoint(parsedCode);
                }
                catch (err) {
                    // couldn't get character using code, throw
                    throw new InvalidArgumentError(`tc(utf)`, 'hexCode', 1, this.call.args[1], hexCode, 'Value is not a valid character code: ' + err.message);
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
            // replace each number occurence
            return text.replace(expr, match => {
                // parse as number (should never be an invalid number if it matches the pattern)
                let num = Number(match);
                if (isNaN(num)) {
                    // if the number somehow is invalid, add a warning and don't replace
                    this.evalCtx.sideEffects.warnings.push(new EvaluationWarning(this.call.args[1], `Number ${match} could not be parsed.`));
                    return match;
                }
                else {
                    if (-num > NumberToTextConverter.max) {
                        // special case for negative numbers that have an absolute value over the maximum
                        // this does not happen for positive numbers, instead, the max as words is returned
                        throw new InvalidArgumentError('tc(n2w)', 'text', 1, this.call.args[1], match, `Negative numbers throw an error when their absolute value is greater than the max value for a signed 32 bit integer (${NumberToTextConverter.max}).`);
                    }
                    // convert and prepend a - if the input was negative
                    return (num < 0 ? '-' : '') + NumberToTextConverter.convert(Math.min(Math.abs(num), NumberToTextConverter.max));
                }
            });
        });
        this.mode('ord', ['num number'], function (number) {
            // this function breaks in kustom when the number is in input format "1.0"
            // most commonly happens when the negation operator is used
            // for now not replicating this (I assume) bug
            return OrdinalSuffixHelper.getSuffix(number);
        });
        this.mode('roman', ['txt text'], function (text) {
            // capture copy pasted from tc(n2w), which I assume kustom also does under the hood
            // the problem is using large numbers with this crashes KLWP, so I can't really test it
            let expr = /-?\d+/g;
            // replace each number occurence
            return text.replace(expr, match => {
                // parse as number (should never be an invalid number if it matches the pattern)
                let num = Number(match);
                if (isNaN(num)) {
                    // if the number somehow is invalid, add a warning and don't replace
                    this.evalCtx.sideEffects.warnings.push(new EvaluationWarning(this.call.args[1], `Number ${match} could not be parsed.`));
                    return match;
                }
                else {
                    if (Math.abs(num) > NumberToRomanConverter.max) {
                        // we probably could allow the user to go further,
                        // but not only will this output A LOT of characters,
                        // it will also straight up crash the app at like 7 or 8 digits
                        throw new InvalidArgumentError('tc(roman)', 'text', 1, this.call.args[1], match, `Number ${match} is greater than the maximum for tc(roman) (${NumberToTextConverter.max}). `
                            + 'Each decimal digit you add to your number increases the number of Ms (roman numeral for 1,000) in the output exponentially. '
                            + 'To illustrate, 1,000,000 results in 1,000 Ms, 10,000,000 results in 10,000 Ms and 100,000,000 results in 100,000 Ms. '
                            + 'TL;DR: Kustom will crash.');
                    }
                    // convert and prepend a - if the input was negative
                    return (num < 0 ? '-' : '') + NumberToRomanConverter.convert(Math.abs(num));
                }
            });
        });
        this.mode('lpad', ['txt text', 'num targetLength', 'txt padWith?'], function (text, targetLength, padWith) {
            if (text.length >= targetLength) {
                // text is already long enough
                return text;
            }
            else {
                padWith !== null && padWith !== void 0 ? padWith : (padWith = '0'); // pad with 0 by default
                let fullRepeatCount = Math.floor((targetLength - text.length) / padWith.length);
                let additionalCharCount = targetLength - text.length - fullRepeatCount * padWith.length;
                return padWith.repeat(fullRepeatCount) // full repeats
                    + padWith.substring(0, additionalCharCount) // partial repeat
                    + text; // source text
            }
        });
        this.mode('rpad', ['txt text', 'num targetLength', 'txt padWith?'], function (text, targetLength, padWith) {
            if (text.length >= targetLength) {
                // text is already long enough
                return text;
            }
            else {
                padWith !== null && padWith !== void 0 ? padWith : (padWith = '0'); // pad with 0 by default
                let fullRepeatCount = Math.floor((targetLength - text.length) / padWith.length);
                let additionalCharCount = targetLength - text.length - fullRepeatCount * padWith.length;
                return text // source text
                    + padWith.repeat(fullRepeatCount) // full repeats
                    + padWith.substring(0, additionalCharCount); // partial repeat
            }
        });
        this.mode('split', ['txt text', 'txt splitBy', 'num index'], function (text, splitBy, index) {
            var _a;
            if (index < 0) {
                // kustom throws an error for indices less than 0 but not for indices greater than array length
                this.evalCtx.sideEffects.warnings.push(new EvaluationWarning(this.call.args[3], 'Kustom will throw "length=[split element count]; index=[passed index];" when passing a negative index to tc(split). This does not seem to affect further evaluation. '
                    + 'Note that this does not happen when the passed index is greater than or equal to [split element count].'));
            }
            // kustom skips over empty elements
            // tc(split, aXXb, X, 1) => b instead of ""
            // also normalize undefined to ""
            return (_a = text.split(splitBy).filter(s => s !== '')[index]) !== null && _a !== void 0 ? _a : '';
        });
        this.mode('reg', ['txt text', 'txt pattern', 'txt replacement'], function (text, pattern, replacement) {
            try {
                // create a global (multi-match) pattern from the given string
                let expr = new RegExp(pattern, 'g');
                // the replacement in kustom is far less powerful than in JS
                // pretty much the only thing that works is $0 to insert entire match and $1, $2 etc. to insert matched groups
                // you can escape those $0, $1 etc. tokens with a backslash: \\
                // backslashes are removed from the replacement, unless they are double backslashes
                // \n, \r, \t do not work, the backslash gets removed and the letter gets printed
                // same with $` and $' (before match and after match)
                // JS has $& for inserting entire match, kustom uses $0 instead
                // because of that I decided to manually handle replacing tokens in the replacement string
                let hadErrors = false;
                let result = text.replace(expr, (...sourceMatchArgs) => {
                    let sourceMatchGroupCount = sourceMatchArgs.length - 3;
                    // kustom only supports one digit capture group backreferences
                    // $0, $1 etc. work, $10 is just $1 and character 0
                    // this pattern should probably have \d+ instead of \d
                    return replacement.replace(/(\\*)\$(\d)|(\\+)/g, (groupMatch, backslashes, digit) => {
                        // start by escaping backslashes
                        // if backslashes is undefined, the part after | matched, meaning just backslashes are matched and we can use groupMatch
                        // alternatively, we could accept another argument, but this is more convenient
                        backslashes !== null && backslashes !== void 0 ? backslashes : (backslashes = groupMatch);
                        let outBackslashes = '\\'.repeat(Math.floor((backslashes !== null && backslashes !== void 0 ? backslashes : groupMatch).length / 2));
                        if (backslashes.length % 2 === 0) {
                            // even number of backslashes means they cancel each other out
                            // the $0, $1 etc. token is not escaped and should be replaced
                            // with the contents of its corresponding captured group
                            if (digit) {
                                // captured an unescaped $0, $1 etc. after the backslashes
                                // replace with appropriate capture group contents
                                let groupNumber = Number(digit);
                                if (groupNumber > sourceMatchGroupCount) {
                                    this.evalCtx.sideEffects.warnings.push(new EvaluationWarning(this.call.args[3], 'Replacement contains a reference to a group index that wasn\'t captured '
                                        + `(captured ${sourceMatchGroupCount} group${sourceMatchGroupCount === 1 ? '' : 's'}, `
                                        + `referenced group $${digit}). tc(reg) will return an empty string.`));
                                    hadErrors = true;
                                    return outBackslashes + `$${digit}`;
                                }
                                else {
                                    // argument 0 is conveniently the whole match, so this should simply work
                                    return outBackslashes + sourceMatchArgs[groupNumber];
                                }
                            }
                            else {
                                // did not capture a $0, $1 etc. after the backslashes
                                return outBackslashes;
                            }
                        }
                        else {
                            // odd number of backslashes means they don't cancel each other out
                            if (digit)
                                // the last backslash escapes a $0, $1 etc. token
                                // return backslashes plus the escaped token
                                return outBackslashes + `$${digit}`;
                            else
                                // the last backslash escapes something else, ignore it
                                return outBackslashes;
                        }
                    });
                });
                // if result had errors, return empty string
                // this could be done using throw and catch to cut evaluation short,
                // but it's done using a flag, so that if there are multiple errors,
                // they will all show up as warnings immediately, instead of one after another
                return hadErrors ? '' : result;
            }
            catch (err) {
                throw new RegexEvaluationError(this.call.args[2], err.message);
            }
        });
        this.mode('html', ['txt text'], function (text) {
            this.evalCtx.sideEffects.warnings.push(new EvaluationWarning(this.call, 'tc(html) is not implemented accurately. You might see significant differences when running your formula in Kustom.'));
            // simple implementation that does the basic job
            return text
                // remove <anything> in html brackets
                .replace(/<[^>]+?>/g, '')
                // convert &entities; to string
                .replace(/&.*?;/g, match => HtmlEntityConverter.convert(match));
        });
    }
}
//# sourceMappingURL=tc-function.js.map