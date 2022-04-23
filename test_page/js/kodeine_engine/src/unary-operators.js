import { IUnaryOperator } from "./abstractions.js";
import { KodeValue } from "./evaluables.js";
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