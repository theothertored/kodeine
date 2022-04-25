import { KodeValue, IKodeFunction, EvaluableSource } from "../base.js";
import { EvaluationContext } from "../evaluables/evaluation-context.js";
import { FunctionCall } from "../evaluables/function-call.js";


/** A base class for functions that have a mode as their first argument. */
export abstract class FunctionWithModes extends IKodeFunction {

    private _modeOverloads: Record<string, FunctionModeOverload[]> = {};

    constructor() {
        super();
    }

    mode(name: string, overloads: FunctionModeOverload[]) {
        this._modeOverloads[name] = overloads;
    }

    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {

        let modeName = args[0].text.trim().toLowerCase();
        let modeOverloads = this._modeOverloads[modeName];

        // TODO:
        // - find an overload with the best matching argument pattern
        // - throw an error if no pattern matches
        // - construct an array of arguments to match the pattern
        // - call the overload implementation with the argument array

        let val = modeOverloads[0].func.call(this, ...['wow', 'cool']);

        return new KodeValue(val, new EvaluableSource(...call.source!.tokens));
    }

}

type OverloadImplementation = (...args: any[]) => string | number | boolean;

export class FunctionModeOverload {
    public args: string[];
    public func: OverloadImplementation;

    constructor(args: string[], func: OverloadImplementation){
        this.args = args;
        this.func = func;
    }
}