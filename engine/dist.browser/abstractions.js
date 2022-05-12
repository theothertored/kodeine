/** A base class for unary and binary kode operators. Requires operators to have a symbol. */
export class IOperator {
}
/** Represents a kode unary operator. */
export class IUnaryOperator extends IOperator {
}
/** Represents a kode binary operator. */
export class IBinaryOperator extends IOperator {
}
/** Represents a kode function. */
export class IKodeFunction {
}
/** Represents a forward-only character reader. */
export class ICharReader {
}
/** Represents a forward-only formula token lexer. */
export class IFormulaTokenLexer {
}
/** Represents a parser that converts text into an evaluable {@link Formula}. */
export class IFormulaStringParser {
}
//# sourceMappingURL=abstractions.js.map