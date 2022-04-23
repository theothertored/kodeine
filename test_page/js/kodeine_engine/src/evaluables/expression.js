import { Evaluable } from "../base.js";
export class Expression extends Evaluable {
    constructor(evaluable, source) {
        super(source);
        this.evaluable = evaluable;
    }
    evaluate(env) {
        return this.evaluable.evaluate(env);
    }
}
//# sourceMappingURL=expression.js.map