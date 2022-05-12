import { KodeValue, IKodeFunction, EvaluationContext, FunctionCall } from "engine/src/kodeine.js";
/** Implementation of Kustom's `gv()` function. */
export declare class GvFunction extends IKodeFunction {
    getName(): string;
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue;
}
