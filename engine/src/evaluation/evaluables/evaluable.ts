import { 
    FormulaToken,
    EvaluationContext,
    KodeValue
} from "../../kodeine.js";

/** Represents a part of a formula that can be evaluated. */
export abstract class Evaluable {

    /** The source of this evaluable. */
    public source: EvaluableSource | undefined;

    /** Base constructor that sets the source of the evaluable. */
    constructor(source?: EvaluableSource) {
        this.source = source;
    }

    /** 
     * Evaluates this evaluable into a concrete kode value.
     * @param evalCtx The context in which this evaluation is taking place.
     */
    abstract evaluate(evalCtx: EvaluationContext): KodeValue;

    getSourceText() {
        return this.source!.tokens.map(t => t.getSourceText()).join('');
    }

}


/** A set of information tying an evaluable to a part of the formula source text and tokens. */
export class EvaluableSource {

    public readonly tokens: FormulaToken[];

    constructor(...tokens: FormulaToken[]) {
        this.tokens = tokens;
    }

    /** Gets the start index of the first source token. */
    public getStartIndex(): number {
        if (this.tokens.length > 0)
            return this.tokens[0].getStartIndex();
        else
            throw new Error('Evaluable source contains no tokens.');
    }

    /** Gets the end index of the last source token. */
    public getEndIndex(): number {
        if (this.tokens.length > 0)
            return this.tokens[this.tokens.length - 1].getEndIndex();
        else
            throw new Error('Evaluable source contains no tokens.');
    }

    static createByConcatenatingSources(evaluables: Evaluable[]): EvaluableSource {

        let tokens: FormulaToken[] = [];

        evaluables.forEach(ev => {
            if (Array.isArray(ev.source?.tokens)) {
                tokens.push(...ev.source!.tokens);
            }
        })

        return new EvaluableSource(...tokens);
    }

}
