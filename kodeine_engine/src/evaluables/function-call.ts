import { Evaluable, IKodeFunction, KodeValue, EvaluableSource, EvaluationContext } from "../base.js";

export class FunctionCall extends Evaluable {

    public readonly func: IKodeFunction;
    public readonly args: Evaluable[];

    constructor(func: IKodeFunction, args: Evaluable[], source?: EvaluableSource) {
        super(source);
        this.func = func;
        this.args = args;
    }

    evaluate(env: EvaluationContext): KodeValue {

        let kodeVal = this.func.call(env, this.args.map(a => a.evaluate(env)));

        // the value resulting from this function call should have the same source as the operation
        kodeVal.source = this.source;

        return kodeVal;

    }

}