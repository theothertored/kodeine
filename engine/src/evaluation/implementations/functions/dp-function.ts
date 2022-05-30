import {
    IKodeFunction,
    EvaluationError,
    FunctionCall,
    KodeValue,
    EvaluationContext,
    InvalidArgumentCountError
} from "../../../kodeine.js";
import { KustomDateHelper } from "../helpers/kustom-date-helper.js";

/** Implementation of Kustom's dp() (date parser) function. */
export class DpFunction extends IKodeFunction {

    getName() { return 'dp'; }

    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {

        if (args.length === 0) {

            // 0 arguments, return current date
            return new KodeValue(evalCtx.getNow(), call.source);

        } else if (args.length === 1) {

            // 1 argument, parse it as kustom date string
            return new KodeValue(KustomDateHelper.parseKustomDateString(evalCtx.getNow(), args[0].text), call.source);

        } else {

            // more than 1 argument
            throw new InvalidArgumentCountError(call, 'Expected 0 or 1 arguments.');

        }

    }

}