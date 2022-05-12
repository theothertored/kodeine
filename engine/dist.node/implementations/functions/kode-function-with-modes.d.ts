import { IKodeFunction, EvaluationContext, FunctionCall, ConvertibleToKodeValue, KodeValue } from "../../kodeine.js";
/** An internal helper type holding elements extracted from an arugment pattern using regex. */
declare type ArgPatternElements = {
    source: string;
    type: string;
    name: string;
    isOptional: boolean;
    isRest: boolean;
    restMinCount: number;
};
/** An internal type describing a primitive that can be validated and passed to a mode implementation function. */
declare type ModeImplementationFunctionArgPrimitive = string | number | KodeValue;
/**
 * An internal type describing a mode implementation function that has {@link ModeImplementationFunctionContext} as its `this`
 * and returns something that can be converted to a {@link KodeValue}.
 */
declare type ModeImplementationFunction = (this: ModeImplementationFunctionContext, ...args: any[]) => ConvertibleToKodeValue;
/** An internal class intended to be passed as `this` to a mode implementation function. */
declare class ModeImplementationFunctionContext {
    evalCtx: EvaluationContext;
    call: FunctionCall;
    constructor(evalCtx: EvaluationContext, call: FunctionCall);
}
/** A base class for functions that have a mode as their first argument. */
export declare abstract class KodeFunctionWithModes extends IKodeFunction {
    /** An object containing all modes of this function. */
    private _modes;
    /**
     * After calling super() in a deriving class, use the {@link mode()} function to add mode implementations.
     * @see {@link mode} documentation for usage details.
     */
    constructor();
    /**
     * Registers a mode for this function. Intended to be used in the constructor of a deriving type.
     *
     * @param name The name of the mode being added.
     *
     * @param argumentPatterns A list of argument patterns describing how the mode can be called.
     * These patterns should be compatible with arguments taken by {@link implementationFunc}.
     *
     * @param implementationFunc A function implementing the mode.
     * This function cannot be an arrow function, because those cannot have its `this` set with `call()`.
     * Arguments taken by this function should be compatible with {@link argumentPatterns}.
     * The function can return anything that the KodeValue constructor accepts.
     *
     * @example
     * // register a mode named "test" taking two required parameters and an optional one
     * this.mode(
     *      'test',
     *      ['txt text', 'num length', 'any bonus?'],
     *      function (text: string, length: number, bonus?: KodeValue): ConvertibleToKodeValue {
     *          // ...
     *      }
     * );
     */
    protected mode(name: string, argumentPatterns: string[], implementationFunc: ModeImplementationFunction): void;
    /**
     * Validates and convertes a {@link KodeValue} argument for a mode implementation call.
     * @param evalCtx The context of the evaluation.
     * @param call The function call evaluable.
     * @param modeName The name of the mode this validation is performed for.
     * @param i The index of the argument (0 = mode argument, 1 = first actual argument etc.)
     * @param argValue The input {@link KodeValue} resulting from evaluating the argument.
     * @param argPatternElements The argument pattern, split into useful parts.
     */
    protected _validateAndConvertArg(evalCtx: EvaluationContext, call: FunctionCall, modeName: string, i: number, argValue: KodeValue, argPatternElements: ArgPatternElements): ModeImplementationFunctionArgPrimitive;
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue;
}
export {};
