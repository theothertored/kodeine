import {
    KodeFunctionWithModes,
    BinaryOperation,
    FunctionCall,
    KodeValue,
    UnaryOperation
} from "../kodeine.js";

export abstract class FormulaEvaluationTreeNode {

    public readonly result: KodeValue;

    constructor(result: KodeValue) {
        this.result = result;
    }

    abstract getDescription(): string;

}

export class FormulaEvaluationTree extends FormulaEvaluationTreeNode {

    public readonly parts: FormulaEvaluationTreeNode[];

    constructor(parts: FormulaEvaluationTreeNode[], result: KodeValue) {
        super(result);
        this.parts = parts;
    }

    getDescription(): string {
        return 'formula'
    }

}

export class EvaluatedExpression extends FormulaEvaluationTreeNode {

    public readonly child: FormulaEvaluationTreeNode;

    constructor(child: FormulaEvaluationTreeNode, result: KodeValue) {
        super(result);
        this.child = child;
    }

    getDescription(): string {
        return 'expression';
    }

}

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

}

export class EvaluatedBinaryOperation extends FormulaEvaluationTreeNode {

    public readonly argA: FormulaEvaluationTreeNode;
    public readonly argB: FormulaEvaluationTreeNode;
    public readonly operation: BinaryOperation;

    constructor(operation: BinaryOperation, argA: FormulaEvaluationTreeNode, argB: FormulaEvaluationTreeNode, result: KodeValue) {
        super(result);
        this.operation = operation;
        this.argA = argA;
        this.argB = argB;
    }

    getDescription(): string {
        return `${this.operation.operator.getSymbol()} operator`;
    }

}

export class EvaluatedUnaryOperation extends FormulaEvaluationTreeNode {

    public readonly arg: FormulaEvaluationTreeNode;
    public readonly operation: UnaryOperation;

    constructor(operation: UnaryOperation, arg: FormulaEvaluationTreeNode, result: KodeValue) {
        super(result);
        this.operation = operation;
        this.arg = arg;
    }

    getDescription(): string {
        return `${this.operation.operator.getSymbol()} operator`;
    }

}

export class Literal extends FormulaEvaluationTreeNode {

    constructor(value: KodeValue) {
        super(value);
    }

    getDescription(): string {
        return this.result.isNumeric ? 'numeric value' : 'value';
    }

}

export class CouldNotBeEvaluated extends FormulaEvaluationTreeNode {

    constructor(result: KodeValue) {
        super(result);
    }

    getDescription(): string {
        return `evaluation failed`
    }

}
