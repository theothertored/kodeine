import { IEvaluable } from "../abstractions.js";
import { EvaluableSource } from "../base.js";
export class KodeValue extends IEvaluable {
    constructor(value, source) {
        super(source);
        if (typeof value === 'boolean') {
            this.numericValue = value ? 1 : 0;
            this.text = this.numericValue.toString();
            this.isNumeric = true;
        }
        else if (typeof value === 'string') {
            this.text = value;
            this.numericValue = Number(value);
            this.isNumeric = !isNaN(this.numericValue);
        }
        else {
            this.numericValue = value;
            this.text = value.toString();
            this.isNumeric = true;
        }
    }
    _evaluate(env) {
        return this;
    }
    static fromToken(token) {
        return new KodeValue(token.getValue(), EvaluableSource.fromToken(token));
    }
}
//# sourceMappingURL=kode-value.js.map