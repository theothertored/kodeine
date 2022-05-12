"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouldNotBeEvaluated = exports.Literal = exports.EvaluatedUnaryOperation = exports.EvaluatedBinaryOperation = exports.EvaluatedFunctionCall = exports.EvaluatedExpression = exports.FormulaEvaluationTree = exports.FormulaEvaluationTreeNode = void 0;
const kodeine_js_1 = require("../kodeine.js");
class FormulaEvaluationTreeNode {
    constructor(result) {
        this.result = result;
    }
}
exports.FormulaEvaluationTreeNode = FormulaEvaluationTreeNode;
class FormulaEvaluationTree extends FormulaEvaluationTreeNode {
    constructor(parts, result) {
        super(result);
        this.parts = parts;
    }
    getDescription() {
        return 'formula';
    }
}
exports.FormulaEvaluationTree = FormulaEvaluationTree;
class EvaluatedExpression extends FormulaEvaluationTreeNode {
    constructor(child, result) {
        super(result);
        this.child = child;
    }
    getDescription() {
        return 'expression';
    }
}
exports.EvaluatedExpression = EvaluatedExpression;
class EvaluatedFunctionCall extends FormulaEvaluationTreeNode {
    constructor(call, args, result) {
        super(result);
        this.call = call;
        this.args = args;
    }
    getDescription() {
        if (this.call.func instanceof kodeine_js_1.KodeFunctionWithModes) {
            return `${this.call.func.getName()}(${this.args[0]?.result.text}) call`;
        }
        else {
            return `${this.call.func.getName()}() call`;
        }
    }
}
exports.EvaluatedFunctionCall = EvaluatedFunctionCall;
class EvaluatedBinaryOperation extends FormulaEvaluationTreeNode {
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
exports.EvaluatedBinaryOperation = EvaluatedBinaryOperation;
class EvaluatedUnaryOperation extends FormulaEvaluationTreeNode {
    constructor(operation, arg, result) {
        super(result);
        this.operation = operation;
        this.arg = arg;
    }
    getDescription() {
        return `${this.operation.operator.getSymbol()} operator`;
    }
}
exports.EvaluatedUnaryOperation = EvaluatedUnaryOperation;
class Literal extends FormulaEvaluationTreeNode {
    constructor(value) {
        super(value);
    }
    getDescription() {
        return this.result.isNumeric ? 'numeric value' : 'value';
    }
}
exports.Literal = Literal;
class CouldNotBeEvaluated extends FormulaEvaluationTreeNode {
    constructor(result) {
        super(result);
    }
    getDescription() {
        return `evaluation failed`;
    }
}
exports.CouldNotBeEvaluated = CouldNotBeEvaluated;
//# sourceMappingURL=evaluation-tree.js.map