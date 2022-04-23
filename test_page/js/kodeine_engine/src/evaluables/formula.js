import { Evaluable, EvaluableSource, KodeValue } from "../base.js";
export class Formula extends Evaluable {
    constructor(evaluables) {
        super(EvaluableSource.createByConcatenatingSources(evaluables));
        this.evaluables = [];
        this.evaluables = evaluables;
    }
    evaluate(env) {
        let output = '';
        for (var evaluable of this.evaluables) {
            output += evaluable.evaluate(env).text;
        }
        return new KodeValue(output);
    }
}
//# sourceMappingURL=formula.js.map