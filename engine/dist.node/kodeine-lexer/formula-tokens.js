"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperatorToken = exports.UnquotedValueToken = exports.QuotedValueToken = exports.UnclosedQuotedValueToken = exports.CommaToken = exports.ClosingParenthesisToken = exports.OpeningParenthesisToken = exports.WhitespaceToken = exports.DollarSignToken = exports.EscapedDollarSignToken = exports.PlainTextToken = exports.SimpleToken = void 0;
const base_js_1 = require("../base.js");
/** A base class for simple tokens extracted from a formula source text. */
class SimpleToken {
    /**
     * Constructs a base token using a piece of the formula source text and its start index.
     * @param text The piece of the formula source text this token represents.
     * @param startIndex The start index of the piece in the formula source text.
     */
    constructor(text, startIndex) {
        this._text = text;
        this._startIndex = startIndex;
    }
    /** Returns the source text of this token. */
    getSourceText() {
        return this._text;
    }
    /** Returns the index of the first character of this token in the formula source text. */
    getStartIndex() {
        return this._startIndex;
    }
    /** Returns the index of the first character after this token in the formula source text. */
    getEndIndex() {
        return this._startIndex + this._text.length;
    }
}
exports.SimpleToken = SimpleToken;
/** A token containing plain text (formula text not wrapped in dollar signs). */
class PlainTextToken extends SimpleToken {
    /**
     * Constructs a plain text token using a piece of the formula source text and its start index.
     * @param text The piece of the formula source text this token represents.
     * @param startIndex The start index of the piece in the formula source text.
     */
    constructor(text, startIndex) {
        super(text, startIndex);
    }
    getName() { return 'plain text'; }
}
exports.PlainTextToken = PlainTextToken;
/**
 * A token representing two consecutive dollar signs ($$) within a plain text part of a formula.
 * Treated like a single plain text dollar sign ($).
 */
class EscapedDollarSignToken extends SimpleToken {
    /**
     * Constructs an escaped dollar sign token at a given position in the formula source text.
     * @param startIndex The start index of the token in the formula source text.
     */
    constructor(startIndex) {
        super('$$', startIndex);
    }
    getName() { return 'escaped dollar sign'; }
}
exports.EscapedDollarSignToken = EscapedDollarSignToken;
/**
 * A token representing a dollar sign ($) that is not followed by another dollar sign.
 * Indicates the beginning or end of an evaluated part of a formula.
 */
class DollarSignToken extends SimpleToken {
    /**
     * Constructs a dollar sign token at a given position in the formula source text.
     * @param startIndex The start index of the token in the formula source text.
     */
    constructor(startIndex) {
        super('$', startIndex);
    }
    getName() { return 'dollar sign'; }
}
exports.DollarSignToken = DollarSignToken;
/** A token representing one or more consecutive whitespace characters within an evaluated part of a formula. */
class WhitespaceToken extends SimpleToken {
    /**
     * Constructs a whitespace token using a piece of the formula source text and its start index.
     * @param text The piece of the formula source text this token represents.
     * @param startIndex The start index of the piece in the formula source text.
     */
    constructor(text, startIndex) {
        super(text, startIndex);
    }
    getName() { return 'whitespace'; }
}
exports.WhitespaceToken = WhitespaceToken;
/**
 * A token representing an opening parenthesis within an evaluated part of a formula.
 * Indicates the beginning of a subexpression, or the beginning of a function call, if preceded by an unquoted value token.
 */
class OpeningParenthesisToken extends SimpleToken {
    /**
     * Constructs an opening parenthesis token at a given position in the formula source text.
     * @param startIndex The start index of the token in the formula source text.
     */
    constructor(startIndex) {
        super('(', startIndex);
    }
    getName() { return 'opening parenthesis'; }
}
exports.OpeningParenthesisToken = OpeningParenthesisToken;
/**
 * A token representing a closing parenthesis within an evaluated part of a formula.
 * Indicates the end of the current subexpression or function call.
 */
class ClosingParenthesisToken extends SimpleToken {
    /**
     * Constructs a closing parenthesis token at a given position in the formula source text.
     * @param startIndex The start index of the token in the formula source text.
     */
    constructor(startIndex) {
        super(')', startIndex);
    }
    getName() { return 'closing parenthesis'; }
}
exports.ClosingParenthesisToken = ClosingParenthesisToken;
/**
 * A token representing a comma within an evaluated part of a formula.
 * Indicates the end of the current function call argument.
 */
class CommaToken extends SimpleToken {
    /**
     * Constructs a comma token at a given position in the formula source text.
     * @param startIndex The start index of the token in the formula source text.
     */
    constructor(startIndex) {
        super(',', startIndex);
    }
    getName() { return 'comma'; }
}
exports.CommaToken = CommaToken;
/**
 * A token representing a quotation mark within an evaluated part of a formula that was not closed.
 * Encountering this token causes the tokens read since the start of the evaluated part of the formula to be printed as plain text.
 */
class UnclosedQuotedValueToken extends base_js_1.IFormulaToken {
    /**
     * Constructs an unclosed quoted value token using a piece of the formula source text following an opening quotation mark
     * and the index of the quotation mark in the formula source text.
     * @param textFollowingQuotationMark The piece of the formula source text following the opening quotation mark.
     * @param quotationMarkIndex The index of the opening quotation mark in the formula source text.
     */
    constructor(textFollowingQuotationMark, quotationMarkIndex) {
        super();
        this._textFollowingQuotationMark = textFollowingQuotationMark;
        this._quotationMarkIndex = quotationMarkIndex;
    }
    getStartIndex() {
        return this._quotationMarkIndex;
    }
    getEndIndex() {
        return this._quotationMarkIndex + 1 + this._textFollowingQuotationMark.length;
    }
    getSourceText() { return `"${this._textFollowingQuotationMark}`; }
    getName() { return 'unclosed quoted value'; }
}
exports.UnclosedQuotedValueToken = UnclosedQuotedValueToken;
/** A token representing a quoted value within an evaluated part of a formula. */
class QuotedValueToken extends base_js_1.IFormulaToken {
    /**
     * Constructs a quoted value token using its inner text and the index of the opening quotation mark.
     * @param valueText The text between the quotation marks.
     * @param openingQuotationMarkIndex The index of the opening quotation mark in the formula source text.
     */
    constructor(valueText, openingQuotationMarkIndex) {
        super();
        this._innerText = valueText;
        this._openingQuotationMarkIndex = openingQuotationMarkIndex;
    }
    /** The string value of this token. */
    getValue() {
        return this._innerText;
    }
    getStartIndex() {
        return this._openingQuotationMarkIndex;
    }
    getEndIndex() {
        return this._openingQuotationMarkIndex + 1 + this._innerText.length + 1;
    }
    getSourceText() { return `"${this._innerText}"`; }
    getName() { return 'quoted value'; }
}
exports.QuotedValueToken = QuotedValueToken;
/** A token representing an unquoted value within an evaluated part of a formula. */
class UnquotedValueToken extends SimpleToken {
    constructor(text, startIndex) {
        super(text, startIndex);
    }
    /** The string value of this token. */
    getValue() {
        return this._text;
    }
    getName() { return 'unquoted value'; }
}
exports.UnquotedValueToken = UnquotedValueToken;
/** A token representing an operator within an evaluated part of a formula. */
class OperatorToken extends SimpleToken {
    /**
     * Constructs an operator token from its symbol and the starting index of the symbol in the formula source text.
     * @param symbol The symbol of this operator.
     * @param startIndex The starting index of the symbol in the formula source text.
     */
    constructor(symbol, startIndex) {
        super(symbol, startIndex);
    }
    /** Returns the symbol of this operator. */
    getSymbol() { return this._text; }
    /**
     * Checks if this operator's symbol is another symbol.
     * @param symbol The symbol to check this operator's symbol against.
     */
    is(symbol) { return this._text === symbol; }
    getName() { return 'operator'; }
}
exports.OperatorToken = OperatorToken;
//# sourceMappingURL=formula-tokens.js.map