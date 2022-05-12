import { IKodeFunction, EvaluationContext, FunctionCall, KodeValue } from "../../../kodeine.js";
/** Implementation of Kustom's `if()` function. */
export declare class IfFunction extends IKodeFunction {
    getName(): string;
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue;
}
