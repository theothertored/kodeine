"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModeImplementationFunctionContext = exports.FunctionMode = exports.FunctionWithModes = void 0;
const errors_js_1 = require("../../errors.js");
const base_js_1 = require("../../base.js");
/** A base class for functions that have a mode as their first argument. */
class FunctionWithModes extends base_js_1.IKodeFunction {
    constructor() {
        super();
        this._modes = {};
    }
    mode(name, argumentPatterns, implementationFunc) {
        this._modes[name] = new FunctionMode(argumentPatterns, implementationFunc);
    }
    _validateArg(evalCtx, call, modeName, i, argValue, argPattern, argPatternElements) {
        switch (argPatternElements.type) {
            case 'any':
                // the function wants to handle the argument itself
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
                    throw new errors_js_1.InvalidArgumentError(`${call.func.getName}(${modeName})`, argPatternElements.name, i, call.args[i], argValue, `Argument must be numeric.`);
                }
            default:
                throw new Error(`Invalid argument pattern "${argPattern}" for ${call.func.getName()}(${modeName}), argument #${i + 1}: Unknown type "${argPatternElements.type}".`);
        }
    }
    call(evalCtx, call, args) {
        if (args.length === 0) {
            throw new errors_js_1.InvalidArgumentCountError(call, `${call.func.getName()}() requires at least a mode argument.`);
        }
        let modeName = args[0].text.trim().toLowerCase();
        let mode = this._modes[modeName];
        if (!mode) {
            throw new errors_js_1.InvalidArgumentError(`${call.func.getName()}()`, 'mode', 0, call.args[0], args[0], `Mode "${modeName}" not found.`);
        }
        // check if there weren't too many arguments passed
        if (args.length - 1 > mode.argumentPatterns.length) {
            throw new errors_js_1.InvalidArgumentCountError(call, `Too many arguments (expected ${mode.argumentPatterns.length} at most).`, `${call.func.getName()}(${modeName})`);
        }
        let implementationCallArgs = [];
        let hadOptionalValue = false;
        const argPatternExpr = /^(\S+) ([\S]+?)(\??)$/;
        for (let i = 0; i < mode.argumentPatterns.length; i++) {
            const argPattern = mode.argumentPatterns[i].trim();
            const argPatternMatch = argPatternExpr.exec(argPattern);
            if (!argPatternMatch) {
                // argument pattern does not match expression
                throw new Error(`Invalid argument pattern "${argPattern}" for ${call.func.getName()}(${modeName}), argument #${i + 1}.`);
            }
            else {
                const argPatternElements = {
                    type: argPatternMatch[1],
                    name: argPatternMatch[2],
                    optional: argPatternMatch[3]
                };
                if (argPatternElements.optional) {
                    // mark that we found an optional argument
                    hadOptionalValue = true;
                }
                else {
                    // this is a required argument
                    if (hadOptionalValue) {
                        // there was an optional argument before, crash
                        throw new Error(`Invalid argument pattern "${argPattern}" for ${call.func.getName()}(${modeName}), argument #${i + 1}: Cannot have a required parameter after an optional parameter.`);
                    }
                    else if (i + 1 >= args.length) {
                        // this mode has a required argument but we ran out of arguments
                        throw new errors_js_1.InvalidArgumentCountError(call, `Argument #${i + 1} "${argPattern}" missing.`, `${call.func.getName()}(${modeName})`);
                    }
                }
                // at this point we either have a required argument with a value, or an optional argument with or without a value
                if (i + 1 < args.length) {
                    // we got an argument, add it to args that will be passed to the implementation
                    implementationCallArgs.push(this._validateArg(evalCtx, call, modeName, i + 1, args[i + 1], argPattern, argPatternElements));
                }
            }
        }
        // call the implementation and get a value in return
        var modeCtx = new ModeImplementationFunctionContext(evalCtx, call);
        let val = mode.implementationFunc.call(modeCtx, ...implementationCallArgs);
        return new base_js_1.KodeValue(val, new base_js_1.EvaluableSource(...call.source.tokens));
    }
}
exports.FunctionWithModes = FunctionWithModes;
class FunctionMode {
    constructor(argPattern, implementationFunction) {
        this.argumentPatterns = argPattern;
        this.implementationFunc = implementationFunction;
    }
}
exports.FunctionMode = FunctionMode;
class ModeImplementationFunctionContext {
    constructor(evalCtx, call) {
        this.evalCtx = evalCtx;
        this.call = call;
    }
}
exports.ModeImplementationFunctionContext = ModeImplementationFunctionContext;
//# sourceMappingURL=kode-function-with-modes.js.map