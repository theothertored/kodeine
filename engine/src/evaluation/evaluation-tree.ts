import {
    KodeFunctionWithModes,
    BinaryOperation,
    FunctionCall,
    KodeValue,
    UnaryOperation,
    Formula,
    Evaluable,
    Expression
} from "../kodeine.js";

// the evaluation tree is a structure representing a single evaluation run.
// the leaves of the tree are literals, and every node is an object containing an evaluable and its evaluation result.

// example formula:
// $if(2 + 2 = 4, true, false)$

// evaluation tree:
// Formula -> true
// -  Expression -> true
// -  -  Function call "if()" -> true
// -  -  -  Operator "=" -> 1
// -  -  -  -  Operator "+" -> 4
// -  -  -  -  -  Literal "2"
// -  -  -  -  -  Literal "2"
// -  -  -  -  Literal "4"
// -  -  -  Literal "true"
// -  -  -  Literal "false"

export class EvaluationStepReplacement {

    public readonly startIndex: number;
    public readonly sourceLength: number;
    public readonly replacementText: string;

    constructor(evaluable: Evaluable, result: KodeValue) {
        this.startIndex = evaluable.source!.getStartIndex();
        this.sourceLength = evaluable.source!.getEndIndex() - this.startIndex;
        this.replacementText = result.isNumeric ? result.text : `"${result.text}"`;
    }

}

/** Base class for all evaluation tree nodes. */
export abstract class FormulaEvaluationTreeNode {

    /** What evaluating this node resulted in. */
    public readonly result: KodeValue;

    /** Constructs a {@link FormulaEvaluationTreeNode} with a given result. */
    constructor(result: KodeValue) {
        this.result = result;
    }

    /** A human-readable description of this node. */
    abstract getDescription(): string;

    /** 
     * Adds step replacements to {@link replacements} for every child node of this node and for this node itself. 
     * @param replacements An array to add the replacements to.
    */
    abstract addStepReplacementsTo(replacements: EvaluationStepReplacement[]): void;

}

/** A formula, what it evaluated to and nodes for its parts.  */
export class FormulaEvaluationTree extends FormulaEvaluationTreeNode {

    public readonly formula: Formula;
    public readonly parts: FormulaEvaluationTreeNode[];

    constructor(formula: Formula, parts: FormulaEvaluationTreeNode[], result: KodeValue) {
        super(result);
        this.formula = formula;
        this.parts = parts;
    }

    getDescription(): string {
        return 'formula'
    }

    addStepReplacementsTo(replacements: EvaluationStepReplacement[]) {

        for (const part of this.parts) {
            part.addStepReplacementsTo(replacements);
        }

        replacements.push(new EvaluationStepReplacement(this.formula, this.result));

    }

}

/** An expression, what it evaluated to and a node for its child evaluable. */
export class EvaluatedExpression extends FormulaEvaluationTreeNode {

    public readonly expression: Expression;
    public readonly child: FormulaEvaluationTreeNode;

    constructor(expression: Expression, child: FormulaEvaluationTreeNode, result: KodeValue) {
        super(result);
        this.expression = expression;
        this.child = child;
    }

    getDescription(): string {
        return 'expression';
    }

    addStepReplacementsTo(replacements: EvaluationStepReplacement[]): void {
        this.child.addStepReplacementsTo(replacements);
        replacements.push(new EvaluationStepReplacement(this.expression, this.result));
    }

}

/** A function call, what it evaluated to and nodes for its arguments. */
export class EvaluatedFunctionCall extends FormulaEvaluationTreeNode {

    public readonly args: FormulaEvaluationTreeNode[];
    public readonly call: FunctionCall;

    constructor(call: FunctionCall, args: FormulaEvaluationTreeNode[], result: KodeValue) {
        super(result);
        this.call = call;
        this.args = args;
    }

    getDescription(): string {

        if (this.call.func instanceof KodeFunctionWithModes) {

            return `${this.call.func.getName()}(${this.args[0]?.result.text}) call`

        } else {

            return `${this.call.func.getName()}() call`

        }

    }

    addStepReplacementsTo(replacements: EvaluationStepReplacement[]): void {
        this.args.forEach(a => a.addStepReplacementsTo(replacements));
        replacements.push(new EvaluationStepReplacement(this.call, this.result));
    }

}

/** A binary operation, what it evaluated to and nodes for its arguments. */
export class EvaluatedBinaryOperation extends FormulaEvaluationTreeNode {

    public readonly operation: BinaryOperation;
    public readonly argA: FormulaEvaluationTreeNode;
    public readonly argB: FormulaEvaluationTreeNode;

    constructor(operation: BinaryOperation, argA: FormulaEvaluationTreeNode, argB: FormulaEvaluationTreeNode, result: KodeValue) {
        super(result);
        this.operation = operation;
        this.argA = argA;
        this.argB = argB;
    }

    getDescription(): string {
        return `${this.operation.operator.getSymbol()} operator`;
    }

    addStepReplacementsTo(replacements: EvaluationStepReplacement[]): void {
        this.argA.addStepReplacementsTo(replacements);
        this.argB.addStepReplacementsTo(replacements);
        replacements.push(new EvaluationStepReplacement(this.operation, this.result));
    }

}

/** A unary operation, what it evaluated to and a node for its argument. */
export class EvaluatedUnaryOperation extends FormulaEvaluationTreeNode {

    public readonly operation: UnaryOperation;
    public readonly arg: FormulaEvaluationTreeNode;

    constructor(operation: UnaryOperation, arg: FormulaEvaluationTreeNode, result: KodeValue) {
        super(result);
        this.operation = operation;
        this.arg = arg;
    }

    getDescription(): string {
        return `${this.operation.operator.getSymbol()} operator`;
    }

    addStepReplacementsTo(replacements: EvaluationStepReplacement[]): void {
        this.arg.addStepReplacementsTo(replacements);
        replacements.push(new EvaluationStepReplacement(this.operation, this.result));
    }

}

/** A node denoting that a replacement took place (for example `i` being replaced with a value in `fl()`). */
export class LiteralReplacement extends FormulaEvaluationTreeNode {

    public readonly sourceLiteral: Literal;

    constructor(replacementValue: KodeValue, sourceLiteral: Literal) {
        super(replacementValue);
        this.sourceLiteral = sourceLiteral;
    }

    getDescription(): string {
        return `value replacement`;
    }

    addStepReplacementsTo(replacements: EvaluationStepReplacement[]): void {
        replacements.push(new EvaluationStepReplacement(this.sourceLiteral.result, this.result));
    }

}

/** A leaf node denoting a literal value that didn't need to be evaluated. */
export class Literal extends FormulaEvaluationTreeNode {

    constructor(value: KodeValue) {
        super(value);
    }

    getDescription(): string {
        return this.result.isNumeric ? 'numeric value' : 'value';
    }

    addStepReplacementsTo(replacements: EvaluationStepReplacement[]): void {
        // literals don't replace anything    
    }

}

/** A node denoting that an evaluable could not be evaluated. */
export class CouldNotBeEvaluated extends FormulaEvaluationTreeNode {
    
    public readonly evaluable: Evaluable;

    constructor(evaluable: Evaluable, result: KodeValue) {
        super(result);
        this.evaluable = evaluable;
    }

    getDescription(): string {
        return `evaluation failed`
    }

    addStepReplacementsTo(replacements: EvaluationStepReplacement[]): void {
        replacements.push(new EvaluationStepReplacement(this.evaluable, this.result));
    }

}
