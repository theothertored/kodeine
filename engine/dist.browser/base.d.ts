import { Formula } from "./evaluables/formula.js";
import { EvaluationContext } from "./evaluables/evaluation-context.js";
import { QuotedValueToken, UnquotedValueToken } from "./kodeine-lexer/formula-tokens.js";
import { BinaryOperation } from "./evaluables/binary-operation.js";
import { UnaryOperation } from "./evaluables/unary-operation.js";
import { FunctionCall } from "./evaluables/function-call.js";
/** Represents a token emited by the lexer. */
export declare abstract class FormulaToken {
    /** Returns the index of the first character of this token in the formula source text. */
    abstract getStartIndex(): number;
    /** Returns the index of the first character after this token in the formula source text. */
    abstract getEndIndex(): number;
    /** Returns the source text of this token. */
    abstract getSourceText(): string;
    /** Returns a human-readable name of this token. */
    abstract getName(): string;
    /** Get what this token should output in a plain text part. By default this returns the source text. */
    getPlainTextOutput(): string;
}
/** A base class for unary and binary kode operators. Requires operators to have a symbol. */
export declare abstract class IOperator {
    /** Returns the symbol representing this operator. */
    abstract getSymbol(): string;
}
/** Represents a kode unary operator. */
export declare abstract class IUnaryOperator extends IOperator {
    /**
     * Implements the operation performed by this operator.
     * @param evalCtx The context of this evaluation.
     * @param operation The operation being evaluated.
     * @param a The argument.
     */
    abstract operation(evalCtx: EvaluationContext, operation: UnaryOperation, a: KodeValue): KodeValue;
}
/** Represents a kode binary operator. */
export declare abstract class IBinaryOperator extends IOperator {
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
export declare abstract class IKodeFunction {
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
    getSourceText(): string;
}
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
export declare abstract class FormulaEvaluationTreeNode {
    readonly result: KodeValue;
    constructor(result: KodeValue);
    abstract getDescription(): string;
}
export declare class Literal extends FormulaEvaluationTreeNode {
    constructor(value: KodeValue);
    getDescription(): string;
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
/** Represents a forward-only character reader. */
export declare abstract class ICharReader {
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
export declare abstract class ILexer {
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
export declare abstract class IFormulaStringParser {
    /**
     * Creates an evaluable {@link Formula} .
     * @param source The source of the formula text.
     * @returns An evaluable {@link Formula} object.
     */
    abstract parse(source: string | ICharReader | ILexer): Formula;
}
