import { FormulaEvaluationTreeNode, KodeValue } from "../base.js";
import { BinaryOperation } from "./binary-operation.js";
import { FunctionCall } from "./function-call.js";
import { UnaryOperation } from "./unary-operation.js";
export declare class FormulaEvaluationTree extends FormulaEvaluationTreeNode {
    readonly parts: FormulaEvaluationTreeNode[];
    constructor(parts: FormulaEvaluationTreeNode[], result: KodeValue);
    getDescription(): string;
}
export declare class EvaluatedExpression extends FormulaEvaluationTreeNode {
    readonly child: FormulaEvaluationTreeNode;
    constructor(child: FormulaEvaluationTreeNode, result: KodeValue);
    getDescription(): string;
}
export declare class EvaluatedFunctionCall extends FormulaEvaluationTreeNode {
    readonly args: FormulaEvaluationTreeNode[];
    readonly call: FunctionCall;
    constructor(call: FunctionCall, args: FormulaEvaluationTreeNode[], result: KodeValue);
    getDescription(): string;
}
export declare class EvaluatedBinaryOperation extends FormulaEvaluationTreeNode {
    readonly argA: FormulaEvaluationTreeNode;
    readonly argB: FormulaEvaluationTreeNode;
    readonly operation: BinaryOperation;
    constructor(operation: BinaryOperation, argA: FormulaEvaluationTreeNode, argB: FormulaEvaluationTreeNode, result: KodeValue);
    getDescription(): string;
}
export declare class EvaluatedUnaryOperation extends FormulaEvaluationTreeNode {
    readonly arg: FormulaEvaluationTreeNode;
    readonly operation: UnaryOperation;
    constructor(operation: UnaryOperation, arg: FormulaEvaluationTreeNode, result: KodeValue);
    getDescription(): string;
}
export declare class CouldNotBeEvaluated extends FormulaEvaluationTreeNode {
    constructor(result: KodeValue);
    getDescription(): string;
}
