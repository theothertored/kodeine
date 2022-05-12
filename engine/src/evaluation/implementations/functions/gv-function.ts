import { 
    KodeValue,
    IKodeFunction,
    EvaluationContext,
    EvaluationError, InvalidArgumentCountError,
    FunctionCall
} from "../../../kodeine.js";

/** Implementation of Kustom's `gv()` function. */
export class GvFunction extends IKodeFunction {

    getName() { return 'gv'; }

    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {

        // require at least two arguments (one condition and one value)
        if (args.length < 1)
            throw new InvalidArgumentCountError(call, 'At least one argument required.');

        else if (args.length > 1)
            throw new InvalidArgumentCountError(call, 'Only one-argument gv() calls are currently implemented.');

        let globalName = args[0].text.trim().toLowerCase();

        if (evalCtx.sideEffects.globalNameStack.indexOf(globalName) >= 0) {

            throw new EvaluationError(call, `Global reference loop detected. Global stack: ${evalCtx.sideEffects.globalNameStack.join(' > ')}.`);

        } else {

            // push global name to stack
            evalCtx.sideEffects.globalNameStack.push(globalName);

            let globalFormula = evalCtx.globals.get(globalName);

            if (globalFormula) {

                // evaluate global formula with the same context
                let globalValue = globalFormula.evaluate(evalCtx);

                // pop the stack to remove the global name we pushed
                evalCtx.sideEffects.globalNameStack.pop();

                // return the value of the global
                return globalValue;

            } else {

                // global not found, return empty string
                return new KodeValue('', call.source);

            }

        }
    }
}