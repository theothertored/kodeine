import { Evaluable, EvaluableSource, KodeValue } from "../base.js";
import { EvaluationContext } from "../base.js";

export class Formula extends Evaluable {

    public readonly evaluables: Evaluable[] = [];

    constructor(evaluables: Evaluable[]) {
        super(EvaluableSource.createByConcatenatingSources(evaluables));
        this.evaluables = evaluables;
    }

    evaluate(env: EvaluationContext): KodeValue {

        let output = '';

        for (var evaluable of this.evaluables) {
            output += evaluable.evaluate(env).text;
        }

        return new KodeValue(output);

    }
}
