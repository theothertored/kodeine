import { Evaluable, IKodeFunction, KodeValue, EvaluableSource, EvaluationContext } from "../base.js";
import { InternalEvaluationError } from "../errors.js";

/** A function call, consisting of a kode function being called and arguments for the call. */
export class FunctionCall extends Evaluable {

    /** The kode function being called. */
    public readonly func: IKodeFunction;

    /** The arguments the function will be called with. */
    public readonly args: Evaluable[];

    /**
     * Constructs a function call from a kode function being called, arguments for the call, and, optionally a source of the call.
     * @param func The kode function being called.
     * @param args The arguments for the function call.
     * @param source Optionally, the source of the call.
     */
    constructor(func: IKodeFunction, args: Evaluable[], source?: EvaluableSource) {
        super(source);
        this.func = func;
        this.args = args;
    }

    evaluate(env: EvaluationContext): KodeValue {

        try {

            // call the function with an array of values acquired by evaluating all arguments
            let kodeVal = this.func.call(env, this.args.map(a => a.evaluate(env)));

            // the value resulting from this function call should have the same source as the operation
            kodeVal.source = this.source;

            return kodeVal;

        } catch (err) {

            if (err instanceof InternalEvaluationError) {

                // if an internal evaluation was thrown, we need to convert it
                // to an external one with this operation as the evaluable
                throw err.toExternalError(this);

            } else {
                throw err;
            }

        }

    }

}