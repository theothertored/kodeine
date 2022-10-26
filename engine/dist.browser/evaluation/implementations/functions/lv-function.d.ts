import { IKodeFunction, EvaluationContext, FunctionCall, KodeValue } from "../../../kodeine.js";
/** Implementation of Kustom's `lv()` function. */
export declare class LvFunction extends IKodeFunction {
    getName(): string;
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue;
}
