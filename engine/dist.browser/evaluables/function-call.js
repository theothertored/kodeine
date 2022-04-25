import { Evaluable } from "../base.js";
/** A function call, consisting of a kode function being called and arguments for the call. */
export class FunctionCall extends Evaluable {
    /**
     * Constructs a function call from a kode function being called, arguments for the call, and, optionally a source of the call.
     * @param func The kode function being called.
     * @param args The arguments for the function call.
     * @param source Optionally, the source of the call.
     */
    constructor(func, args, source) {
        super(source);
        this.func = func;
        this.args = args;
    }
    evaluate(evalCtx) {
        // call the function with an array of values acquired by evaluating all arguments
        return this.func.call(evalCtx, this, this.args.map(a => a.evaluate(evalCtx)));
    }
}
//# sourceMappingURL=function-call.js.map