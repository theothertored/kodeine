import { IKodeFunction, KodeValue } from "../base.js";
import { EvaluationContext } from "../evaluables/evaluation-context.js";
/** Implementation of kustom's `if()` function. */
export declare class IfFunction extends IKodeFunction {
    getName(): string;
    call(env: EvaluationContext, args: KodeValue[]): KodeValue;
}
