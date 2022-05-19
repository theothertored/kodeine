import {
    KodeValue,
    IKodeFunction,
    EvaluationContext,
    FunctionCall,
    InvalidArgumentCountError
} from "../../../kodeine.js";
import { KustomDateHelper } from "../helpers/kustom-date-helper.js";
import { TimeSpan } from "../helpers/timespan.js";

export class TfFunction extends IKodeFunction {

    getName() { return 'tf'; }

    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {

        if (args.length == 0) {
            throw new InvalidArgumentCountError(call, 'At least one argument required.');
        } else if (args.length > 2) {
            throw new InvalidArgumentCountError(call, 'Expected one or two arguments.');
        }

        if (args[0].isDate || !args[0].isNumeric) {

            // formatting date
            let date = args[0].isDate ? args[0].dateValue! : KustomDateHelper.parseKustomDateString(evalCtx.getNow(), args[0].text);
            let timespan = new TimeSpan(Math.trunc((date.valueOf() - evalCtx.getNow().valueOf()) / 1000));

            if (args.length === 2) {

                // manual format
                let format = args[1].text;
                return new KodeValue(timespan.format(format), call.source);

            } else {

                // pretty-print (ex. 2 minutes ago)
                return new KodeValue(timespan.prettyPrintRelative(), call.source);

            }

        } else {

            let duration = args[0].numericValue;
            let timespan = new TimeSpan(duration);

            if (args.length === 2) {

                // manual format
                let format = args[1].text;
                return new KodeValue(timespan.format(format), call.source);

            } else {

                // pretty-print (ex. 2 minutes)
                return new KodeValue(timespan.prettyPrintAbsolute(), call.source);

            }

        }

    }

}