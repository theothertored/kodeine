"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionWithModes = void 0;
const errors_js_1 = require("../../errors.js");
const base_js_1 = require("../../base.js");
/** An internal class holding a list of argument patterns and an implementation of a function mode. */
class FunctionMode {
    /**
     * Constructs a {@link FunctionMode} with a list of argument patterns and a function implementing the mode.
     * @param argumentPatterns A list of argument patterns.
     * @param implementationFunction A function implementing the mode.
     */
    constructor(argumentPatterns, implementationFunction) {
        this.argumentPatterns = argumentPatterns;
        this.implementationFunc = implementationFunction;
    }
}
/** An internal class intended to be passed as `this` to a mode implementation function. */
class ModeImplementationFunctionContext {
    constructor(evalCtx, call) {
        this.evalCtx = evalCtx;
        this.call = call;
    }
}
/** A base class for functions that have a mode as their first argument. */
class FunctionWithModes extends base_js_1.IKodeFunction {
    /**
     * After calling super() in a deriving class, use the {@link mode()} function to add mode implementations.
     * @see {@link mode} documentation for usage details.
     */
    constructor() {
        super();
        /** An object containing all modes of this function. */
        this._modes = {};
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
    mode(name, argumentPatterns, implementationFunc) {
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
    _validateAndConvertArg(evalCtx, call, modeName, i, argValue, argPatternElements) {
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
                }
                else {
                    // argument is not numeric, throw
                    throw new errors_js_1.InvalidArgumentError(`${call.func.getName()}(${modeName})`, argPatternElements.name, i, call.args[i], argValue, `Argument must be numeric.`);
                }
            default:
                // some other type passed, crash
                throw new Error(`Invalid argument pattern "${argPatternElements.source}" for ${call.func.getName()}(${modeName}), argument #${i + 1}: Unknown type "${argPatternElements.type}".`);
        }
    }
    call(evalCtx, call, args) {
        if (args.length === 0) {
            // we were not given a mode argument, throw
            throw new errors_js_1.InvalidArgumentCountError(call, `${call.func.getName()}() requires at least a mode argument.`);
        }
        // get the mode from the first argument and normalize it
        let modeName = args[0].text.trim().toLowerCase();
        // find mode by name
        let mode = this._modes[modeName];
        if (!mode) {
            // we were given a mode that wasn't registered, throw
            throw new errors_js_1.InvalidArgumentError(`${call.func.getName()}()`, 'mode', 0, call.args[0], args[0], `Mode "${modeName}" not found.`);
        }
        /** A list of arguments that will be given to the mode implementation. */
        let implementationCallArgs = [];
        /**
         * A flag holding whether an optional argument was encountered, used to check pattern validity
         * (all optional arguments must be at the end).
         */
        let optionalArgumentEncountered = false;
        /**
         * A flag holding whether a rest parameter was encountered, used to check pattern validity
         * (if false, check if too many parameters were given)
        */
        let restParamEncountered = false;
        /** An expression describing a valid argument pattern, capturing useful parts into groups. */
        const argPatternExpr = /^(\S+) ([\S]+?)(\?|\[(\d*)\])?$/;
        // Go through all argument patterns.
        for (let i = 0; i < mode.argumentPatterns.length; i++) {
            const argPattern = mode.argumentPatterns[i].trim();
            // match the pattern using the expression
            const argPatternMatch = argPatternExpr.exec(argPattern);
            if (!argPatternMatch) {
                // argument pattern does not match expression
                throw new Error(`Invalid argument pattern "${argPattern}" for ${call.func.getName()}(${modeName}), argument #${i + 1}.`);
            }
            else {
                // argument pattern is fine
                // create object holding extracted tokens for more comfortable usage
                const argPatternElements = {
                    source: argPattern,
                    type: argPatternMatch[1],
                    name: argPatternMatch[2],
                    isOptional: argPatternMatch[3] === '?',
                    isRest: !!argPatternMatch[3] && argPatternMatch[3] !== '?',
                    restMinCount: Number(argPatternMatch[4])
                };
                // pattern validation
                if (argPatternElements.isOptional) {
                    // mark that we found an optional argument
                    optionalArgumentEncountered = true;
                }
                else if (argPatternElements.isRest) {
                    if (i < mode.argumentPatterns.length - 1) {
                        // a rest argument has been provided as not the last argument
                        throw new Error(`Invalid argument pattern "${argPattern}" for ${call.func.getName()}(${modeName}), argument #${i + 1} (${argPatternElements.name}): `
                            + 'A rest parameter must be the last parameter on the list.');
                    }
                    restParamEncountered = true;
                }
                else {
                    // this is a required argument
                    if (optionalArgumentEncountered) {
                        // there was an optional argument before, crash
                        throw new Error(`Invalid argument pattern "${argPattern}" for ${call.func.getName()}(${modeName}), argument #${i + 1} (${argPatternElements.name}): `
                            + 'Cannot have a required parameter after an optional parameter.');
                    }
                    else if (i + 1 >= args.length) {
                        // this mode has a required argument but we ran out of given arguments, throw
                        throw new errors_js_1.InvalidArgumentCountError(call, `Argument #${i + 1} (${argPatternElements.name}) missing.`, `${call.func.getName()}(${modeName})`);
                    }
                }
                // check if we weren't given too many arguments according to the pattern,
                // only if a rest parameter wasn't encountered (if it was, we can take any number of arguments)
                if (!restParamEncountered && args.length - 1 > mode.argumentPatterns.length) {
                    throw new errors_js_1.InvalidArgumentCountError(call, `Too many arguments (expected ${mode.argumentPatterns.length} at most).`, `${call.func.getName()}(${modeName})`);
                }
                // if we got this far, the pattern was validated, convert parameters
                if (argPatternElements.isRest) {
                    // check how many arguments are remaining to be passed as the rest parameter
                    let remainingParamCount = args.length - i - 1;
                    if (argPatternElements.restMinCount && remainingParamCount < argPatternElements.restMinCount) {
                        // not enough arguments given for the rest parameter
                        throw new errors_js_1.InvalidArgumentCountError(call, `At least ${argPatternElements.restMinCount} argument${argPatternElements.restMinCount === 1 ? '' : 's'} required.`, `${call.func.getName()}(${modeName})`);
                    }
                    else {
                        // the remaining parameters should be added to an array and passed as a rest parameter
                        let restParam = [];
                        // validate and add rest arguments
                        for (let j = i + 1; j < args.length; j++) {
                            restParam.push(this._validateAndConvertArg(evalCtx, call, modeName, j, args[j], argPatternElements));
                        }
                        implementationCallArgs.push(restParam);
                    }
                }
                else {
                    // at this point, we either have a required argument with a value, or an optional argument with or without a value
                    if (i + 1 < args.length) {
                        // we got an argument, validate and convert it, then add to arguments for the mode implementation
                        implementationCallArgs.push(this._validateAndConvertArg(evalCtx, call, modeName, i + 1, args[i + 1], argPatternElements));
                    }
                }
            }
        }
        // call the implementation and get a value in return
        var modeCtx = new ModeImplementationFunctionContext(evalCtx, call);
        let val = mode.implementationFunc.call(modeCtx, ...implementationCallArgs);
        // if implementation returned KodeValue, return it directly, otherwise convert returned value to KodeValue
        return val instanceof base_js_1.KodeValue ? val : new base_js_1.KodeValue(val, call.source);
    }
}
exports.FunctionWithModes = FunctionWithModes;
//# sourceMappingURL=kode-function-with-modes.js.map