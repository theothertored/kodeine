import { KodeValue, IKodeFunction } from "../base.js";
import { EvaluationContext } from "../evaluables/evaluation-context.js";
import { FunctionCall } from "../evaluables/function-call.js";
/** A base class for functions that have a mode as their first argument. */
export declare abstract class FunctionWithModes extends IKodeFunction {
    private _modeOverloads;
    constructor();
    mode(name: string, overloads: FunctionModeOverload[]): void;
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue;
}
declare type OverloadImplementation = (...args: any[]) => string | number | boolean;
export declare class FunctionModeOverload {
    args: string[];
    func: OverloadImplementation;
    constructor(args: string[], func: OverloadImplementation);
}
export {};
