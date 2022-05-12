import { KodeValue, IBinaryOperator, BinaryOperation, EvaluationContext, TwoModeBinaryOperator } from "../../kodeine.js";
export declare class ExponentiationOperator extends TwoModeBinaryOperator {
    getSymbol(): string;
    getPrecedence(): number;
    numericMode(a: number, b: number): number;
}
export declare class MultiplicationOperator extends TwoModeBinaryOperator {
    getSymbol(): string;
    getPrecedence(): number;
    numericMode(a: number, b: number): number;
}
export declare class DivisionOperator extends TwoModeBinaryOperator {
    getSymbol(): string;
    getPrecedence(): number;
    numericMode(a: number, b: number): number;
}
export declare class ModuloOperator extends TwoModeBinaryOperator {
    getSymbol(): string;
    getPrecedence(): number;
    numericMode(a: number, b: number): number;
}
export declare class AdditionOperator extends IBinaryOperator {
    getSymbol(): string;
    getPrecedence(): number;
    operation(evalCtx: EvaluationContext, operation: BinaryOperation, a: KodeValue, b: KodeValue): KodeValue;
}
export declare class SubtractionOperator extends TwoModeBinaryOperator {
    getSymbol(): string;
    getPrecedence(): number;
    numericMode(a: number, b: number): number;
}
export declare class EqualityOperator extends IBinaryOperator {
    getSymbol(): string;
    getPrecedence(): number;
    operation(evalCtx: EvaluationContext, operation: BinaryOperation, a: KodeValue, b: KodeValue): KodeValue;
}
export declare class InequalityOperator extends IBinaryOperator {
    getSymbol(): string;
    getPrecedence(): number;
    operation(evalCtx: EvaluationContext, operation: BinaryOperation, a: KodeValue, b: KodeValue): KodeValue;
}
export declare class LesserThanOperator extends TwoModeBinaryOperator {
    getSymbol(): string;
    getPrecedence(): number;
    numericMode(a: number, b: number): boolean;
}
export declare class GreaterThanOperator extends TwoModeBinaryOperator {
    getSymbol(): string;
    getPrecedence(): number;
    numericMode(a: number, b: number): boolean;
}
export declare class LesserThanOrEqualToOperator extends TwoModeBinaryOperator {
    getSymbol(): string;
    getPrecedence(): number;
    numericMode(a: number, b: number): boolean;
}
export declare class GreaterThanOrEqualToOperator extends TwoModeBinaryOperator {
    getSymbol(): string;
    getPrecedence(): number;
    numericMode(a: number, b: number): boolean;
}
export declare class RegexMatchOperator extends IBinaryOperator {
    getSymbol(): string;
    getPrecedence(): number;
    operation(evalCtx: EvaluationContext, operation: BinaryOperation, a: KodeValue, b: KodeValue): KodeValue;
}
export declare class LogicalOrOperator extends TwoModeBinaryOperator {
    getSymbol(): string;
    getPrecedence(): number;
    numericMode(a: number, b: number): number;
}
export declare class LogicalAndOperator extends TwoModeBinaryOperator {
    getSymbol(): string;
    getPrecedence(): number;
    numericMode(a: number, b: number): number;
}
