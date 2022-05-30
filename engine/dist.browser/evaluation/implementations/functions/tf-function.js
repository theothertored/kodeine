import { KodeValue, IKodeFunction, InvalidArgumentCountError } from "../../../kodeine.js";
import { KustomDateHelper } from "../helpers/kustom-date-helper.js";
import { TimeSpan } from "../helpers/timespan.js";
/** Implementation of Kustom's tf() (timespan format) function. */
export class TfFunction extends IKodeFunction {
    getName() { return 'tf'; }
    call(evalCtx, call, args) {
        // valid calls:
        // date date                    pretty-prints the time until/since given date (ex. 5 minutes ago)
        // num timespan                 treats the number as seconds, creates a timespan and pretty-prints it (ex. 5 minutes)
        // date date, txt format        prints the time until/since given date according to the given format
        // date date, num timespan      treats the number as seconds, creates a timespan and prints it according to the given format
        // format tokens:
        // D, H, M, S       total number of days, hours, minutes and seconds                            (ex. 65 seconds -> 1 M, 65 S)
        // h, m, s          number of hours, minutes and seconds that don't fit inside larger units     (ex. 65 seconds -> 1 m,  5 s)
        // validate argument count
        if (args.length == 0) {
            throw new InvalidArgumentCountError(call, 'At least one argument required.');
        }
        else if (args.length > 2) {
            throw new InvalidArgumentCountError(call, 'Expected one or two arguments.');
        }
        if (args[0].isDate || !args[0].isNumeric) {
            // first argument is a date or isn't numeric
            // get the date to format (use date from argument or parse string as date)
            let date = args[0].isDate ? args[0].dateValue : KustomDateHelper.parseKustomDateString(evalCtx.getNow(), args[0].text);
            // calculate time until/since date
            let timespan = new TimeSpan(Math.trunc((date.valueOf() - evalCtx.getNow().valueOf()) / 1000));
            if (args.length === 2) {
                // second argument provided - print according to given format
                return new KodeValue(timespan.format(args[1].text), call.source);
            }
            else {
                // only one argument - pretty-print (ex. 2 minutes ago)
                return new KodeValue(timespan.prettyPrintRelative(), call.source);
            }
        }
        else {
            // first argument is numeric
            // treat the argument as a duration in seconds and create a timestamp from it
            let duration = args[0].numericValue;
            let timespan = new TimeSpan(duration);
            if (args.length === 2) {
                // second argument provided - print according to given format
                return new KodeValue(timespan.format(args[1].text), call.source);
            }
            else {
                // only one argument - pretty-print (ex. 2 minutes)
                return new KodeValue(timespan.prettyPrintAbsolute(), call.source);
            }
        }
    }
}
//# sourceMappingURL=tf-function.js.map