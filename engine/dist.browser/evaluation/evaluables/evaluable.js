/** Represents a part of a formula that can be evaluated. */
export class Evaluable {
    /** Base constructor that sets the source of the evaluable. */
    constructor(source) {
        this.source = source;
    }
    getSourceText() {
        var _a;
        return (_a = this.source) === null || _a === void 0 ? void 0 : _a.tokens.map(t => t.getSourceText()).toString();
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
//# sourceMappingURL=evaluable.js.map