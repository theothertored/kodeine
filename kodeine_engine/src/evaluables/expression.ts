import { Evaluable, KodeValue } from "../base.js";
import { EvaluableSource, EvaluationContext } from "../base.js";

export class Expression extends Evaluable {

    public readonly evaluable: Evaluable;

    constructor(evaluable: Evaluable, source: EvaluableSource) {
        super(source);
        this.evaluable = evaluable;
    }

    evaluate(env: EvaluationContext): KodeValue {
        return this.evaluable.evaluate(env);
    }

}
