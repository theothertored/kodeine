import { IKodeFunction, KodeValue } from "../base.js";
import { NotEnoughArgumentsError } from "../errors.js";
/** Implementation of kustom's `if()` function. */
export class IfFunction extends IKodeFunction {
    getName() { return 'if'; }
    call(env, args) {
        // require at least two arguments (one condition and one value)
        if (args.length <= 1) {
            throw new NotEnoughArgumentsError(this, 'At least two arguments required.');
        }
        // calculate the index of the last condition argument
        let lastCondArgI = Math.floor((args.length - 2) / 2) * 2;
        ;
        // loop through condition arguments
        for (var i = 0; i <= lastCondArgI; i += 2) {
            let condArg = args[i]; // current condition argument
            // if the value is not numeric, empty string is falsy and anything else is truthy
            // if the value is numeric, 0 is falsy and anything else is truthy
            if ((!condArg.isNumeric && condArg.text !== '') || (condArg.isNumeric && condArg.numericValue !== 0)) {
                // the current condition argument is truthy, return the following value argument
                return args[i + 1];
            }
        }
        // we went through all condition arguments and they were all falsy
        // check if there is a final "else" value argument
        if (lastCondArgI + 2 < args.length) {
            // return the final "else" value argument
            return args[lastCondArgI + 2];
        }
        else {
            // return an empty string
            return new KodeValue('');
        }
    }
}
//# sourceMappingURL=if-function.js.map