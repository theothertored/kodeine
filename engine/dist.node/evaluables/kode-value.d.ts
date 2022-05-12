import { QuotedValueToken, UnquotedValueToken, Evaluable, EvaluableSource, EvaluationContext } from "../kodeine.js";
/** Describes a JS type that can be converted to a KodeValue. */
export declare type ConvertibleToKodeValue = string | number | boolean | KodeValue;
/** A concrete kode value. */
export declare class KodeValue extends Evaluable {
    /** Value as text. */
    readonly text: string;
    /** Whether the value is numeric. */
    readonly isNumeric: boolean;
    /** Whether the value is a string containing only i. Should only be set if true. */
    readonly isI: boolean | undefined;
    /** Value as number. {@link NaN} if the value is not numeric. */
    readonly numericValue: number;
    /**
     * Creates a kode value from a JS value.
     * - String values will be parsed as numbers if possible.
     * - Boolean values will be converted to numbers (0 and 1).
     * @param value The value to create the kode value from.
     * @param source Optionally, the source of this value.
     */
    constructor(value: ConvertibleToKodeValue, source?: EvaluableSource);
    evaluate(evalCtx: EvaluationContext): KodeValue;
    /** Checks whether this value is equal to another value. */
    equals(other: KodeValue): boolean;
    static fromToken(token: (QuotedValueToken | UnquotedValueToken)): KodeValue;
}
