import { BinaryOperation, FunctionCall, KodeValue, UnaryOperation, Formula, Evaluable, Expression } from "../kodeine.js";
export declare class EvaluationStepReplacement {
    readonly startIndex: number;
    readonly sourceLength: number;
    readonly replacementText: string;
    constructor(evaluable: Evaluable, result: KodeValue);
}
/** Base class for all evaluation tree nodes. */
export declare abstract class FormulaEvaluationTreeNode {
    /** What evaluating this node resulted in. */
    readonly result: KodeValue;
    /** Constructs a {@link FormulaEvaluationTreeNode} with a given result. */
    constructor(result: KodeValue);
    /** A human-readable description of this node. */
    abstract getDescription(): string;
    /**
     * Adds step replacements to {@link replacements} for every child node of this node and for this node itself.
     * @param replacements An array to add the replacements to.
    */
    abstract addStepReplacementsTo(replacements: EvaluationStepReplacement[]): void;
}
/** A formula, what it evaluated to and nodes for its parts.  */
export declare class FormulaEvaluationTree extends FormulaEvaluationTreeNode {
    readonly formula: Formula;
    readonly parts: FormulaEvaluationTreeNode[];
    constructor(formula: Formula, parts: FormulaEvaluationTreeNode[], result: KodeValue);
    getDescription(): string;
    addStepReplacementsTo(replacements: EvaluationStepReplacement[]): void;
    private _replaceStringSection;
    printEvaluationSteps(): string;
}
/** An expression, what it evaluated to and a node for its child evaluable. */
export declare class EvaluatedExpression extends FormulaEvaluationTreeNode {
    readonly expression: Expression;
    readonly child: FormulaEvaluationTreeNode;
    constructor(expression: Expression, child: FormulaEvaluationTreeNode, result: KodeValue);
    getDescription(): string;
    addStepReplacementsTo(replacements: EvaluationStepReplacement[]): void;
}
/** A function call, what it evaluated to and nodes for its arguments. */
export declare class EvaluatedFunctionCall extends FormulaEvaluationTreeNode {
    readonly args: FormulaEvaluationTreeNode[];
    readonly call: FunctionCall;
    constructor(call: FunctionCall, args: FormulaEvaluationTreeNode[], result: KodeValue);
    getDescription(): string;
    addStepReplacementsTo(replacements: EvaluationStepReplacement[]): void;
}
/** A binary operation, what it evaluated to and nodes for its arguments. */
export declare class EvaluatedBinaryOperation extends FormulaEvaluationTreeNode {
    readonly operation: BinaryOperation;
    readonly argA: FormulaEvaluationTreeNode;
    readonly argB: FormulaEvaluationTreeNode;
    constructor(operation: BinaryOperation, argA: FormulaEvaluationTreeNode, argB: FormulaEvaluationTreeNode, result: KodeValue);
    getDescription(): string;
    addStepReplacementsTo(replacements: EvaluationStepReplacement[]): void;
}
/** A unary operation, what it evaluated to and a node for its argument. */
export declare class EvaluatedUnaryOperation extends FormulaEvaluationTreeNode {
    readonly operation: UnaryOperation;
    readonly arg: FormulaEvaluationTreeNode;
    constructor(operation: UnaryOperation, arg: FormulaEvaluationTreeNode, result: KodeValue);
    getDescription(): string;
    addStepReplacementsTo(replacements: EvaluationStepReplacement[]): void;
}
/** A node denoting that a replacement took place (for example `i` being replaced with a value in `fl()`). */
export declare class LiteralReplacement extends FormulaEvaluationTreeNode {
    readonly sourceLiteral: Literal;
    constructor(replacementValue: KodeValue, sourceLiteral: Literal);
    getDescription(): string;
    addStepReplacementsTo(replacements: EvaluationStepReplacement[]): void;
}
/** A leaf node denoting a literal value that didn't need to be evaluated. */
export declare class Literal extends FormulaEvaluationTreeNode {
    constructor(value: KodeValue);
    getDescription(): string;
    addStepReplacementsTo(replacements: EvaluationStepReplacement[]): void;
}
/** A node denoting that an evaluable could not be evaluated. */
export declare class CouldNotBeEvaluated extends FormulaEvaluationTreeNode {
    readonly evaluable: Evaluable;
    constructor(evaluable: Evaluable, result: KodeValue);
    getDescription(): string;
    addStepReplacementsTo(replacements: EvaluationStepReplacement[]): void;
}
