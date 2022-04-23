import { Evaluable } from "../base.js";
export class FunctionCall extends Evaluable {
    constructor(func, args, source) {
        super(source);
        this.func = func;
        this.args = args;
    }
    evaluate(env) {
        let kodeVal = this.func.call(env, this.args.map(a => a.evaluate(env)));
        // the value resulting from this function call should have the same source as the operation
        kodeVal.source = this.source;
        return kodeVal;
    }
}
//# sourceMappingURL=function-call.js.map