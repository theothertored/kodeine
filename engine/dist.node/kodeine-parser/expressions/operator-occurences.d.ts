import { IBinaryOperator, IUnaryOperator, OperatorToken } from "../../kodeine.js";
/** Represents an operator in an expression. */
export declare abstract class OperatorOccurence {
    readonly token: OperatorToken;
    constructor(token: OperatorToken);
}
/** Represents a unary operator in an expression. */
export declare class UnaryOperatorOccurence extends OperatorOccurence {
    /** The unary operator implementation. */
    readonly operator: IUnaryOperator;
    /** Constructs a {@link UnaryOperatorOccurence} from a unary operator and the token representing it. */
    constructor(operator: IUnaryOperator, token: OperatorToken);
}
/** Represents a binary operator in an expression. */
export declare class BinaryOperatorOccurence extends OperatorOccurence {
    /** The binary operator implementation. */
    readonly operator: IBinaryOperator;
    /** Constructs a {@link BinaryOperatorOccurence} from a binary operator and the token representing it. */
    constructor(operator: IBinaryOperator, token: OperatorToken);
}
