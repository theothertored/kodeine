"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DfFunction = void 0;
const kodeine_js_1 = require("../../../kodeine.js");
const kustom_date_helper_js_1 = require("../helpers/kustom-date-helper.js");
const number_to_text_converter_js_1 = require("../helpers/number-to-text-converter.js");
const text_capitalizer_js_1 = require("../helpers/text-capitalizer.js");
const utils_js_1 = require("../helpers/utils.js");
/**
 * An array containing full names for days of the week.
 * `0 = Monday, 1 = Tuesday, ..., 6 = Sunday`
 */
const weekdaysFull = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
/**
 * An array containing abbreviated names for days of the week.
 * `0 = Mon, 1 = Tue, ..., 6 = Sun`
 */
const weekdaysAbbrev = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
/**
 * An array containing full names for months.
 * `0 = January, 1 = February, ..., 11 = December`
 */
const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/**
 * An array containing abbreviated names for months.
 * `0 = Jan, 1 = Feb, ..., 11 = Dec`
 */
const monthsAbbrev = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/**
 * The core function for `df()`, extracted outside of the call so it is only initialized once.
 * TODO: Also extract simple and multi token implementations like this.
 */
function format(date, format, simpleTokens, multiTokens) {
    let output = '';
    // a simple local string reader implementation
    let i = 0;
    let consume = () => format[i++];
    let peek = () => format[i];
    let eof = () => i >= format.length;
    // go until the entire format string is consumed
    while (!eof()) {
        // consume a character
        let char = consume();
        if (char === '\'') {
            // everything insde singlequotes is taken literally (without token replacement)
            if (eof()) {
                // singlequote at the end of the string, we're done - exit loop
                break;
            }
            else {
                // there is at least one character after the singlequote
                let nextChar = consume();
                if (nextChar === '\'') {
                    // two singlequotes one after another, treat as escaped singlequote, add to output
                    output += '\'';
                }
                else {
                    // next char is not an singlequote
                    output += nextChar;
                    // read chars until an singlequote is encountered or the format string ends
                    while (!eof() && peek() !== '\'') {
                        output += consume(); // read char into output
                    }
                    if (!eof()) {
                        // consume ending '
                        consume();
                    }
                }
            }
        }
        else {
            // we are not inside singlequotes
            // check if current character is a simple token
            let simpleFunc = simpleTokens[char];
            if (simpleFunc) {
                // current character is a simple token, add simple token result to output
                output += simpleFunc(date);
            }
            else {
                // current character is not a simple token, check if it is a multitoken
                let mutliFunc = multiTokens[char];
                if (mutliFunc) {
                    // current character is a multitoken, read all identical character into the buffer
                    let buffer = char;
                    while (!eof() && peek() === char) {
                        buffer += consume();
                    }
                    // we have the entire multitoken block, add multitoken result to output
                    output += mutliFunc(date, buffer);
                }
                else {
                    // character is not a token, add it to output as plain text
                    output += char;
                }
            }
        }
    }
    return output;
}
;
/** Implementation of Kustom's df() (date format) function. */
class DfFunction extends kodeine_js_1.IKodeFunction {
    getName() { return 'df'; }
    call(evalCtx, call, args) {
        // valid calls:
        // txt format               prints current date according to the given format string
        // txt format, any date     prints given date according to the given format string
        if (args.length === 0) {
            throw new kodeine_js_1.InvalidArgumentCountError(call, 'At least one argument required.');
        }
        else if (args.length > 2) {
            throw new kodeine_js_1.InvalidArgumentCountError(call, 'Expected one or two arguments.');
        }
        /** A helper function that resolves the user's clock mode setting (`auto`, `12h`, `24h`) to a concrete setting (`12h` or `24h`) */
        const resolveClockMode = () => {
            if (evalCtx.clockMode === "auto") {
                // detect 12h/24h mode based on whether toLocaleTimeString contains am/pm
                return /am|pm/.test(new Date().toLocaleTimeString()) ? '12h' : '24h';
            }
            else {
                return evalCtx.clockMode;
            }
        };
        /**
         * An object containing tokens and functions returning a value to replace the tokens with.
         * Every instance of a simple token is considered separately (ex. `fff` will print 111 on Monday).
         */
        const simpleTokens = {
            // day of week (dependent on settings)
            'e': date => {
                // both day and firstDay: sunday = 0, monday = 1, ..., saturday = 6
                let day = date.getDay();
                let firstDay = kodeine_js_1.ValidWeekdays.indexOf(evalCtx.firstDayOfTheWeek);
                // if day is sunday and firstDay is monday, we need to offset the day by -firstDay
                return Math.abs((7 + day - firstDay) % 7 + 1);
            },
            // ISO day of week (Monday = 1, Sunday = 7)
            'f': date => {
                if (date.getDay() === 0)
                    return 7; // replace 0 with 7
                else
                    return date.getDay(); // leave 1-6 unchanged
            },
            // week of month
            'F': date => {
                let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
                let firstSundayOfMonthNumber = firstDayOfMonth.getDay() === 0 ? 1 : 8 - firstDayOfMonth.getDay();
                if (date.getDate() <= firstSundayOfMonthNumber) {
                    return 1;
                }
                else {
                    let sundayBeforeDateNumber = date.getDate() - (date.getDay() || 7);
                    let weeksBetweenSundays = Math.floor((sundayBeforeDateNumber - firstSundayOfMonthNumber) / 7);
                    return weeksBetweenSundays + 2;
                }
            },
            // days in month
            'o': date => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
            // UNIX timestamp
            'S': date => Math.floor(date.valueOf() / 1000),
            // timezone offset in seconds
            'Z': date => date.getTimezoneOffset() * 60,
            // time (hours and minutes) as english text (Ten past Three)
            'W': date => {
                let h = date.getHours();
                let m = date.getMinutes();
                if (m === 0) {
                    return `${text_capitalizer_js_1.TextCapitalizer.capitalizeFirstLetter(number_to_text_converter_js_1.NumberToTextConverter.convert(h))} o'clock`;
                }
                else if (m === 15) {
                    return `quarter past ${text_capitalizer_js_1.TextCapitalizer.capitalizeFirstLetter(number_to_text_converter_js_1.NumberToTextConverter.convert(h))}`;
                }
                else if (m < 30) {
                    return `${text_capitalizer_js_1.TextCapitalizer.capitalizeFirstLetter(number_to_text_converter_js_1.NumberToTextConverter.convert(m))} past ${text_capitalizer_js_1.TextCapitalizer.capitalizeFirstLetter(number_to_text_converter_js_1.NumberToTextConverter.convert(h))}`;
                }
                else if (m === 30) {
                    return `half past ${text_capitalizer_js_1.TextCapitalizer.capitalizeFirstLetter(number_to_text_converter_js_1.NumberToTextConverter.convert(h))}`;
                }
                else if (m === 45) {
                    return `quarter to ${text_capitalizer_js_1.TextCapitalizer.capitalizeFirstLetter(number_to_text_converter_js_1.NumberToTextConverter.convert(h))}`;
                }
                else {
                    return `${text_capitalizer_js_1.TextCapitalizer.capitalizeFirstLetter(number_to_text_converter_js_1.NumberToTextConverter.convert(60 - m))} to ${text_capitalizer_js_1.TextCapitalizer.capitalizeFirstLetter(number_to_text_converter_js_1.NumberToTextConverter.convert(((h + 1) % 12) || 12))}`;
                }
            }
        };
        /**
         * An object containing tokens and functions returning a value to replace the tokens with.
         * Sequences of multitokens are treated as one match (ex. `HHHH` will print `0013` for `1 PM`).
         */
        const multiTokens = {
            // hour (0-23 regardless of mode)
            'H': (date, match) => (0, utils_js_1.padWithZeros)(date.getHours(), match.length),
            // hour (12h: 1-12, 24h: 0-23)
            'h': (date, match) => {
                if (resolveClockMode() == '12h')
                    // hours % 12 is 0-11, replace 0 with 12, keep 1-11 as is
                    return (0, utils_js_1.padWithZeros)(date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, match.length);
                else
                    // getHours() returns 0-23, which is good
                    return (0, utils_js_1.padWithZeros)(date.getHours(), match.length);
            },
            // minute
            'm': (date, match) => (0, utils_js_1.padWithZeros)(date.getMinutes(), match.length),
            // second
            's': (date, match) => (0, utils_js_1.padWithZeros)(date.getSeconds(), match.length),
            // am/pm (empty in 24h)
            'a': (date, match) => resolveClockMode() === '24h' ? '' : date.getHours() < 12 ? 'am' : 'pm',
            // am/pm (shown regardless of mode)
            'A': (date, match) => date.getHours() < 12 ? 'am' : 'pm',
            // hour (12h: 0-11, 24h: 1-24)
            'k': (date, match) => {
                if (resolveClockMode() == '12h')
                    // hours % 12 is 0-11, which is good
                    return (0, utils_js_1.padWithZeros)(date.getHours() % 12, match.length);
                else
                    // getHours() returns 0-23, replace 0 with 24, keep 1-23 as is
                    return (0, utils_js_1.padWithZeros)(date.getHours() === 0 ? 24 : date.getHours(), match.length);
            },
            // day of month
            'd': (date, match) => (0, utils_js_1.padWithZeros)(date.getDate(), match.length),
            // day of year
            'D': (date, match) => (0, utils_js_1.padWithZeros)((0, utils_js_1.daysIntoYear)(date), match.length),
            // month of year
            'M': (date, match) => {
                if (match.length < 3)
                    // M or MM, month number
                    return (0, utils_js_1.padWithZeros)(date.getMonth() + 1, match.length);
                else if (match.length === 3)
                    // MMM, month abbreviated
                    return monthsAbbrev[date.getMonth()];
                else
                    // MMMM or more, full month name
                    return monthsFull[date.getMonth()];
            },
            // year
            'y': (date, match) => match.length == 2 ? date.getFullYear().toString().substring(2) : (0, utils_js_1.padWithZeros)(date.getFullYear(), match.length),
            'Y': (date, match) => multiTokens['y'](date, match),
            // day of week
            'E': (date, match) => (match.length < 4 ? weekdaysAbbrev : weekdaysFull)[date.getDay()],
            // timezone indicator/description (ex. CEST/Central European Standard Time)
            // TODO: get timezone depending on evalCtx
            'z': (date, match) => 'NOT IMPLEMENTED'
        };
        let dateToFormat;
        if (args.length === 1)
            // no second argument, use now
            dateToFormat = evalCtx.getNow();
        else if (args[0].isDate)
            // second argument is a date, use it
            dateToFormat = args[0].dateValue;
        else if (args[0].isNumeric)
            // second argument is a number, treat as unix timestamp
            dateToFormat = new Date(args[0].numericValue * 1000);
        else
            // second argument is text, parse as kustom date string
            dateToFormat = kustom_date_helper_js_1.KustomDateHelper.parseKustomDateString(evalCtx.getNow(), args[1].text);
        // format and print the date
        return new kodeine_js_1.KodeValue(format(dateToFormat, args[0].text, simpleTokens, multiTokens), call.source);
    }
}
exports.DfFunction = DfFunction;
//# sourceMappingURL=df-function.js.map