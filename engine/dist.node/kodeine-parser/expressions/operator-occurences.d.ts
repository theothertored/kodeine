import { IBinaryOperator, IUnaryOperator, OperatorToken, WhitespaceToken } from "../../kodeine.js";
/** Represents an operator in an expression. */
export declare abstract class OperatorOccurence {
    readonly token: OperatorToken;
    constructor(token: OperatorToken);
}
/** Represents a unary operator in an expression. */
export declare class UnaryOperatorOccurence extends OperatorOccurence {
    /** The unary operator implementation. */
    readonly operator: IUnaryOperator;
    readonly followingWhitespaceTokens: WhitespaceToken[];
    /** Constructs a {@link UnaryOperatorOccurence} from a unary operator and the token representing it. */
    constructor(operator: IUnaryOperator, token: OperatorToken);
}
/** Represents a binary operator in an expression. */
export declare class BinaryOperatorOccurence extends OperatorOccurence {
    /** The binary operator implementation. */
    readonly operator: IBinaryOperator;
    readonly precedingWhitespaceTokens: WhitespaceToken[];
    readonly followingWhitespaceTokens: WhitespaceToken[];
    /** Constructs a {@link BinaryOperatorOccurence} from a binary operator and the token representing it. */
    constructor(operator: IBinaryOperator, token: OperatorToken);
}
