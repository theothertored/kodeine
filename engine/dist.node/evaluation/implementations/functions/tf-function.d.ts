import { KodeValue, IKodeFunction, EvaluationContext, FunctionCall } from "../../../kodeine.js";
/** Implementation of Kustom's tf() (timespan format) function. */
export declare class TfFunction extends IKodeFunction {
    getName(): string;
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue;
}
