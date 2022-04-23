import { EvaluableSource } from "../../base.js";
import { FunctionCall } from "../../evaluables/function-call.js";
import { ExpressionBuilder } from "./expression-builder.js";
export class FunctionCallBuilder extends ExpressionBuilder {
    constructor(env, functionOccurence) {
        super(env, true, functionOccurence.funcNameToken, functionOccurence.openingParenthesisToken);
        this._argTokens = [];
        this._args = [];
        this._functionOccurence = functionOccurence;
        this._currentArgumentBuilder = new ExpressionBuilder(env, false, functionOccurence.openingParenthesisToken);
    }
    addValue(token) {
        this._argTokens.push(token);
        this._currentArgumentBuilder.addValue(token);
    }
    addOperator(token) {
        this._argTokens.push(token);
        this._currentArgumentBuilder.addOperator(token);
    }
    nextArgument(comma) {
        this._argTokens.push(comma);
        this._args.push(this._currentArgumentBuilder.build(comma));
        this._currentArgumentBuilder = new ExpressionBuilder(this._env, false, comma);
    }
    build(closingToken) {
        if (this._args.length === 0 && this._currentArgumentBuilder.getIsEmpty()) {
            // allow for a function call with no arguments
            return new FunctionCall(this._functionOccurence.func, this._args);
        }
        else {
            this._args.push(this._currentArgumentBuilder.build(closingToken));
            return new FunctionCall(this._functionOccurence.func, this._args, new EvaluableSource(this._functionOccurence.funcNameToken, this._functionOccurence.openingParenthesisToken, ...this._argTokens, closingToken));
        }
    }
}
//# sourceMappingURL=function-call-builder.js.map