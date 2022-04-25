"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IFormulaStringParser = exports.ILexer = exports.ICharReader = exports.EvaluableSource = exports.KodeValue = exports.Evaluable = exports.IKodeFunction = exports.IBinaryOperator = exports.IUnaryOperator = exports.IOperator = exports.IFormulaToken = void 0;
/** Represents a token emited by the lexer. */
class IFormulaToken {
}
exports.IFormulaToken = IFormulaToken;
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
            this.numericValue = Number(value);
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
exports.KodeValue = KodeValue;
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