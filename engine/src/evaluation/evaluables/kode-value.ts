import {
    QuotedValueToken,
    UnquotedValueToken,
    Evaluable,
    EvaluableSource,
    EvaluationContext,
    Literal, LiteralReplacement
} from "../../kodeine.js";
import { KustomDateHelper } from "../implementations/helpers/kustom-date-helper.js";

/** Describes a JS type that can be converted to a KodeValue. */
export type ConvertibleToKodeValue = string | number | boolean | Date | KodeValue;

/** A concrete kode value. */
export class KodeValue extends Evaluable {

    /** Value as text. */
    public readonly text: string;

    /** 
     * Whether the value is numeric. Note that this being `true` does not mean {@link numericValue} is set to `NaN`.
     * For example, date values set {@link numericValue} for operators, but also set {@link isNumeric} to `false` for `mu()`.
     * #justkustomthings
     */
    public readonly isNumeric: boolean;

    /** Whether the value is a date. */
    public readonly isDate: boolean;

    /** Whether the value is a string containing only i. Should only be set if true. */
    public readonly isI?: boolean;

    /** Value as number. `NaN` if the value cannot be converted to number. */
    public readonly numericValue: number;

    /** Value as date. Should only be set if the value is a date. */
    public readonly dateValue?: Date;

    /** 
     * Creates a kode value from a JS value.
     * - String values will be parsed as numbers if possible.
     * - Boolean values will be converted to numbers (0 and 1).
     * @param value The value to create the kode value from.
     * @param source Optionally, the source of this value.
     */
    constructor(value: ConvertibleToKodeValue, source?: EvaluableSource) {

        // pass the source to the Evaluable constructor
        super(source);

        if (typeof value === 'boolean') {

            // the value is a boolean, convert to 0 or 1
            this.numericValue = value ? 1 : 0;
            this.text = this.numericValue.toString();
            this.isNumeric = true;
            this.isDate = false;

        } else if (typeof value === 'string') {

            // the value is a string, try to parse as number
            this.text = value;
            this.numericValue = value?.trim() ? Number(value) : NaN; // Number('[empty or whitespace]') = 0, so an additional check is needed
            this.isNumeric = !isNaN(this.numericValue);
            this.isDate = false;

            // only set isI if it's true
            let isI = value.trim().toLowerCase() === 'i';
            if (isI) this.isI = true;

        } else if (typeof value === 'number') {

            // the value is a number
            this.numericValue = value;
            this.text = value.toString();
            this.isNumeric = true;
            this.isDate = false;

        } else if (value instanceof Date) {

            // the value is a date
            this.dateValue = value;
            this.text = value.toISOString(); // TODO: modify this with a +01:00 (timezone) instead of the trailing letter
            this.numericValue = Math.floor(value.valueOf() / 1000);
            this.isNumeric = false;
            this.isDate = true;

        } else {

            // the value is a KodeValue
            this.text = value.text;
            this.isNumeric = value.isNumeric;
            this.numericValue = value.numericValue;
            this.isDate = value.isDate;

        }

    }

    evaluate(evalCtx: EvaluationContext): KodeValue {

        let literal = new Literal(this);

        if (evalCtx.iReplacement && this.isI) {

            // we are currently replacing i with a different value 
            // and this value is i, return the replacement value

            if (evalCtx.buildEvaluationTree) {

                evalCtx.sideEffects.lastEvaluationTreeNode = new LiteralReplacement(
                    evalCtx.iReplacement, literal
                );

            }

            return evalCtx.iReplacement;

        } else {

            // return self by default

            if (evalCtx.buildEvaluationTree) {

                evalCtx.sideEffects.lastEvaluationTreeNode = literal;

            }

            return this;

        }

    }

    /** Checks whether this value is equal to another value. */
    equals(other: KodeValue): boolean {

        if (!isNaN(this.numericValue) && !isNaN(other.numericValue))
            return this.numericValue == other.numericValue;

        else if (isNaN(this.numericValue) || isNaN(other.numericValue))
            return false;

        else
            return this.text.trim().toLowerCase() == other.text.trim().toLowerCase();

    }

    /** Converts this {@link KodeValue} to its string representation. */
    toOutputString(): string {

        if (this.isDate)
            return KustomDateHelper.toKustomDateString(this.dateValue!);
        else
            return this.text;

    }

    static fromToken(token: (QuotedValueToken | UnquotedValueToken)): KodeValue {
        return new KodeValue(token.getValue(), new EvaluableSource(token));
    }

}
