import { IKodeFunction, FunctionCall, KodeValue, EvaluationContext } from "../../../kodeine.js";
/** Implementation of Kustom's df() (date format) function. */
export declare class DfFunction extends IKodeFunction {
    getName(): string;
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue;
}
