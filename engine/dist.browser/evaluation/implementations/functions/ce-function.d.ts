import { KodeValue, IKodeFunction, EvaluationContext, FunctionCall } from "../../../kodeine.js";
/** Implementation of Kustom's ce() (color editor) function. */
export declare class CeFunction extends IKodeFunction {
    getName(): string;
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue;
}
