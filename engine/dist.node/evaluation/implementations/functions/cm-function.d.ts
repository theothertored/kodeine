import { KodeValue, IKodeFunction, EvaluationContext, FunctionCall } from "../../../kodeine.js";
/** Implementation of Kustom's cm() (color maker) function. */
export declare class CmFunction extends IKodeFunction {
    getName(): string;
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue;
}
