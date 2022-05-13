/** Represents an operator in an expression. */
export class OperatorOccurence {
    constructor(token) {
        this.token = token;
    }
}
/** Represents a unary operator in an expression. */
export class UnaryOperatorOccurence extends OperatorOccurence {
    /** Constructs a {@link UnaryOperatorOccurence} from a unary operator and the token representing it. */
    constructor(operator, token) {
        super(token);
        this.operator = operator;
        this.followingWhitespaceTokens = [];
    }
}
/** Represents a binary operator in an expression. */
export class BinaryOperatorOccurence extends OperatorOccurence {
    /** Constructs a {@link BinaryOperatorOccurence} from a binary operator and the token representing it. */
    constructor(operator, token) {
        super(token);
        this.operator = operator;
        this.precedingWhitespaceTokens = [];
        this.followingWhitespaceTokens = [];
    }
}
//# sourceMappingURL=operator-occurences.js.map