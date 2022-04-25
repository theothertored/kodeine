import { EvaluableSource } from "../../base.js";
import { KodeSyntaxError } from "../../errors.js";
import { FunctionCall } from "../../evaluables/function-call.js";
import { ExpressionBuilder } from "./expression-builder.js";
import { IExpressionBuilder } from "./i-expression-builder.js";
/** Parsing helper class that can be fed tokens and then builds a {@link FunctionCall} evaluable. */
export class FunctionCallBuilder extends IExpressionBuilder {
    /**
     * Constructs a {@link FunctionCallBuilder} with a given parsing context and a function occurence that started this function call.
     * @param parseCtx The parsing context for this function call builder.
     * @param functionOccurence The function occurrence that started this function call.
     */
    constructor(parseCtx, functionOccurence) {
        super();
        /** Tokens between the opening and closing parenthesis of this function call. */
        this._innerTokens = [];
        /** An array of evaluables representing arguments of this function call that were already built. */
        this._args = [];
        this._parseCtx = parseCtx;
        this._functionOccurence = functionOccurence;
        this._currentArgumentBuilder = new ExpressionBuilder(parseCtx, false, ...functionOccurence.openingTokens);
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
            throw new KodeSyntaxError(comma, 'Argument missing.');
        }
        else {
            this._innerTokens.push(comma);
            this._args.push(this._currentArgumentBuilder.build(comma));
            this._currentArgumentBuilder = new ExpressionBuilder(this._parseCtx, false, comma);
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
            return new FunctionCall(this._functionOccurence.func, this._args, new EvaluableSource(...this._functionOccurence.openingTokens, ...this._innerTokens, closingToken));
        }
        else {
            // build the current argument
            this._args.push(this._currentArgumentBuilder.build(closingToken));
            // return a function call evaluable
            return new FunctionCall(this._functionOccurence.func, this._args, new EvaluableSource(...this._functionOccurence.openingTokens, ...this._innerTokens, closingToken));
        }
    }
}
//# sourceMappingURL=function-call-builder.js.map