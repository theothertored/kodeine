import { IUnaryOperator, KodeValue } from "../base.js";

export class NegationOperator extends IUnaryOperator {

    getSymbol() { return '-'; }

    operation(a: KodeValue): KodeValue {
        if (a.isNumeric) {
            return new KodeValue(-a.numericValue);
        } else {
            return new KodeValue(a.text + '-null');
        }
    }

}
