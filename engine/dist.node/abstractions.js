"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IFormulaStringParser = exports.IFormulaTokenLexer = exports.ICharReader = exports.IKodeFunction = exports.IBinaryOperator = exports.IUnaryOperator = exports.IOperator = void 0;
/** A base class for unary and binary kode operators. Requires operators to have a symbol. */
class IOperator {
}
exports.IOperator = IOperator;
/** Represents a kode unary operator. */
class IUnaryOperator extends IOperator {
}
exports.IUnaryOperator = IUnaryOperator;
/** Represents a kode binary operator. */
class IBinaryOperator extends IOperator {
}
exports.IBinaryOperator = IBinaryOperator;
/** Represents a kode function. */
class IKodeFunction {
}
exports.IKodeFunction = IKodeFunction;
/** Represents a forward-only character reader. */
class ICharReader {
}
exports.ICharReader = ICharReader;
/** Represents a forward-only formula token lexer. */
class IFormulaTokenLexer {
}
exports.IFormulaTokenLexer = IFormulaTokenLexer;
/** Represents a parser that converts text into an evaluable {@link Formula}. */
class IFormulaStringParser {
}
exports.IFormulaStringParser = IFormulaStringParser;
//# sourceMappingURL=abstractions.js.map