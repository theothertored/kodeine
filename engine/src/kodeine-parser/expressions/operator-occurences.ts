import { IBinaryOperator, IUnaryOperator } from "../../base.js";
import { OperatorToken } from "../../kodeine-lexer/formula-tokens.js";

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

    /** Constructs a {@link UnaryOperatorOccurence} from a unary operator and the token representing it. */
    constructor(operator: IUnaryOperator, token: OperatorToken) {
        super(token);
        this.operator = operator;
    }

}

/** Represents a binary operator in an expression. */
export class BinaryOperatorOccurence extends OperatorOccurence {

    /** The binary operator implementation. */
    public readonly operator: IBinaryOperator;

    /** Constructs a {@link BinaryOperatorOccurence} from a binary operator and the token representing it. */
    constructor(operator: IBinaryOperator, token: OperatorToken) {
        super(token);
        this.operator = operator;
    }

}