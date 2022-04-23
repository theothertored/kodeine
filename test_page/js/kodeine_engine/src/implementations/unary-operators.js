import { IUnaryOperator, KodeValue } from "../base.js";
export class NegationOperator extends IUnaryOperator {
    getSymbol() { return '-'; }
    operation(a) {
        if (a.isNumeric) {
            return new KodeValue(-a.numericValue);
        }
        else {
            return new KodeValue(a.text + '-null');
        }
    }
}
//# sourceMappingURL=unary-operators.js.map