import { InvalidArgumentCountError, InvalidArgumentError } from "../../errors.js";
import { KodeValue, IKodeFunction, EvaluableSource, ConvertibleToKodeValue } from "../../base.js";
import { EvaluationContext } from "../../evaluables/evaluation-context.js";
import { FunctionCall } from "../../evaluables/function-call.js";

/** An internal helper type holding elements extracted from an arugment pattern using regex. */
type ArgPatternElements = { source: string, type: string, name: string, isOptional: boolean };

/** An internal type describing the types of arguments that a mode implementation function can take. */
type ModeImplementationFunctionArg = (string | number | KodeValue);

/** 
 * An internal type describing a mode implementation function that has {@link ModeImplementationFunctionContext} as its `this` 
 * and returns something that can be converted to a {@link KodeValue}.
 */
type ModeImplementationFunction = (this: ModeImplementationFunctionContext, ...args: any[]) => ConvertibleToKodeValue;

/** An internal class holding a list of argument patterns and an implementation of a function mode. */
class FunctionMode {

    /** A list of argument patterns. */
    public readonly argumentPatterns: string[];

    /** A function implementing the mode. */
    public readonly implementationFunc: ModeImplementationFunction;

    /**
     * Constructs a {@link FunctionMode} with a list of argument patterns and a function implementing the mode.
     * @param argumentPatterns A list of argument patterns.
     * @param implementationFunction A function implementing the mode.
     */
    constructor(argumentPatterns: string[], implementationFunction: ModeImplementationFunction) {
        this.argumentPatterns = argumentPatterns;
        this.implementationFunc = implementationFunction;
    }

}

/** An internal class intended to be passed as `this` to a mode implementation function. */
class ModeImplementationFunctionContext {

    public evalCtx: EvaluationContext;
    public call: FunctionCall;

    constructor(evalCtx: EvaluationContext, call: FunctionCall) {
        this.evalCtx = evalCtx;
        this.call = call;
    }

}

/** A base class for functions that have a mode as their first argument. */
export abstract class FunctionWithModes extends IKodeFunction {

    /** An object containing all modes of this function. */
    private _modes: Record<string, FunctionMode> = {};

    /** 
     * After calling super() in a deriving class, use the {@link mode()} function to add mode implementations. 
     * @see {@link mode} documentation for usage details.
     */
    constructor() {
        super();
    }

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
    mode(name: string, argumentPatterns: string[], implementationFunc: ModeImplementationFunction) {
        this._modes[name] = new FunctionMode(argumentPatterns, implementationFunc);
    }

    /** 
     * Validates and convertes a {@link KodeValue} argument for a mode implementation call. 
     * @param evalCtx The context of the evaluation.
     * @param call The function call evaluable.
     * @param modeName The name of the mode this validation is performed for.
     * @param i The index of the argument (0 = mode argument, 1 = first actual argument etc.)
     * @param argValue The input {@link KodeValue} resulting from evaluating the argument.
     * @param argPatternElements The argument pattern, split into useful parts.
     */
    protected _validateAndConvertArg(evalCtx: EvaluationContext, call: FunctionCall, modeName: string, i: number, argValue: KodeValue, argPatternElements: ArgPatternElements): ModeImplementationFunctionArg {

        switch (argPatternElements.type) {

            case 'any':
                // the function wants to handle the argument itself, pass it the raw KodeValue
                return argValue;

            case 'txt':
                // the function wants to work on the value as string
                return argValue.isNumeric ? argValue.numericValue.toString() : argValue.text;

            case 'num':

                // the function wants to work on the value as number
                if (argValue.isNumeric) {

                    // argument is numeric, good to go
                    return argValue.numericValue;

                } else {

                    // argument is not numeric, throw
                    throw new InvalidArgumentError(
                        `${call.func.getName}(${modeName})`,
                        argPatternElements.name,
                        i,
                        call.args[i],
                        argValue,
                        `Argument must be numeric.`
                    );

                }

            default:
                // some other type passed, crash
                throw new Error(`Invalid argument pattern "${argPatternElements.source}" for ${call.func.getName()}(${modeName}), argument #${i + 1}: Unknown type "${argPatternElements.type}".`);
        }

    }

    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {

        if (args.length === 0) {

            // we were not given a mode argument, throw
            throw new InvalidArgumentCountError(call, `${call.func.getName()}() requires at least a mode argument.`);

        }

        // get the mode from the first argument and normalize it
        let modeName = args[0].text.trim().toLowerCase();

        // find mode by name
        let mode = this._modes[modeName];

        if (!mode) {

            // we were given a mode that wasn't registered, throw
            throw new InvalidArgumentError(
                `${call.func.getName()}()`, 'mode', 0,
                call.args[0], args[0],
                `Mode "${modeName}" not found.`
            );

        }

        // check if we weren't given too many arguments according to the pattern
        if (args.length - 1 > mode.argumentPatterns.length) {

            throw new InvalidArgumentCountError(call, `Too many arguments (expected ${mode.argumentPatterns.length} at most).`, `${call.func.getName()}(${modeName})`);

        }

        /** A list of arguments that will be given to the mode implementation. */
        let implementationCallArgs: ModeImplementationFunctionArg[] = [];

        /** 
         * A flag holding whether there an optional argument was encountered, used to check pattern validity
         * (all optional arguments must be at the end).
         */
        let optionalArgumentEncountered = false;

        /** An expression describing a valid argument pattern, capturing useful parts into groups. */
        const argPatternExpr = /^(\S+) ([\S]+?)(\??)$/;

        // Go through all argument patterns.
        for (let i = 0; i < mode.argumentPatterns.length; i++) {

            const argPattern = mode.argumentPatterns[i].trim();

            // match the pattern using the expression
            const argPatternMatch = argPatternExpr.exec(argPattern);

            if (!argPatternMatch) {

                // argument pattern does not match expression
                throw new Error(`Invalid argument pattern "${argPattern}" for ${call.func.getName()}(${modeName}), argument #${i + 1}.`);

            } else {

                // argument pattern is fine

                // create object holding extracted tokens for more comfortable usage
                const argPatternElements: ArgPatternElements = {
                    source: argPattern,
                    type: argPatternMatch[1],
                    name: argPatternMatch[2],
                    isOptional: !!argPatternMatch[3] // convert to bool
                };

                if (argPatternElements.isOptional) {

                    // mark that we found an optional argument
                    optionalArgumentEncountered = true;

                } else {

                    // this is a required argument

                    if (optionalArgumentEncountered) {

                        // there was an optional argument before, crash
                        throw new Error(`Invalid argument pattern "${argPattern}" for ${call.func.getName()}(${modeName}), argument #${i + 1}: Cannot have a required parameter after an optional parameter.`);

                    } else if (i + 1 >= args.length) {

                        // this mode has a required argument but we ran out of given arguments, throw
                        throw new InvalidArgumentCountError(call, `Argument #${i + 1} "${argPattern}" missing.`, `${call.func.getName()}(${modeName})`);

                    }

                }

                // at this point we either have a required argument with a value, or an optional argument with or without a value
                if (i + 1 < args.length) {

                    // we got an argument, validate and convert it, then add to arguments for the mode implementation
                    implementationCallArgs.push(this._validateAndConvertArg(
                        evalCtx, call, modeName, i + 1, args[i + 1],
                        argPatternElements
                    ));

                }

            }



        }

        // call the implementation and get a value in return
        var modeCtx = new ModeImplementationFunctionContext(evalCtx, call);
        let val = mode.implementationFunc.call(modeCtx, ...implementationCallArgs);

        // if implementation returned KodeValue, return it directly, otherwise convert returned value to KodeValue
        return val instanceof KodeValue ? val : new KodeValue(val, call.source);
    }

}
