"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluableSource = exports.Evaluable = void 0;
/** Represents a part of a formula that can be evaluated. */
class Evaluable {
    /** Base constructor that sets the source of the evaluable. */
    constructor(source) {
        this.source = source;
    }
    getSourceText() {
        return this.source.tokens.map(t => t.getSourceText()).join('');
    }
}
exports.Evaluable = Evaluable;
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
//# sourceMappingURL=evaluable.js.map