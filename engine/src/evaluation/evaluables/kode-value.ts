import {
    QuotedValueToken,
    UnquotedValueToken,
    Evaluable,
    EvaluableSource,
    EvaluationContext,
    Literal
} from "../../kodeine.js";
import { LiteralReplacement } from "../evaluation-tree.js";

/** Describes a JS type that can be converted to a KodeValue. */
export type ConvertibleToKodeValue = string | number | boolean | KodeValue;

/** A concrete kode value. */
export class KodeValue extends Evaluable {

    /** Value as text. */
    public readonly text: string;

    /** Whether the value is numeric. */
    public readonly isNumeric: boolean;

    /** Whether the value is a string containing only i. Should only be set if true. */
    public readonly isI: boolean | undefined;

    /** Value as number. {@link NaN} if the value is not numeric. */
    public readonly numericValue: number;

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

        } else if (typeof value === 'string') {

            // the value is a string, try to parse as number
            this.text = value;
            this.numericValue = value?.trim() ? Number(value) : NaN; // Number('[empty or whitespace]') = 0, so an additional check is needed
            this.isNumeric = !isNaN(this.numericValue);

            // only set isI if it's true
            let isI = value.trim().toLowerCase() === 'i';
            if (isI) this.isI = true;

        } else if (typeof value === 'number') {

            // the value is a number
            this.numericValue = value;
            this.text = value.toString();
            this.isNumeric = true;

        } else {

            // the value is a KodeValue
            this.text = value.text;
            this.isNumeric = value.isNumeric;
            this.numericValue = value.numericValue;

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

        if (this.isNumeric && other.isNumeric)
            return this.numericValue == other.numericValue;

        else if (this.isNumeric || other.isNumeric)
            return false;

        else
            return this.text.trim().toLowerCase() == other.text.trim().toLowerCase();

    }

    static fromToken(token: (QuotedValueToken | UnquotedValueToken)): KodeValue {
        return new KodeValue(token.getValue(), new EvaluableSource(token));
    }

}
