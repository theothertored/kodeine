import { KodeValue, IKodeFunction } from "../../base.js";
import { EvaluationContext } from "../../evaluables/evaluation-context.js";
import { FunctionCall } from "../../evaluables/function-call.js";
declare type ArgPatternElements = {
    type: string;
    name: string;
    optional: string;
};
/** A base class for functions that have a mode as their first argument. */
export declare abstract class FunctionWithModes extends IKodeFunction {
    private _modes;
    constructor();
    mode(name: string, argumentPatterns: string[], implementationFunc: ModeImplementationFunction): void;
    protected _validateArg(evalCtx: EvaluationContext, call: FunctionCall, modeName: string, i: number, argValue: KodeValue, argPattern: string, argPatternElements: ArgPatternElements): ModeImplementationFunctionArg;
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue;
}
declare type ModeImplementationFunctionArg = (string | number | KodeValue);
declare type ModeImplementationFunction = (this: ModeImplementationFunctionContext, ...args: any[]) => string | number | boolean;
export declare class FunctionMode {
    argumentPatterns: string[];
    implementationFunc: ModeImplementationFunction;
    constructor(argPattern: string[], implementationFunction: ModeImplementationFunction);
}
export declare class ModeImplementationFunctionContext {
    evalCtx: EvaluationContext;
    call: FunctionCall;
    constructor(evalCtx: EvaluationContext, call: FunctionCall);
}
export {};
