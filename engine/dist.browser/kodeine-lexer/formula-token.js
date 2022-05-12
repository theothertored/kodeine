/** Represents a token emited by the lexer. */
export class FormulaToken {
    /** Get what this token should output in a plain text part. By default this returns the source text. */
    getPlainTextOutput() {
        return this.getSourceText();
    }
}
//# sourceMappingURL=formula-token.js.map