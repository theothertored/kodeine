import { BinaryOperation, FunctionCall, KodeValue, UnaryOperation, Formula } from "../kodeine.js";
/** Base class for all evaluation tree nodes. */
export declare abstract class FormulaEvaluationTreeNode {
    /** What evaluating this node resulted in. */
    readonly result: KodeValue;
    /** Constructs a {@link FormulaEvaluationTreeNode} with a given result. */
    constructor(result: KodeValue);
    /** A human-readable description of this node. */
    abstract getDescription(): string;
}
/** A formula, what it evaluated to and nodes for its parts.  */
export declare class FormulaEvaluationTree extends FormulaEvaluationTreeNode {
    readonly formula: Formula;
    readonly parts: FormulaEvaluationTreeNode[];
    constructor(formula: Formula, parts: FormulaEvaluationTreeNode[], result: KodeValue);
    getDescription(): string;
}
/** An expression, what it evaluated to and a node for its child evaluable. */
export declare class EvaluatedExpression extends FormulaEvaluationTreeNode {
    readonly child: FormulaEvaluationTreeNode;
    constructor(child: FormulaEvaluationTreeNode, result: KodeValue);
    getDescription(): string;
}
/** A function call, what it evaluated to and nodes for its arguments. */
export declare class EvaluatedFunctionCall extends FormulaEvaluationTreeNode {
    readonly args: FormulaEvaluationTreeNode[];
    readonly call: FunctionCall;
    constructor(call: FunctionCall, args: FormulaEvaluationTreeNode[], result: KodeValue);
    getDescription(): string;
}
/** A binary operation, what it evaluated to and nodes for its arguments. */
export declare class EvaluatedBinaryOperation extends FormulaEvaluationTreeNode {
    readonly operation: BinaryOperation;
    readonly argA: FormulaEvaluationTreeNode;
    readonly argB: FormulaEvaluationTreeNode;
    constructor(operation: BinaryOperation, argA: FormulaEvaluationTreeNode, argB: FormulaEvaluationTreeNode, result: KodeValue);
    getDescription(): string;
}
/** A unary operation, what it evaluated to and a node for its argument. */
export declare class EvaluatedUnaryOperation extends FormulaEvaluationTreeNode {
    readonly arg: FormulaEvaluationTreeNode;
    readonly operation: UnaryOperation;
    constructor(operation: UnaryOperation, arg: FormulaEvaluationTreeNode, result: KodeValue);
    getDescription(): string;
}
/** A node denoting that a replacement took place (for example `i` being replaced with a value in `fl()`). */
export declare class LiteralReplacement extends FormulaEvaluationTreeNode {
    readonly sourceLiteral: Literal;
    constructor(replacementValue: KodeValue, sourceLiteral: Literal);
    getDescription(): string;
}
/** A leaf node denoting a literal value that didn't need to be evaluated. */
export declare class Literal extends FormulaEvaluationTreeNode {
    constructor(value: KodeValue);
    getDescription(): string;
}
/** A node denoting that an evaluable could not be evaluated. */
export declare class CouldNotBeEvaluated extends FormulaEvaluationTreeNode {
    constructor(result: KodeValue);
    getDescription(): string;
}
