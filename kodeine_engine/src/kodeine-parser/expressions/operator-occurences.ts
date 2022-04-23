import { IBinaryOperator, IUnaryOperator } from "../../base.js";
import { OperatorToken } from "../../kodeine-lexer/formula-tokens.js";

export abstract class OperatorOccurence {

    public readonly token: OperatorToken;

    constructor(token: OperatorToken) {
        this.token = token;
    }

}

export class UnaryOperatorOccurence extends OperatorOccurence {

    public readonly operator: IUnaryOperator;

    constructor(operator: IUnaryOperator, token: OperatorToken) {
        super(token);
        this.operator = operator;
    }

}

export class BinaryOperatorOccurence extends OperatorOccurence {

    public readonly operator: IBinaryOperator;

    constructor(operator: IBinaryOperator, token: OperatorToken) {
        super(token);
        this.operator = operator;
    }

}