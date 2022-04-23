import { IKodeFunction, KodeValue } from "../base.js";
import { NotEnoughArgumentsError } from "../errors.js";
export class IfFunction extends IKodeFunction {
    getName() { return 'if'; }
    call(env, args) {
        if (args.length <= 1)
            throw new NotEnoughArgumentsError(this, 'At least two arguments required.');
        let lastCondArgI = Math.floor((args.length - 2) / 2) * 2;
        ;
        for (var i = 0; i <= lastCondArgI; i += 2) {
            let arg = args[i];
            if ((!arg.isNumeric && arg.text !== '') || (arg.isNumeric && arg.numericValue !== 0)) {
                return args[i + 1];
            }
        }
        if (lastCondArgI + 2 < args.length) {
            return args[lastCondArgI + 2];
        }
        else {
            return new KodeValue('');
        }
    }
}
//# sourceMappingURL=if-function.js.map