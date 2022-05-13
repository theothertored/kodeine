"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouldNotBeEvaluated = exports.Literal = exports.LiteralReplacement = exports.EvaluatedUnaryOperation = exports.EvaluatedBinaryOperation = exports.EvaluatedFunctionCall = exports.EvaluatedExpression = exports.FormulaEvaluationTree = exports.FormulaEvaluationTreeNode = exports.EvaluationStepReplacement = void 0;
const kodeine_js_1 = require("../kodeine.js");
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
class EvaluationStepReplacement {
    constructor(evaluable, result) {
        this.startIndex = evaluable.source.getStartIndex();
        this.sourceLength = evaluable.source.getEndIndex() - this.startIndex;
        if (result instanceof kodeine_js_1.KodeValue)
            this.replacementText = result.isNumeric ? result.text : `"${result.text}"`;
        else
            this.replacementText = result;
    }
}
exports.EvaluationStepReplacement = EvaluationStepReplacement;
/** Base class for all evaluation tree nodes. */
class FormulaEvaluationTreeNode {
    /** Constructs a {@link FormulaEvaluationTreeNode} with a given result. */
    constructor(result) {
        this.result = result;
    }
}
exports.FormulaEvaluationTreeNode = FormulaEvaluationTreeNode;
/** A formula, what it evaluated to and nodes for its parts.  */
class FormulaEvaluationTree extends FormulaEvaluationTreeNode {
    constructor(formula, parts, result) {
        super(result);
        this.formula = formula;
        this.parts = parts;
    }
    getDescription() {
        return 'formula';
    }
    addStepReplacementsTo(replacements) {
        for (const part of this.parts) {
            part.addStepReplacementsTo(replacements);
        }
        replacements.push(new EvaluationStepReplacement(this.formula, this.result.text));
    }
    _replaceStringSection(original, start, length, insertion) {
        let beforeReplacement = original.substring(0, start);
        let afterReplacement = original.substring(start + length);
        return `${beforeReplacement}${insertion}${afterReplacement}`;
    }
    printEvaluationSteps() {
        // get source text replacements for evaluation steps
        let stepReplacements = [];
        this.addStepReplacementsTo(stepReplacements);
        let originalText = this.formula.getSourceText();
        let output = `-- formula text --\n\n${originalText}`;
        let lastStepText = originalText;
        let changes = [];
        for (let i = 0; i < stepReplacements.length; i++) {
            const replacement = stepReplacements[i];
            // each Change is an EvaluationStepReplacement adjusted with regard to previous Changes
            //
            // 1. if the EvaluationStepReplacement replaces a section before the Change, the Change's start has to be offset
            //      Example - when the Change replaces a function argument, when a previous argument has already been replaced:
            //      fn(2 + 2, 3 + 3)    original
            //      fn(4, 3 + 3)        1st change (2 + 2 -> 4) replacementLength = 1, source = relative = { start: 3, length: 5 }
            //      fn(4, 6)            2nd change (3 + 3 -> 6) replacementLength = 1, source = { start: 10, length: 5 }, relative = { start: 6, length: 5 }
            //      10                  3rd change (fn(4, 6) -> 10) replacementLength = 2, source = { start: 0, length: 16 }, relative = { start: 0, length: 8 }
            //      
            // 2. if the EvaluationStepReplacement replaces a section inside the Change, the Change's length has to change
            //      Example - when the Change replaces a function call, when its arguments were already replaced
            //      fn(2 + 2)           original
            //      fn(4)               1st change (2 + 2 -> 4) replacementLength = 1, source = relative = { start: 3, length: 5 }
            //      8                   2nd change (fn(4) -> 8) replacementLength = 1, source = { start: 0, length: 9 }, relative = { start: 0, length: 5 }
            //
            // 3. if the EvaluationStepReplacement replaces a section after the Change, the Change is not affected.
            let change = {
                source: {
                    start: replacement.startIndex,
                    length: replacement.sourceLength
                },
                relative: {
                    start: replacement.startIndex,
                    length: replacement.sourceLength
                },
                replacementLength: replacement.replacementText.length
            };
            for (let j = 0; j < changes.length; j++) {
                const prevChange = changes[j];
                if (prevChange.source.start + prevChange.source.length <= change.source.start) {
                    // case 1
                    change.relative.start = change.relative.start - prevChange.relative.length + prevChange.replacementLength;
                }
                else if (prevChange.source.start >= change.source.start && prevChange.source.start + prevChange.source.length <= change.source.start + change.source.length) {
                    // case 2
                    change.relative.length = change.relative.length - prevChange.relative.length + prevChange.replacementLength;
                }
                else {
                    // case 3 - do nothing
                }
            }
            let replacing = lastStepText.substring(change.relative.start, change.relative.start + change.relative.length);
            lastStepText = this._replaceStringSection(lastStepText, change.relative.start, change.relative.length, replacement.replacementText);
            output += `\n\n-- step ${i + 1} --\n\n${lastStepText}`;
            changes.push(change);
        }
        output += `\n\n-- result --\n\n${this.result.text}`;
        return output;
    }
}
exports.FormulaEvaluationTree = FormulaEvaluationTree;
/** An expression, what it evaluated to and a node for its child evaluable. */
class EvaluatedExpression extends FormulaEvaluationTreeNode {
    constructor(expression, child, result) {
        super(result);
        this.expression = expression;
        this.child = child;
    }
    getDescription() {
        return 'expression';
    }
    addStepReplacementsTo(replacements) {
        this.child.addStepReplacementsTo(replacements);
        // don't add evaluable part root expressions to steps since they look weird
        // yea it's a janky solution but it works
        if (!(this.expression.source.tokens[0] instanceof kodeine_js_1.DollarSignToken)) {
            replacements.push(new EvaluationStepReplacement(this.expression, this.result));
        }
    }
}
exports.EvaluatedExpression = EvaluatedExpression;
/** A function call, what it evaluated to and nodes for its arguments. */
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
    addStepReplacementsTo(replacements) {
        this.args.forEach(a => a.addStepReplacementsTo(replacements));
        replacements.push(new EvaluationStepReplacement(this.call, this.result));
    }
}
exports.EvaluatedFunctionCall = EvaluatedFunctionCall;
/** A binary operation, what it evaluated to and nodes for its arguments. */
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
    addStepReplacementsTo(replacements) {
        this.argA.addStepReplacementsTo(replacements);
        this.argB.addStepReplacementsTo(replacements);
        replacements.push(new EvaluationStepReplacement(this.operation, this.result));
    }
}
exports.EvaluatedBinaryOperation = EvaluatedBinaryOperation;
/** A unary operation, what it evaluated to and a node for its argument. */
class EvaluatedUnaryOperation extends FormulaEvaluationTreeNode {
    constructor(operation, arg, result) {
        super(result);
        this.operation = operation;
        this.arg = arg;
    }
    getDescription() {
        return `${this.operation.operator.getSymbol()} operator`;
    }
    addStepReplacementsTo(replacements) {
        this.arg.addStepReplacementsTo(replacements);
        replacements.push(new EvaluationStepReplacement(this.operation, this.result));
    }
}
exports.EvaluatedUnaryOperation = EvaluatedUnaryOperation;
/** A node denoting that a replacement took place (for example `i` being replaced with a value in `fl()`). */
class LiteralReplacement extends FormulaEvaluationTreeNode {
    constructor(replacementValue, sourceLiteral) {
        super(replacementValue);
        this.sourceLiteral = sourceLiteral;
    }
    getDescription() {
        return `value replacement`;
    }
    addStepReplacementsTo(replacements) {
        replacements.push(new EvaluationStepReplacement(this.sourceLiteral.result, this.result));
    }
}
exports.LiteralReplacement = LiteralReplacement;
/** A leaf node denoting a literal value that didn't need to be evaluated. */
class Literal extends FormulaEvaluationTreeNode {
    constructor(value) {
        super(value);
    }
    getDescription() {
        return this.result.isNumeric ? 'numeric value' : 'value';
    }
    addStepReplacementsTo(replacements) {
        // literals don't replace anything    
    }
}
exports.Literal = Literal;
/** A node denoting that an evaluable could not be evaluated. */
class CouldNotBeEvaluated extends FormulaEvaluationTreeNode {
    constructor(evaluable, result) {
        super(result);
        this.evaluable = evaluable;
    }
    getDescription() {
        return `evaluation failed`;
    }
    addStepReplacementsTo(replacements) {
        replacements.push(new EvaluationStepReplacement(this.evaluable, this.result));
    }
}
exports.CouldNotBeEvaluated = CouldNotBeEvaluated;
//# sourceMappingURL=evaluation-tree.js.map