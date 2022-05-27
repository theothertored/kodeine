import { KodeValue, IKodeFunction, EvaluationContext, FunctionCall } from "../../../kodeine.js";
export declare class CmFunction extends IKodeFunction {
    getName(): string;
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue;
}
