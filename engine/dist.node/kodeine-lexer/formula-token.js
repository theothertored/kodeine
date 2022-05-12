"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormulaToken = void 0;
/** Represents a token emited by the lexer. */
class FormulaToken {
    /** Get what this token should output in a plain text part. By default this returns the source text. */
    getPlainTextOutput() {
        return this.getSourceText();
    }
}
exports.FormulaToken = FormulaToken;
//# sourceMappingURL=formula-token.js.map