import { Formula, EvaluationContext, BinaryOperation, UnaryOperation, FunctionCall, KodeValue, FormulaToken } from "./kodeine.js";
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
export declare abstract class IFormulaTokenLexer {
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
    abstract parse(source: string | ICharReader | IFormulaTokenLexer): Formula;
}
