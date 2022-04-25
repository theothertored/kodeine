"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnaryOperation = void 0;
const base_js_1 = require("../base.js");
const errors_js_1 = require("../errors.js");
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
        try {
            return this.operator.operation(env, this, this.arg.evaluate(env));
        }
        catch (err) {
            if (err instanceof errors_js_1.InternalEvaluationError) {
                // if an internal evaluation was thrown, we need to convert it
                // to an external one with this operation as the evaluable
                throw err.toExternalError(this);
            }
            else {
                throw err;
            }
        }
    }
}
exports.UnaryOperation = UnaryOperation;
//# sourceMappingURL=unary-operation.js.map