import { IKodeFunction, KodeValue, InvalidArgumentCountError } from "../../../kodeine.js";
import { KustomDateHelper } from "../helpers/kustom-date-helper.js";
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const weekdaysAbbrev = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthsAbbrev = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// https://stackoverflow.com/a/40975730/6796433
function daysIntoYear(date) {
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}
function pad(source, targetLength) {
    const sourceString = source.toString();
    if (sourceString.length >= targetLength)
        return sourceString;
    else
        return '0'.repeat(targetLength - sourceString.length) + sourceString;
}
export class DfFunction extends IKodeFunction {
    getName() { return 'df'; }
    call(evalCtx, call, args) {
        if (args.length === 0 || args.length > 2) {
            throw new InvalidArgumentCountError(call, '1 or 2 arguments expected.');
        }
        let now = args.length === 1
            ? evalCtx.getNow()
            : KustomDateHelper.parseKustomDateString(evalCtx.getNow(), args[1].text);
        const simpleTokens = {
            // day of week (dependent on settings)
            'e': date => date.getDay().toString(),
            // ISO day of week (Monday = 1, Sunday = 7)
            'f': date => date.getDay() === 0 ? '7' : date.getDay().toString(),
            // week of month
            // TODO: implement
            'F': date => '',
            // days in month
            'o': date => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate().toString(),
            // UNIX timestamp
            'S': date => Math.floor(date.valueOf() / 1000).toString(),
            // timezone offset in seconds
            'Z': date => (date.getTimezoneOffset() * 60).toString(),
            // time (hours and minutes) as english text (ten past three)
            // TODO: implement
            'W': date => 'TODO'
        };
        const multiTokens = {
            // hour (0-23 regardless of mode)
            // TODO: settings
            'H': (date, match) => pad(date.getHours(), match.length),
            // hour (12h: 1-12, 24h: 0-23)
            // TODO: settings
            'h': (date, match) => pad(date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, match.length),
            // minute
            'm': (date, match) => pad(date.getMinutes(), match.length),
            // second
            's': (date, match) => pad(date.getSeconds(), match.length),
            // am/pm (empty in 24h)
            // TODO: settings
            'a': (date, match) => date.getHours() < 12 ? 'am' : 'pm',
            // am/pm (shown regardless of mode)
            'A': (date, match) => date.getHours() < 12 ? 'am' : 'pm',
            // hour (12h: 0-11, 24h: 1-24)
            // TODO: settings
            'k': (date, match) => pad(date.getHours() % 12, match.length),
            // day of month
            'd': (date, match) => pad(date.getDate(), match.length),
            // day of year
            'D': (date, match) => pad(daysIntoYear(date), match.length),
            // month of year
            'M': (date, match) => match.length < 3
                ? pad(date.getMonth() + 1, match.length)
                : match.length < 4
                    ? monthsAbbrev[date.getMonth()]
                    : months[date.getMonth()],
            // year
            // TODO: needs work
            'Y': (date, match) => match.length == 2 ? date.getFullYear().toString().substring(2) : pad(date.getFullYear(), match.length),
            'y': (date, match) => match.length == 2 ? date.getFullYear().toString().substring(2) : pad(date.getFullYear(), match.length),
            // day of week
            'E': (date, match) => (match.length < 4 ? weekdaysAbbrev : weekdays)[date.getDay()],
            // timezone indicator/description (ex. CEST/Central European Standard Time)
            // TODO: get timezone dependent on evalCtx
            'z': (date, match) => match.length < 4 ? Intl.DateTimeFormat().resolvedOptions().timeZone : Intl.DateTimeFormat().resolvedOptions().timeZoneName || ''
        };
        const format = (date, format) => {
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
                    }
                    else {
                        let nextChar = consume();
                        if (nextChar === '\'') {
                            output += '\'';
                        }
                        else {
                            output += nextChar;
                            while (!eof() && peek() !== '\'') {
                                output += consume();
                            }
                        }
                    }
                }
                else {
                    let simpleFunc = simpleTokens[char];
                    if (simpleFunc) {
                        output += simpleFunc(date);
                    }
                    else {
                        let mutliFunc = multiTokens[char];
                        if (mutliFunc) {
                            let buffer = char;
                            while (!eof() && peek() === char) {
                                buffer += consume();
                            }
                            output += mutliFunc(date, buffer);
                        }
                        else {
                            output += char;
                        }
                    }
                }
            }
            return output;
        };
        return new KodeValue(format(now, args[0].text), call.source);
    }
}
//# sourceMappingURL=df-function.js.map