import { IKodeFunction, KodeValue } from "../../base.js";
import { EvaluationContext } from "../../evaluables/evaluation-context.js";
import { FunctionCall } from "../../evaluables/function-call.js";
/** Implementation of Kustom's `gv()` function. */
export declare class GvFunction extends IKodeFunction {
    getName(): string;
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue;
}
