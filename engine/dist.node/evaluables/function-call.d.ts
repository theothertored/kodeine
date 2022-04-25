import { Evaluable, IKodeFunction, KodeValue, EvaluableSource } from "../base.js";
import { EvaluationContext } from "./evaluation-context.js";
/** A function call, consisting of a kode function being called and arguments for the call. */
export declare class FunctionCall extends Evaluable {
    /** The kode function being called. */
    readonly func: IKodeFunction;
    /** The arguments the function will be called with. */
    readonly args: Evaluable[];
    /**
     * Constructs a function call from a kode function being called, arguments for the call, and, optionally a source of the call.
     * @param func The kode function being called.
     * @param args The arguments for the function call.
     * @param source Optionally, the source of the call.
     */
    constructor(func: IKodeFunction, args: Evaluable[], source?: EvaluableSource);
    evaluate(env: EvaluationContext): KodeValue;
}
