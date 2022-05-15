import {
    KodeFunctionWithModes,
    BinaryOperation,
    FunctionCall,
    KodeValue,
    UnaryOperation,
    Formula,
    Evaluable,
    Expression,
    DollarSignToken
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

    constructor(evaluable: Evaluable, result: KodeValue | string) {
        this.startIndex = evaluable.source!.getStartIndex();
        this.sourceLength = evaluable.source!.getEndIndex() - this.startIndex;

        if (result instanceof KodeValue)
            this.replacementText = result.isNumeric ? result.toOutputString() : `"${result.toOutputString()}"`;
        else
            this.replacementText = result;
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

        replacements.push(new EvaluationStepReplacement(this.formula, this.result.toOutputString()));

    }

    private _replaceStringSection(original: string, start: number, length: number, insertion: string): string {

        let beforeReplacement = original.substring(0, start);
        let afterReplacement = original.substring(start + length);
        return `${beforeReplacement}${insertion}${afterReplacement}`;

    }

    printEvaluationSteps(): string {

        type Range = { start: number, length: number };
        type Change = { source: Range, relative: Range, replacementLength: number };

        // get source text replacements for evaluation steps
        let stepReplacements: EvaluationStepReplacement[] = [];
        this.addStepReplacementsTo(stepReplacements);

        let originalText = this.formula.getSourceText();
        let output = `-- formula text --\n\n${originalText}`;

        let lastStepText = originalText;
        let changes: Change[] = [];

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

            let change: Change = {
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

                } else if (prevChange.source.start >= change.source.start && prevChange.source.start + prevChange.source.length <= change.source.start + change.source.length) {

                    // case 2
                    change.relative.length = change.relative.length - prevChange.relative.length + prevChange.replacementLength;

                } else {

                    // case 3 - do nothing

                }

            }

            let replacing = lastStepText.substring(change.relative.start, change.relative.start + change.relative.length);

            lastStepText = this._replaceStringSection(lastStepText, change.relative.start, change.relative.length, replacement.replacementText);
            output += `\n\n-- step ${i + 1} --\n\n${lastStepText}`;

            changes.push(change);
        }

        output += `\n\n-- result --\n\n${this.result.toOutputString()}`;

        return output;

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

        // don't add evaluable part root expressions to steps since they look weird
        // yea it's a janky solution but it works
        if (!(this.expression.source!.tokens[0] instanceof DollarSignToken)) {
            replacements.push(new EvaluationStepReplacement(this.expression, this.result));
        }
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

            return `${this.call.func.getName()}(${this.args[0]?.result.toOutputString()}) call`

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
