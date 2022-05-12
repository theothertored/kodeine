import { FormulaToken, EvaluationContext, KodeValue } from "../../kodeine.js";
/** Represents a part of a formula that can be evaluated. */
export declare abstract class Evaluable {
    /** The source of this evaluable. */
    source: EvaluableSource | undefined;
    /** Base constructor that sets the source of the evaluable. */
    constructor(source?: EvaluableSource);
    /**
     * Evaluates this evaluable into a concrete kode value.
     * @param evalCtx The context in which this evaluation is taking place.
     */
    abstract evaluate(evalCtx: EvaluationContext): KodeValue;
    getSourceText(): string | undefined;
}
/** A set of information tying an evaluable to a part of the formula source text and tokens. */
export declare class EvaluableSource {
    readonly tokens: FormulaToken[];
    constructor(...tokens: FormulaToken[]);
    /** Gets the start index of the first source token. */
    getStartIndex(): number;
    /** Gets the end index of the last source token. */
    getEndIndex(): number;
    static createByConcatenatingSources(evaluables: Evaluable[]): EvaluableSource;
}
