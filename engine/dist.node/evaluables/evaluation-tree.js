"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouldNotBeEvaluated = exports.EvaluatedUnaryOperation = exports.EvaluatedBinaryOperation = exports.EvaluatedFunctionCall = exports.EvaluatedExpression = exports.FormulaEvaluationTree = void 0;
const base_js_1 = require("../base.js");
const kode_function_with_modes_js_1 = require("../implementations/functions/kode-function-with-modes.js");
class FormulaEvaluationTree extends base_js_1.FormulaEvaluationTreeNode {
    constructor(parts, result) {
        super(result);
        this.parts = parts;
    }
    getDescription() {
        return 'formula';
    }
}
exports.FormulaEvaluationTree = FormulaEvaluationTree;
class EvaluatedExpression extends base_js_1.FormulaEvaluationTreeNode {
    constructor(child, result) {
        super(result);
        this.child = child;
    }
    getDescription() {
        return 'expression';
    }
}
exports.EvaluatedExpression = EvaluatedExpression;
class EvaluatedFunctionCall extends base_js_1.FormulaEvaluationTreeNode {
    constructor(call, args, result) {
        super(result);
        this.call = call;
        this.args = args;
    }
    getDescription() {
        if (this.call.func instanceof kode_function_with_modes_js_1.FunctionWithModes) {
            return `${this.call.func.getName()}(${this.args[0]?.result.text}) call`;
        }
        else {
            return `${this.call.func.getName()}() call`;
        }
    }
}
exports.EvaluatedFunctionCall = EvaluatedFunctionCall;
class EvaluatedBinaryOperation extends base_js_1.FormulaEvaluationTreeNode {
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
class EvaluatedUnaryOperation extends base_js_1.FormulaEvaluationTreeNode {
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
class CouldNotBeEvaluated extends base_js_1.FormulaEvaluationTreeNode {
    constructor(result) {
        super(result);
    }
    getDescription() {
        return `evaluation failed`;
    }
}
exports.CouldNotBeEvaluated = CouldNotBeEvaluated;
//# sourceMappingURL=evaluation-tree.js.map