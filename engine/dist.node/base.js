"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IFormulaStringParser = exports.ILexer = exports.ICharReader = exports.EvaluableSource = exports.Literal = exports.FormulaEvaluationTreeNode = exports.KodeValue = exports.Evaluable = exports.IKodeFunction = exports.IBinaryOperator = exports.IUnaryOperator = exports.IOperator = exports.FormulaToken = void 0;
/** Represents a token emited by the lexer. */
class FormulaToken {
    /** Get what this token should output in a plain text part. By default this returns the source text. */
    getPlainTextOutput() {
        return this.getSourceText();
    }
}
exports.FormulaToken = FormulaToken;
/** A base class for unary and binary kode operators. Requires operators to have a symbol. */
class IOperator {
}
exports.IOperator = IOperator;
/** Represents a kode unary operator. */
class IUnaryOperator extends IOperator {
}
exports.IUnaryOperator = IUnaryOperator;
/** Represents a kode binary operator. */
class IBinaryOperator extends IOperator {
}
exports.IBinaryOperator = IBinaryOperator;
/** Represents a kode function. */
class IKodeFunction {
}
exports.IKodeFunction = IKodeFunction;
/** Represents a part of a formula that can be evaluated. */
class Evaluable {
    /** Base constructor that sets the source of the evaluable. */
    constructor(source) {
        this.source = source;
    }
    getSourceText() {
        return this.source?.tokens.map(t => t.getSourceText()).toString();
    }
}
exports.Evaluable = Evaluable;
/** A concrete kode value. */
class KodeValue extends Evaluable {
    /**
     * Creates a kode value from a JS value.
     * - String values will be parsed as numbers if possible.
     * - Boolean values will be converted to numbers (0 and 1).
     * @param value The value to create the kode value from.
     * @param source Optionally, the source of this value.
     */
    constructor(value, source) {
        // pass the source to the Evaluable constructor
        super(source);
        if (typeof value === 'boolean') {
            // the value is a boolean, convert to 0 or 1
            this.numericValue = value ? 1 : 0;
            this.text = this.numericValue.toString();
            this.isNumeric = true;
        }
        else if (typeof value === 'string') {
            // the value is a string, try to parse as number
            this.text = value;
            this.numericValue = value?.trim() ? Number(value) : NaN; // Number('[empty or whitespace]') = 0, so an additional check is needed
            this.isNumeric = !isNaN(this.numericValue);
            // only set isI if it's true
            let isI = value.trim().toLowerCase() === 'i';
            if (isI)
                this.isI = true;
        }
        else if (typeof value === 'number') {
            // the value is a number
            this.numericValue = value;
            this.text = value.toString();
            this.isNumeric = true;
        }
        else {
            // the value is a KodeValue
            this.text = value.text;
            this.isNumeric = value.isNumeric;
            this.numericValue = value.numericValue;
        }
    }
    evaluate(evalCtx) {
        let result;
        if (evalCtx.iReplacement && this.isI)
            // we are currently replacing i with a different value 
            // and this value is i, return the replacement value
            result = evalCtx.iReplacement;
        else
            // return self by default
            result = this;
        if (evalCtx.buildEvaluationTree) {
            evalCtx.sideEffects.lastEvaluationTreeNode = new Literal(result);
        }
        return result;
    }
    /** Checks whether this value is equal to another value. */
    equals(other) {
        if (this.isNumeric && other.isNumeric)
            return this.numericValue == other.numericValue;
        else if (this.isNumeric || other.isNumeric)
            return false;
        else
            return this.text.trim().toLowerCase() == other.text.trim().toLowerCase();
    }
    static fromToken(token) {
        return new KodeValue(token.getValue(), new EvaluableSource(token));
    }
}
exports.KodeValue = KodeValue;
// #region moved here becuase circular dependency
class FormulaEvaluationTreeNode {
    constructor(result) {
        this.result = result;
    }
}
exports.FormulaEvaluationTreeNode = FormulaEvaluationTreeNode;
class Literal extends FormulaEvaluationTreeNode {
    constructor(value) {
        super(value);
    }
    getDescription() {
        return this.result.isNumeric ? 'numeric value' : 'value';
    }
}
exports.Literal = Literal;
// #endregion
/** A set of information tying an evaluable to a part of the formula source text and tokens. */
class EvaluableSource {
    constructor(...tokens) {
        this.tokens = tokens;
    }
    /** Gets the start index of the first source token. */
    getStartIndex() {
        if (this.tokens.length > 0)
            return this.tokens[0].getStartIndex();
        else
            throw new Error('Evaluable source contains no tokens.');
    }
    /** Gets the end index of the last source token. */
    getEndIndex() {
        if (this.tokens.length > 0)
            return this.tokens[this.tokens.length - 1].getEndIndex();
        else
            throw new Error('Evaluable source contains no tokens.');
    }
    static createByConcatenatingSources(evaluables) {
        let tokens = [];
        evaluables.forEach(ev => {
            if (Array.isArray(ev.source?.tokens)) {
                tokens.push(...ev.source.tokens);
            }
        });
        return new EvaluableSource(...tokens);
    }
}
exports.EvaluableSource = EvaluableSource;
/** Represents a forward-only character reader. */
class ICharReader {
}
exports.ICharReader = ICharReader;
/** Represents a forward-only formula token lexer. */
class ILexer {
}
exports.ILexer = ILexer;
/** Represents a parser that converts text into an evaluable {@link Formula}. */
class IFormulaStringParser {
}
exports.IFormulaStringParser = IFormulaStringParser;
//# sourceMappingURL=base.js.map