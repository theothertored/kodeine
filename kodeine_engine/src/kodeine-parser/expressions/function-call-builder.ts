import { Evaluable, IFormulaToken } from "../../base.js";
import { EvaluableSource } from "../../base.js";
import { KodeSyntaxError } from "../../errors.js";
import { FunctionCall } from "../../evaluables/function-call.js";
import { CommaToken, OperatorToken, QuotedValueToken, UnquotedValueToken } from "../../kodeine-lexer/formula-tokens.js";
import { ParsingContext } from "../parsing-context.js";
import { ExpressionBuilder } from "./expression-builder.js";
import { FunctionOccurence } from "./function-occurence.js";
import { IExpressionBuilder } from "./i-expression-builder.js";

/** Parsing helper class that can be fed tokens and then builds a {@link FunctionCall} evaluable. */
export class FunctionCallBuilder extends IExpressionBuilder {

    /** The parsing context for this builder. */
    private readonly _env: ParsingContext;

    /** The function occurence that started this function call. */
    private readonly _functionOccurence: FunctionOccurence;


    /** Tokens between the opening and closing parenthesis of this function call. */
    private _innerTokens: IFormulaToken[] = [];

    /** An expression builder for building arguments. */
    private _currentArgumentBuilder: ExpressionBuilder;

    /** An array of evaluables representing arguments of this function call that were already built. */
    private _args: Evaluable[] = [];


    /**
     * Constructs a {@link FunctionCallBuilder} with a given parsing context and a function occurence that started this function call.
     * @param env The parsing context for this function call builder.
     * @param functionOccurence The function occurrence that started this function call.
     */
    constructor(env: ParsingContext, functionOccurence: FunctionOccurence) {
        super();
        this._env = env;
        this._functionOccurence = functionOccurence;
        this._currentArgumentBuilder = new ExpressionBuilder(env, false, ...functionOccurence.openingTokens);
    }


    addEvaluable(evaluable: Evaluable): void {
        this._innerTokens.push(...evaluable.source.tokens);
        this._currentArgumentBuilder.addEvaluable(evaluable);
    }

    addValue(token: (QuotedValueToken | UnquotedValueToken)) {
        this._innerTokens.push(token);
        this._currentArgumentBuilder.addValue(token);
    }

    addOperator(token: OperatorToken) {
        this._innerTokens.push(token);
        this._currentArgumentBuilder.addOperator(token);
    }


    /** 
     * Builds the current argument and prepares for the next one.
     * @param comma The comma token that ended the current argument.
     * @throws {KodeSyntaxError} Argument missing.
     */
    nextArgument(comma: CommaToken) {

        if (this._currentArgumentBuilder.getIsEmpty()) {

            throw new KodeSyntaxError(comma, 'Argument missing.');

        } else {

            this._innerTokens.push(comma);

            this._args.push(this._currentArgumentBuilder.build(comma));

            this._currentArgumentBuilder = new ExpressionBuilder(this._env, false, comma);

        }
    }

    /**
     * Builds the current argument and then builds a function call with all previously built arguments.
     * @param closingToken The token that closes this function call (most likely a closing parenthesis token).
     * @returns A {@link FunctionCall} evaluable.
     */
    build(closingToken: IFormulaToken): Evaluable {

        if (this._args.length === 0 && this._currentArgumentBuilder.getIsEmpty()) {

            // allow for a function call with no arguments
            return new FunctionCall(this._functionOccurence.func, this._args);

        } else {

            // build the current argument
            this._args.push(this._currentArgumentBuilder.build(closingToken));

            // return a function call evaluable
            return new FunctionCall(
                this._functionOccurence.func,
                this._args,
                new EvaluableSource(
                    ...this._functionOccurence.openingTokens,
                    ...this._innerTokens,
                    closingToken
                )
            );

        }

    }
}
