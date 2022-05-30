import { IKodeFunction, FunctionCall, KodeValue, EvaluationContext } from "../../../kodeine.js";
/** Implementation of Kustom's dp() (date parser) function. */
export declare class DpFunction extends IKodeFunction {
    getName(): string;
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue;
}
