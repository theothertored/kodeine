"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnaryOperation = void 0;
const base_js_1 = require("../base.js");
/** An operation consisting of a unary operator and an evaluable argument. */
class UnaryOperation extends base_js_1.Evaluable {
    /**
     * Constructs a binary operation from an operator and two arguments.
     * @param operator The operator.
     * @param arg The only argument.
     * @param source Optionally, the source of this operation.
     */
    constructor(operator, arg, source) {
        super(source);
        this.operator = operator;
        this.arg = arg;
    }
    evaluate(env) {
        return this.operator.operation(this.arg.evaluate(env));
    }
}
exports.UnaryOperation = UnaryOperation;
//# sourceMappingURL=unary-operation.js.map