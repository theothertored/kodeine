import { InvalidArgumentCountError, InvalidArgumentError } from "../../errors.js";
import { KodeValue, IKodeFunction, EvaluableSource } from "../../base.js";
import { EvaluationContext } from "../../evaluables/evaluation-context.js";
import { FunctionCall } from "../../evaluables/function-call.js";

type ArgPatternElements = { type: string, name: string, optional: string };

/** A base class for functions that have a mode as their first argument. */
export abstract class FunctionWithModes extends IKodeFunction {

    private _modes: Record<string, FunctionMode> = {};

    constructor() {
        super();
    }

    mode(name: string, argumentPatterns: string[], implementationFunc: ModeImplementationFunction) {
        this._modes[name] = new FunctionMode(argumentPatterns, implementationFunc);
    }

    protected _validateArg(evalCtx: EvaluationContext, call: FunctionCall, modeName: string, i: number, argValue: KodeValue, argPattern: string, argPatternElements: ArgPatternElements): ModeImplementationFunctionArg {

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
                throw new Error(`Invalid argument pattern "${argPattern}" for ${call.func.getName()}(${modeName}), argument #${i + 1}: Unknown type "${argPatternElements.type}".`);
        }

    }

    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {

        if (args.length === 0) {
            throw new InvalidArgumentCountError(call, `${call.func.getName()}() requires at least a mode argument.`);
        }

        let modeName = args[0].text.trim().toLowerCase();

        let mode = this._modes[modeName];

        if (!mode) {
            throw new InvalidArgumentError(
                `${call.func.getName()}()`, 'mode', 0,
                call.args[0], args[0],
                `Mode "${modeName}" not found.`
            );
        }

        // check if there weren't too many arguments passed
        if (args.length - 1 > mode.argumentPatterns.length) {
            throw new InvalidArgumentCountError(call, `Too many arguments (expected ${mode.argumentPatterns.length} at most).`, `${call.func.getName()}(${modeName})`);
        }

        let implementationCallArgs: ModeImplementationFunctionArg[] = [];

        let hadOptionalValue = false;
        const argPatternExpr = /^(\S+) ([\S]+?)(\??)$/;

        for (let i = 0; i < mode.argumentPatterns.length; i++) {
            const argPattern = mode.argumentPatterns[i].trim();
            const argPatternMatch = argPatternExpr.exec(argPattern);

            if (!argPatternMatch) {

                // argument pattern does not match expression
                throw new Error(`Invalid argument pattern "${argPattern}" for ${call.func.getName()}(${modeName}), argument #${i + 1}.`);

            } else {

                const argPatternElements: ArgPatternElements = {
                    type: argPatternMatch[1],
                    name: argPatternMatch[2],
                    optional: argPatternMatch[3]
                };

                if (argPatternElements.optional) {

                    // mark that we found an optional argument
                    hadOptionalValue = true;

                } else {

                    // this is a required argument

                    if (hadOptionalValue) {

                        // there was an optional argument before, crash
                        throw new Error(`Invalid argument pattern "${argPattern}" for ${call.func.getName()}(${modeName}), argument #${i + 1}: Cannot have a required parameter after an optional parameter.`);

                    } else if (i + 1 >= args.length) {

                        // this mode has a required argument but we ran out of arguments
                        throw new InvalidArgumentCountError(call, `Argument #${i + 1} "${argPattern}" missing.`, `${call.func.getName()}(${modeName})`);

                    }

                }

                // at this point we either have a required argument with a value, or an optional argument with or without a value
                if (i + 1 < args.length) {

                    // we got an argument, add it to args that will be passed to the implementation
                    implementationCallArgs.push(this._validateArg(
                        evalCtx, call, modeName, i + 1, args[i + 1],
                        argPattern, argPatternElements
                    ));

                }

            }



        }

        // call the implementation and get a value in return
        var modeCtx = new ModeImplementationFunctionContext(evalCtx, call);
        let val = mode.implementationFunc.call(modeCtx, ...implementationCallArgs);

        return new KodeValue(val, new EvaluableSource(...call.source!.tokens));
    }

}

type ModeImplementationFunctionArg = (string | number | KodeValue);
type ModeImplementationFunction = (this: ModeImplementationFunctionContext, ...args: any[]) => string | number | boolean;

export class FunctionMode {

    public argumentPatterns: string[];
    public implementationFunc: ModeImplementationFunction;

    constructor(argPattern: string[], implementationFunction: ModeImplementationFunction) {
        this.argumentPatterns = argPattern;
        this.implementationFunc = implementationFunction;
    }

}

export class ModeImplementationFunctionContext {

    public evalCtx: EvaluationContext;
    public call: FunctionCall;

    constructor(evalCtx: EvaluationContext, call: FunctionCall) {
        this.evalCtx = evalCtx;
        this.call = call;
    }

}