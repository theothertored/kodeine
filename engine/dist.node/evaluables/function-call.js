"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionCall = void 0;
const base_js_1 = require("../base.js");
/** A function call, consisting of a kode function being called and arguments for the call. */
class FunctionCall extends base_js_1.Evaluable {
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
    evaluate(env) {
        // call the function with an array of values acquired by evaluating all arguments
        let kodeVal = this.func.call(env, this.args.map(a => a.evaluate(env)));
        // the value resulting from this function call should have the same source as the operation
        kodeVal.source = this.source;
        return kodeVal;
    }
}
exports.FunctionCall = FunctionCall;
//# sourceMappingURL=function-call.js.map