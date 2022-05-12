
/** Represents a token emited by the lexer. */
export abstract class FormulaToken {

    /** Returns the index of the first character of this token in the formula source text. */
    abstract getStartIndex(): number;

    /** Returns the index of the first character after this token in the formula source text. */
    abstract getEndIndex(): number;

    /** Returns the source text of this token. */
    abstract getSourceText(): string;

    /** Returns a human-readable name of this token. */
    abstract getName(): string;

    /** Get what this token should output in a plain text part. By default this returns the source text. */
    getPlainTextOutput(): string {
        return this.getSourceText();
    }

}
