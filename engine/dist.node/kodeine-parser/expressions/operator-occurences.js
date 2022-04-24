"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryOperatorOccurence = exports.UnaryOperatorOccurence = exports.OperatorOccurence = void 0;
/** Represents an operator in an expression. */
class OperatorOccurence {
    constructor(token) {
        this.token = token;
    }
}
exports.OperatorOccurence = OperatorOccurence;
/** Represents a unary operator in an expression. */
class UnaryOperatorOccurence extends OperatorOccurence {
    /** Constructs a {@link UnaryOperatorOccurence} from a unary operator and the token representing it. */
    constructor(operator, token) {
        super(token);
        this.operator = operator;
    }
}
exports.UnaryOperatorOccurence = UnaryOperatorOccurence;
/** Represents a binary operator in an expression. */
class BinaryOperatorOccurence extends OperatorOccurence {
    /** Constructs a {@link BinaryOperatorOccurence} from a binary operator and the token representing it. */
    constructor(operator, token) {
        super(token);
        this.operator = operator;
    }
}
exports.BinaryOperatorOccurence = BinaryOperatorOccurence;
//# sourceMappingURL=operator-occurences.js.map