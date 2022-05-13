import {
    IBinaryOperator, IUnaryOperator,
    OperatorToken,
    WhitespaceToken
} from "../../kodeine.js";

/** Represents an operator in an expression. */
export abstract class OperatorOccurence {

    public readonly token: OperatorToken;

    constructor(token: OperatorToken) {
        this.token = token;
    }

}

/** Represents a unary operator in an expression. */
export class UnaryOperatorOccurence extends OperatorOccurence {

    /** The unary operator implementation. */
    public readonly operator: IUnaryOperator;
    public readonly followingWhitespaceTokens: WhitespaceToken[];

    /** Constructs a {@link UnaryOperatorOccurence} from a unary operator and the token representing it. */
    constructor(operator: IUnaryOperator, token: OperatorToken) {
        super(token);
        this.operator = operator;
        this.followingWhitespaceTokens = [];
    }

}

/** Represents a binary operator in an expression. */
export class BinaryOperatorOccurence extends OperatorOccurence {

    /** The binary operator implementation. */
    public readonly operator: IBinaryOperator;
    public readonly precedingWhitespaceTokens: WhitespaceToken[];
    public readonly followingWhitespaceTokens: WhitespaceToken[];

    /** Constructs a {@link BinaryOperatorOccurence} from a binary operator and the token representing it. */
    constructor(operator: IBinaryOperator, token: OperatorToken) {
        super(token);
        this.operator = operator;
        this.precedingWhitespaceTokens = [];
        this.followingWhitespaceTokens = [];
    }

}
