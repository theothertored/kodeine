export class OperatorOccurence {
    constructor(token) {
        this.token = token;
    }
}
export class UnaryOperatorOccurence extends OperatorOccurence {
    constructor(operator, token) {
        super(token);
        this.operator = operator;
    }
}
export class BinaryOperatorOccurence extends OperatorOccurence {
    constructor(operator, token) {
        super(token);
        this.operator = operator;
    }
}
//# sourceMappingURL=operator-occurences.js.map