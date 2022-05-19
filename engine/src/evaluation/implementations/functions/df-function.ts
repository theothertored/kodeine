import {
    IKodeFunction,
    EvaluationError,
    FunctionCall,
    KodeValue,
    EvaluationContext,
    InvalidArgumentCountError,
    ValidWeekdays
} from "../../../kodeine.js";
import { KustomDateHelper } from "../helpers/kustom-date-helper.js";
import { NumberToTextConverter } from "../helpers/number-to-text-converter.js";
import { TextCapitalizer } from "../helpers/text-capitalizer.js";


const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const weekdaysAbbrev = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthsAbbrev = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// https://stackoverflow.com/a/40975730/6796433
function daysIntoYear(date: Date): number {
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}

function pad(source: number, targetLength: number) {
    const sourceString = source.toString();
    if (sourceString.length >= targetLength)
        return sourceString;
    else
        return '0'.repeat(targetLength - sourceString.length) + sourceString;
}


export class DfFunction extends IKodeFunction {

    getName() { return 'df'; }

    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {

        if (args.length === 0) {
            throw new InvalidArgumentCountError(call, 'At least one argument required.');
        } else if (args.length > 2) {
            throw new InvalidArgumentCountError(call, 'Expected one or two arguments.');
        }

        const resolveClockMode = (): '12h' | '24h' => {
            if (evalCtx.clockMode === "auto") {
                // detect 12h/24h mode based on toLocaleTimeString
                return /am|pm/.test(new Date().toLocaleTimeString()) ? '12h' : '24h';
            } else {
                return evalCtx.clockMode;
            }
        }

        const simpleTokens: Record<string, ((date: Date) => string | number) | undefined> = {

            // day of week (dependent on settings)
            'e': date => {
                // both day and firstDay: sunday = 0, monday = 1, ..., saturday = 6
                let day = date.getDay();
                let firstDay = ValidWeekdays.indexOf(evalCtx.firstDayOfTheWeek);
                // if day is sunday and firstDay is monday, we need to offset the day by -firstDay
                return Math.abs((7 + day - firstDay) % 7 + 1);
            },

            // ISO day of week (Monday = 1, Sunday = 7)
            'f': date => {
                if (date.getDay() === 0)
                    return 7;               // replace 0 with 7
                else
                    return date.getDay();   // leave 1-6 unchanged
            },

            // week of month
            'F': date => {

                let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
                let firstSundayOfMonthNumber = firstDayOfMonth.getDay() === 0 ? 1 : 8 - firstDayOfMonth.getDay();

                if (date.getDate() <= firstSundayOfMonthNumber) {
                    return 1;
                } else {
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

            // time (hours and minutes) as english text (ten past three)
            'W': date => {

                let h = date.getHours();
                let m = date.getMinutes();

                if (m === 0) {
                    return `${TextCapitalizer.capitalizeFirstLetter(NumberToTextConverter.convert(h))} o'clock`;
                } else if (m === 15) {
                    return `quarter past ${TextCapitalizer.capitalizeFirstLetter(NumberToTextConverter.convert(h))}`;
                } else if (m < 30) {
                    return `${TextCapitalizer.capitalizeFirstLetter(NumberToTextConverter.convert(m))} past ${TextCapitalizer.capitalizeFirstLetter(NumberToTextConverter.convert(h))}`
                } else if (m === 30) {
                    return `half past ${TextCapitalizer.capitalizeFirstLetter(NumberToTextConverter.convert(h))}`;
                } else if (m === 45) {
                    return `quarter to ${TextCapitalizer.capitalizeFirstLetter(NumberToTextConverter.convert(h))}`;
                } else {
                    return `${TextCapitalizer.capitalizeFirstLetter(NumberToTextConverter.convert(60 - m))} to ${TextCapitalizer.capitalizeFirstLetter(NumberToTextConverter.convert(((h + 1) % 12) || 12))}`
                }

            }

        };

        const multiTokens: Record<string, ((date: Date, match: string) => string | number) | undefined> = {

            // hour (0-23 regardless of mode)
            // TODO: settings
            'H': (date, match) => pad(date.getHours(), match.length),

            // hour (12h: 1-12, 24h: 0-23)
            // TODO: settings
            'h': (date, match) => {

                if (resolveClockMode() == '12h')
                    // hours % 12 is 0-11, replace 0 with 12, keep 1-11 as is
                    return pad(date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, match.length);
                else
                    // getHours() returns 0-23, which is good
                    return pad(date.getHours(), match.length);

            },

            // minute
            'm': (date, match) => pad(date.getMinutes(), match.length),

            // second
            's': (date, match) => pad(date.getSeconds(), match.length),

            // am/pm (empty in 24h)
            'a': (date, match) => resolveClockMode() === '24h' ? '' : date.getHours() < 12 ? 'am' : 'pm',

            // am/pm (shown regardless of mode)
            'A': (date, match) => date.getHours() < 12 ? 'am' : 'pm',

            // hour (12h: 0-11, 24h: 1-24)
            'k': (date, match) => {

                if (resolveClockMode() == '12h')
                    // hours % 12 is 0-11, which is good
                    return pad(date.getHours() % 12, match.length);
                else
                    // getHours() returns 0-23, replace 0 with 24, keep 1-23 as is
                    return pad(date.getHours() === 0 ? 24 : date.getHours(), match.length);

            },

            // day of month
            'd': (date, match) => pad(date.getDate(), match.length),

            // day of year
            'D': (date, match) => pad(daysIntoYear(date), match.length),

            // month of year
            'M': (date, match) => {

                if (match.length < 3)
                    // M or MM, month number
                    return pad(date.getMonth() + 1, match.length);

                else if (match.length === 3)
                    // MMM, month abbreviated
                    return monthsAbbrev[date.getMonth()];

                else
                    // MMMM or more, full month name
                    return monthsFull[date.getMonth()];

            },

            // year
            'y': (date, match) => match.length == 2 ? date.getFullYear().toString().substring(2) : pad(date.getFullYear(), match.length),
            'Y': (date, match) => multiTokens['y']!(date, match),

            // day of week
            'E': (date, match) => (match.length < 4 ? weekdaysAbbrev : weekdays)[date.getDay()],

            // timezone indicator/description (ex. CEST/Central European Standard Time)
            // TODO: get timezone depending on evalCtx
            'z': (date, match) => 'NOT IMPLEMENTED'

        };

        const format = (date: Date, format: string): string => {

            let output = '';

            let i = 0;

            let consume = () => format[i++];
            let peek = () => format[i];
            let eof = () => i >= format.length;

            while (!eof()) {

                let char = consume();

                if (char === '\'') {

                    if (eof()) {

                        break;

                    } else {

                        let nextChar = consume();

                        if (nextChar === '\'') {

                            output += '\'';

                        } else {

                            output += nextChar;

                            while (!eof() && peek() !== '\'') {
                                output += consume();
                            }

                            // consume ending '
                            if (!eof()) {
                                consume();
                            }
                        }

                    }

                } else {

                    let simpleFunc = simpleTokens[char];

                    if (simpleFunc) {

                        output += simpleFunc(date);

                    } else {

                        let mutliFunc = multiTokens[char];

                        if (mutliFunc) {

                            let buffer = char;

                            while (!eof() && peek() === char) {
                                buffer += consume();
                            }

                            output += mutliFunc(date, buffer);

                        } else {
                            output += char;
                        }

                    }

                }

            }

            return output;

        };

        let now: Date;

        if (args.length === 1)
            // no second argument, return now
            now = evalCtx.getNow();

        else if (args[0].isDate)
            // second argument is a date
            now = args[0].dateValue!;

        else if (args[0].isNumeric)
            // second argument is a number
            now = new Date(args[0].numericValue * 1000);

        else
            // second argument is text
            now = KustomDateHelper.parseKustomDateString(evalCtx.getNow(), args[1].text);

        return new KodeValue(format(now, args[0].text), call.source);

    }

}