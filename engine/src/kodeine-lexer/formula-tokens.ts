import { FormulaToken } from "../base.js";

/** A base class for simple tokens extracted from a formula source text. */
export abstract class SimpleToken extends FormulaToken {

    /** The source text of this token. */
    protected readonly _text: string;

    /** The index of the first character of this token in the formula source text. */
    protected readonly _startIndex: number;

    /**
     * Constructs a base token using a piece of the formula source text and its start index.
     * @param text The piece of the formula source text this token represents.
     * @param startIndex The start index of the piece in the formula source text.
     */
    constructor(text: string, startIndex: number) {
        super();
        this._text = text;
        this._startIndex = startIndex;
    }

    /** Returns the source text of this token. */
    getSourceText(): string {
        return this._text;
    }

    /** Returns the index of the first character of this token in the formula source text. */
    getStartIndex(): number {
        return this._startIndex;
    }

    /** Returns the index of the first character after this token in the formula source text. */
    getEndIndex(): number {
        return this._startIndex + this._text.length;
    }

    /** Returns a human-readable name of the token ("comma", "operator" etc.). */
    abstract getName(): string;
}

/** A token containing plain text (formula text not wrapped in dollar signs). */
export class PlainTextToken extends SimpleToken {

    /**
     * Constructs a plain text token using a piece of the formula source text and its start index.
     * @param text The piece of the formula source text this token represents.
     * @param startIndex The start index of the piece in the formula source text.
     */
    constructor(text: string, startIndex: number) {
        super(text, startIndex);
    }

    getName(): string { return 'plain text'; }

}

/** 
 * A token representing two consecutive dollar signs ($$) within a plain text part of a formula.
 * Treated like a single plain text dollar sign ($). 
 */
export class EscapedDollarSignToken extends SimpleToken {

    /**
     * Constructs an escaped dollar sign token at a given position in the formula source text.
     * @param startIndex The start index of the token in the formula source text.
     */
    constructor(startIndex: number) {
        super('$$', startIndex);
    }

    getName(): string { return 'escaped dollar sign'; }

    getPlainTextOutput(): string {
        return '$';
    }

}

/** 
 * A token representing a dollar sign ($) that is not followed by another dollar sign.
 * Indicates the beginning or end of an evaluated part of a formula.
 */
export class DollarSignToken extends SimpleToken {

    /**
     * Constructs a dollar sign token at a given position in the formula source text.
     * @param startIndex The start index of the token in the formula source text.
     */
    constructor(startIndex: number) {
        super('$', startIndex);
    }

    getName(): string { return 'dollar sign'; }

}

/** A token representing one or more consecutive whitespace characters within an evaluated part of a formula. */
export class WhitespaceToken extends SimpleToken {

    /**
     * Constructs a whitespace token using a piece of the formula source text and its start index.
     * @param text The piece of the formula source text this token represents.
     * @param startIndex The start index of the piece in the formula source text.
     */
    constructor(text: string, startIndex: number) {
        super(text, startIndex);
    }

    getName(): string { return 'whitespace'; }

}

/**
 * A token representing an opening parenthesis within an evaluated part of a formula.
 * Indicates the beginning of a subexpression, or the beginning of a function call, if preceded by an unquoted value token.
 */
export class OpeningParenthesisToken extends SimpleToken {

    /**
     * Constructs an opening parenthesis token at a given position in the formula source text.
     * @param startIndex The start index of the token in the formula source text.
     */
    constructor(startIndex: number) {
        super('(', startIndex);
    }

    getName(): string { return 'opening parenthesis'; }

}

/**
 * A token representing a closing parenthesis within an evaluated part of a formula.
 * Indicates the end of the current subexpression or function call.
 */
export class ClosingParenthesisToken extends SimpleToken {

    /**
     * Constructs a closing parenthesis token at a given position in the formula source text.
     * @param startIndex The start index of the token in the formula source text.
     */
    constructor(startIndex: number) {
        super(')', startIndex);
    }

    getName(): string { return 'closing parenthesis'; }

}

/**
 * A token representing a comma within an evaluated part of a formula.
 * Indicates the end of the current function call argument.
 */
export class CommaToken extends SimpleToken {

    /**
     * Constructs a comma token at a given position in the formula source text.
     * @param startIndex The start index of the token in the formula source text.
     */
    constructor(startIndex: number) {
        super(',', startIndex);
    }

    getName(): string { return 'comma'; }

}

/**
 * A token representing a quotation mark within an evaluated part of a formula that was not closed.
 * Encountering this token causes the tokens read since the start of the evaluated part of the formula to be printed as plain text.
 */
export class UnclosedQuotedValueToken extends FormulaToken {

    /** The text following the opening quotation mark that was not closed. */
    private readonly _textFollowingQuotationMark: string;

    /** The index of the opening quotation mark in the formula source text. */
    private readonly _quotationMarkIndex: number;

    /**
     * Constructs an unclosed quoted value token using a piece of the formula source text following an opening quotation mark 
     * and the index of the quotation mark in the formula source text.
     * @param textFollowingQuotationMark The piece of the formula source text following the opening quotation mark.
     * @param quotationMarkIndex The index of the opening quotation mark in the formula source text.
     */
    constructor(textFollowingQuotationMark: string, quotationMarkIndex: number) {
        super();
        this._textFollowingQuotationMark = textFollowingQuotationMark;
        this._quotationMarkIndex = quotationMarkIndex;
    }

    getStartIndex(): number {
        return this._quotationMarkIndex;
    }

    getEndIndex(): number {
        return this._quotationMarkIndex + 1 + this._textFollowingQuotationMark.length;
    }

    getSourceText() { return `"${this._textFollowingQuotationMark}`; }

    getName(): string { return 'unclosed quoted value'; }
}


/** A token representing a quoted value within an evaluated part of a formula. */
export class QuotedValueToken extends FormulaToken {

    /** The text between the quotation marks. */
    private readonly _innerText: string;
    private readonly _openingQuotationMarkIndex: number;

    /**
     * Constructs a quoted value token using its inner text and the index of the opening quotation mark.
     * @param valueText The text between the quotation marks. 
     * @param openingQuotationMarkIndex The index of the opening quotation mark in the formula source text.
     */
    constructor(valueText: string, openingQuotationMarkIndex: number) {
        super();
        this._innerText = valueText;
        this._openingQuotationMarkIndex = openingQuotationMarkIndex;
    }

    /** The string value of this token. */
    getValue(): string {
        return this._innerText;
    }

    getStartIndex(): number {
        return this._openingQuotationMarkIndex;
    }

    getEndIndex(): number {
        return this._openingQuotationMarkIndex + 1 + this._innerText.length + 1;
    }

    getSourceText() { return `"${this._innerText}"`; }

    getName(): string { return 'quoted value'; }
}

/** A token representing an unquoted value within an evaluated part of a formula. */
export class UnquotedValueToken extends SimpleToken {

    constructor(text: string, startIndex: number) {
        super(text, startIndex);
    }

    /** The string value of this token. */
    getValue(): string {
        return this._text;
    }

    getName(): string { return 'unquoted value'; }
}

/** A token representing an operator within an evaluated part of a formula. */
export class OperatorToken extends SimpleToken {

    /**
     * Constructs an operator token from its symbol and the starting index of the symbol in the formula source text.
     * @param symbol The symbol of this operator. 
     * @param startIndex The starting index of the symbol in the formula source text.
     */
    constructor(symbol: string, startIndex: number) {
        super(symbol, startIndex);
    }

    /** Returns the symbol of this operator. */
    getSymbol() { return this._text; }

    /** 
     * Checks if this operator's symbol is another symbol.
     * @param symbol The symbol to check this operator's symbol against.
     */
    is(symbol: string): boolean { return this._text === symbol; }

    getName(): string { return 'operator'; }
}
