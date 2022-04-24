import { IUnaryOperator, KodeValue } from "../base.js";
/** Implements the only unary operator in kode, negation (unary minus). */
export declare class NegationOperator extends IUnaryOperator {
    getSymbol(): string;
    operation(a: KodeValue): KodeValue;
}
