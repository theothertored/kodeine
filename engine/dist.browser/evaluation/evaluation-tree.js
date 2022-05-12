import { KodeFunctionWithModes } from "../kodeine.js";
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
/** Base class for all evaluation tree nodes. */
export class FormulaEvaluationTreeNode {
    /** Constructs a {@link FormulaEvaluationTreeNode} with a given result. */
    constructor(result) {
        this.result = result;
    }
}
/** A formula, what it evaluated to and nodes for its parts.  */
export class FormulaEvaluationTree extends FormulaEvaluationTreeNode {
    constructor(formula, parts, result) {
        super(result);
        this.formula = formula;
        this.parts = parts;
    }
    getDescription() {
        return 'formula';
    }
}
/** An expression, what it evaluated to and a node for its child evaluable. */
export class EvaluatedExpression extends FormulaEvaluationTreeNode {
    constructor(child, result) {
        super(result);
        this.child = child;
    }
    getDescription() {
        return 'expression';
    }
}
/** A function call, what it evaluated to and nodes for its arguments. */
export class EvaluatedFunctionCall extends FormulaEvaluationTreeNode {
    constructor(call, args, result) {
        super(result);
        this.call = call;
        this.args = args;
    }
    getDescription() {
        var _a;
        if (this.call.func instanceof KodeFunctionWithModes) {
            return `${this.call.func.getName()}(${(_a = this.args[0]) === null || _a === void 0 ? void 0 : _a.result.text}) call`;
        }
        else {
            return `${this.call.func.getName()}() call`;
        }
    }
}
/** A binary operation, what it evaluated to and nodes for its arguments. */
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
/** A unary operation, what it evaluated to and a node for its argument. */
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
/** A node denoting that a replacement took place (for example `i` being replaced with a value in `fl()`). */
export class LiteralReplacement extends FormulaEvaluationTreeNode {
    constructor(replacementValue, sourceLiteral) {
        super(replacementValue);
        this.sourceLiteral = sourceLiteral;
    }
    getDescription() {
        return `value replacement`;
    }
}
/** A leaf node denoting a literal value that didn't need to be evaluated. */
export class Literal extends FormulaEvaluationTreeNode {
    constructor(value) {
        super(value);
    }
    getDescription() {
        return this.result.isNumeric ? 'numeric value' : 'value';
    }
}
/** A node denoting that an evaluable could not be evaluated. */
export class CouldNotBeEvaluated extends FormulaEvaluationTreeNode {
    constructor(result) {
        super(result);
    }
    getDescription() {
        return `evaluation failed`;
    }
}
//# sourceMappingURL=evaluation-tree.js.map