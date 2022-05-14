import { IKodeFunction, FunctionCall, KodeValue, EvaluationContext } from "../../../kodeine.js";
export declare class DfFunction extends IKodeFunction {
    getName(): string;
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue;
}
