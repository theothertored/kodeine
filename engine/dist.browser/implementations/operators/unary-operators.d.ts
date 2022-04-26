import { IUnaryOperator, KodeValue } from "../../base.js";
import { EvaluationContext } from "../../evaluables/evaluation-context.js";
import { UnaryOperation } from "../../evaluables/unary-operation.js";
/** Implements the only unary operator in kode, negation (unary minus). */
export declare class NegationOperator extends IUnaryOperator {
    getSymbol(): string;
    operation(evalCtx: EvaluationContext, operation: UnaryOperation, a: KodeValue): KodeValue;
}
