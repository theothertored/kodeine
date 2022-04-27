import { Formula } from "./evaluables/formula.js";
import { EvaluationContext } from "./evaluables/evaluation-context.js";
import { QuotedValueToken, UnquotedValueToken } from "./kodeine-lexer/formula-tokens.js";
import { BinaryOperation } from "./evaluables/binary-operation.js";
import { UnaryOperation } from "./evaluables/unary-operation.js";
import { FunctionCall } from "./evaluables/function-call.js";


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


/** A base class for unary and binary kode operators. Requires operators to have a symbol. */
export abstract class IOperator {
    /** Returns the symbol representing this operator. */
    abstract getSymbol(): string;
}

/** Represents a kode unary operator. */
export abstract class IUnaryOperator extends IOperator {

    /**
     * Implements the operation performed by this operator. 
     * @param evalCtx The context of this evaluation.
     * @param operation The operation being evaluated.
     * @param a The argument.
     */
    abstract operation(evalCtx: EvaluationContext, operation: UnaryOperation, a: KodeValue): KodeValue;

}

/** Represents a kode binary operator. */
export abstract class IBinaryOperator extends IOperator {

    /** Returns the precedence of this operator. Operators with higher precedence values will be evaluated first. */
    abstract getPrecedence(): number;

    /** 
     * Implements the operation performed by this operator. 
     * @param evalCtx The context of this evaluation.
     * @param operation The operation being evaluated.
     * @param a The left hand side argument.
     * @param b The right hand side argument.
     */
    abstract operation(evalCtx: EvaluationContext, operation: BinaryOperation, a: KodeValue, b: KodeValue): KodeValue;

}


/** Represents a kode function. */
export abstract class IKodeFunction {

    /** Returns the name of this function. */
    abstract getName(): string;

    /** 
     * Function implementation. 
     * @param evalCtx The context in which this evaluation is taking place.
     * @param call The function call being evaluated.
     * @param args The arguments of the function call.
     */
    abstract call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue;

}


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

}

/** Describes a JS type that can be converted to a KodeValue. */
export type ConvertibleToKodeValue = string | number | boolean | KodeValue;

/** A concrete kode value. */
export class KodeValue extends Evaluable {

    /** Value as text. */
    public readonly text: string;

    /** Whether the value is numeric. */
    public readonly isNumeric: boolean;

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
            this.numericValue = value ? Number(value) : NaN; // Number('') = 0, so an additional check is needed
            this.isNumeric = !isNaN(this.numericValue);

        } else if (typeof value === 'number') {

            // the value is a number
            this.numericValue = value;
            this.text = value.toString();
            this.isNumeric = true;

        } else {

            this.text = value.text;
            this.isNumeric = value.isNumeric;
            this.numericValue = value.numericValue;

        }
        
    }

    evaluate(evalCtx: EvaluationContext): KodeValue {
        return this;
    }

    static fromToken(token: (QuotedValueToken | UnquotedValueToken)): KodeValue {
        return new KodeValue(token.getValue(), new EvaluableSource(token));
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


/** Represents a forward-only character reader. */
export abstract class ICharReader {

    /**
     * Returns the next {@link charCount} characters without consuming them.
     * @param charCount How many characters to peek.
     * @param offset Optionally, how many characters to offset the peek by.
     * @returns Next {@link charCount} characters of the source as a string. 
     */
    abstract peek(charCount: number, offset?: number): string;

    /**
     * Consumes the next {@link charCount} characters.
     * @param charCount How many characters to consume.
     * @returns Next {@link charCount} characters of the source as a string. 
     */
    abstract consume(charCount: number): string;

    /** Returns the current position of the reader in the source. */
    abstract getPosition(): number;

    /** Returns whether the reader has reached the end of the source. */
    abstract EOF(): boolean;

}

/** Represents a forward-only formula token lexer. */
export abstract class ILexer {

    /**
     * Returns the next {@link tokenCount} tokens without consuming them.
     * @param tokenCount How many tokens to peek.
     * @returns Next {@link tokenCount} tokens of the formula source text as an array. 
     */
    abstract peek(tokenCount: number, offset?: number): FormulaToken[];

    /**
     * Consumes the next {@link tokenCount} tokens.
     * @param tokenCount How many tokens to consume.
     * @returns Next {@link tokenCount} tokens of the formula source text as an array.
     */
    abstract consume(tokenCount: number): FormulaToken[];

    /** Returns whether the reader has reached the end of the formula source text. */
    abstract EOF(): boolean;

}

/** Represents a parser that converts text into an evaluable {@link Formula}. */
export abstract class IFormulaStringParser {

    /**
     * Creates an evaluable {@link Formula} .
     * @param source The source of the formula text.
     * @returns An evaluable {@link Formula} object.
     */
    abstract parse(source: string | ICharReader | ILexer): Formula;

}
