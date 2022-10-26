import {
    IKodeFunction,
    EvaluationContext,
    EvaluationWarning,
    InvalidArgumentCountError,
    FunctionCall,
    KodeValue
} from "../../../kodeine.js";

/** Implementation of Kustom's `lv()` function. */
export class LvFunction extends IKodeFunction {

    getName() { return 'lv'; }

    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {

        if (args.length < 1) {

            // disallow no argument calls
            throw new InvalidArgumentCountError(call, 'At least one argument required.');

        } else if (args.length === 1) {

            // 1 argument - get mode, return value of local variable or empty string
            let value = evalCtx.sideEffects.localVariables.get(args[0].text);

            if (!value) {
                evalCtx.sideEffects.warnings.push(
                    new EvaluationWarning(call, `Local variable "${args[0].text}" not found.`)
                );
            }

            return new KodeValue(value || '', call.source);

        } else if (args.length === 2) {

            // 2 arguments - set variable and return empty string
            evalCtx.sideEffects.localVariables.set(args[0].text, args[1]);
            return new KodeValue('', call.source);

        } else {

            // too many arguments
            throw new InvalidArgumentCountError(call, 'Expected at most two arguments.');

        }


    }

}