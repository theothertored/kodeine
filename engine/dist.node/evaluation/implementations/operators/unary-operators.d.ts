import { KodeValue, IUnaryOperator, EvaluationContext, UnaryOperation } from "../../../kodeine.js";
/** Implements the only unary operator in kode, negation (unary minus). */
export declare class NegationOperator extends IUnaryOperator {
    getSymbol(): string;
    operation(evalCtx: EvaluationContext, operation: UnaryOperation, a: KodeValue): KodeValue;
}
