"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionCallBuilder = void 0;
const base_js_1 = require("../../base.js");
const errors_js_1 = require("../../errors.js");
const function_call_js_1 = require("../../evaluables/function-call.js");
const expression_builder_js_1 = require("./expression-builder.js");
const i_expression_builder_js_1 = require("./i-expression-builder.js");
/** Parsing helper class that can be fed tokens and then builds a {@link FunctionCall} evaluable. */
class FunctionCallBuilder extends i_expression_builder_js_1.IExpressionBuilder {
    /**
     * Constructs a {@link FunctionCallBuilder} with a given parsing context and a function occurence that started this function call.
     * @param env The parsing context for this function call builder.
     * @param functionOccurence The function occurrence that started this function call.
     */
    constructor(env, functionOccurence) {
        super();
        /** Tokens between the opening and closing parenthesis of this function call. */
        this._innerTokens = [];
        /** An array of evaluables representing arguments of this function call that were already built. */
        this._args = [];
        this._env = env;
        this._functionOccurence = functionOccurence;
        this._currentArgumentBuilder = new expression_builder_js_1.ExpressionBuilder(env, false, ...functionOccurence.openingTokens);
    }
    addEvaluable(evaluable) {
        // TODO: make this not crash when the evaluable has no source
        this._innerTokens.push(...evaluable.source.tokens);
        this._currentArgumentBuilder.addEvaluable(evaluable);
    }
    addValue(token) {
        this._innerTokens.push(token);
        this._currentArgumentBuilder.addValue(token);
    }
    addOperator(token) {
        this._innerTokens.push(token);
        this._currentArgumentBuilder.addOperator(token);
    }
    /**
     * Builds the current argument and prepares for the next one.
     * @param comma The comma token that ended the current argument.
     * @throws {KodeSyntaxError} Argument missing.
     */
    nextArgument(comma) {
        if (this._currentArgumentBuilder.getIsEmpty()) {
            throw new errors_js_1.KodeSyntaxError(comma, 'Argument missing.');
        }
        else {
            this._innerTokens.push(comma);
            this._args.push(this._currentArgumentBuilder.build(comma));
            this._currentArgumentBuilder = new expression_builder_js_1.ExpressionBuilder(this._env, false, comma);
        }
    }
    /**
     * Builds the current argument and then builds a function call with all previously built arguments.
     * @param closingToken The token that closes this function call (most likely a closing parenthesis token).
     * @returns A {@link FunctionCall} evaluable.
     */
    build(closingToken) {
        if (this._args.length === 0 && this._currentArgumentBuilder.getIsEmpty()) {
            // allow for a function call with no arguments
            return new function_call_js_1.FunctionCall(this._functionOccurence.func, this._args);
        }
        else {
            // build the current argument
            this._args.push(this._currentArgumentBuilder.build(closingToken));
            // return a function call evaluable
            return new function_call_js_1.FunctionCall(this._functionOccurence.func, this._args, new base_js_1.EvaluableSource(...this._functionOccurence.openingTokens, ...this._innerTokens, closingToken));
        }
    }
}
exports.FunctionCallBuilder = FunctionCallBuilder;
//# sourceMappingURL=function-call-builder.js.map