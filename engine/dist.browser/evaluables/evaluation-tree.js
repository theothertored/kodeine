import { FormulaEvaluationTreeNode } from "../base.js";
import { FunctionWithModes } from "../implementations/functions/kode-function-with-modes.js";
export class FormulaEvaluationTree extends FormulaEvaluationTreeNode {
    constructor(parts, result) {
        super(result);
        this.parts = parts;
    }
    getDescription() {
        return 'formula';
    }
}
export class EvaluatedExpression extends FormulaEvaluationTreeNode {
    constructor(child, result) {
        super(result);
        this.child = child;
    }
    getDescription() {
        return 'expression';
    }
}
export class EvaluatedFunctionCall extends FormulaEvaluationTreeNode {
    constructor(call, args, result) {
        super(result);
        this.call = call;
        this.args = args;
    }
    getDescription() {
        var _a;
        if (this.call.func instanceof FunctionWithModes) {
            return `${this.call.func.getName()}(${(_a = this.args[0]) === null || _a === void 0 ? void 0 : _a.result.text}) call`;
        }
        else {
            return `${this.call.func.getName()}() call`;
        }
    }
}
export class EvaluatedBinaryOperation extends FormulaEvaluationTreeNode {
    constructor(operation, argA, argB, result) {
        super(result);
        this.operation = operation;
        this.argA = argA;
        this.argB = argB;
    }
    getDescription() {
        return `${this.operation.operator.getSymbol()} operator`;
    }
}
export class EvaluatedUnaryOperation extends FormulaEvaluationTreeNode {
    constructor(operation, arg, result) {
        super(result);
        this.operation = operation;
        this.arg = arg;
    }
    getDescription() {
        return `${this.operation.operator.getSymbol()} operator`;
    }
}
export class CouldNotBeEvaluated extends FormulaEvaluationTreeNode {
    constructor(result) {
        super(result);
    }
    getDescription() {
        return `evaluation failed`;
    }
}
//# sourceMappingURL=evaluation-tree.js.map