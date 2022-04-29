/** Represents a token emited by the lexer. */
export class FormulaToken {
    /** Get what this token should output in a plain text part. By default this returns the source text. */
    getPlainTextOutput() {
        return this.getSourceText();
    }
}
/** A base class for unary and binary kode operators. Requires operators to have a symbol. */
export class IOperator {
}
/** Represents a kode unary operator. */
export class IUnaryOperator extends IOperator {
}
/** Represents a kode binary operator. */
export class IBinaryOperator extends IOperator {
}
/** Represents a kode function. */
export class IKodeFunction {
}
/** Represents a part of a formula that can be evaluated. */
export class Evaluable {
    /** Base constructor that sets the source of the evaluable. */
    constructor(source) {
        this.source = source;
    }
}
/** A concrete kode value. */
export class KodeValue extends Evaluable {
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
            this.numericValue = (value === null || value === void 0 ? void 0 : value.trim()) ? Number(value) : NaN; // Number('[empty or whitespace]') = 0, so an additional check is needed
            this.isNumeric = !isNaN(this.numericValue);
        }
        else if (typeof value === 'number') {
            // the value is a number
            this.numericValue = value;
            this.text = value.toString();
            this.isNumeric = true;
        }
        else {
            this.text = value.text;
            this.isNumeric = value.isNumeric;
            this.numericValue = value.numericValue;
        }
    }
    evaluate(evalCtx) {
        return this;
    }
    static fromToken(token) {
        return new KodeValue(token.getValue(), new EvaluableSource(token));
    }
}
/** A set of information tying an evaluable to a part of the formula source text and tokens. */
export class EvaluableSource {
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
            var _a;
            if (Array.isArray((_a = ev.source) === null || _a === void 0 ? void 0 : _a.tokens)) {
                tokens.push(...ev.source.tokens);
            }
        });
        return new EvaluableSource(...tokens);
    }
}
/** Represents a forward-only character reader. */
export class ICharReader {
}
/** Represents a forward-only formula token lexer. */
export class ILexer {
}
/** Represents a parser that converts text into an evaluable {@link Formula}. */
export class IFormulaStringParser {
}
//# sourceMappingURL=base.js.map