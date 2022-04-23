import { Evaluable, IFormulaToken } from "../../base.js";
import { EvaluableSource } from "../../base.js";
import { FunctionCall } from "../../evaluables/function-call.js";
import { CommaToken, OperatorToken, QuotedValueToken, UnquotedValueToken } from "../../kodeine-lexer/formula-tokens.js";
import { ParsingEnvironment } from "../parsing-environment.js";
import { ExpressionBuilder } from "./expression-builder.js";
import { FunctionOccurence } from "./function-occurence.js";

export class FunctionCallBuilder extends ExpressionBuilder {

    private readonly _functionOccurence: FunctionOccurence;

    private _argTokens: IFormulaToken[] = [];
    private _currentArgumentBuilder: ExpressionBuilder;
    private _args: Evaluable[] = [];

    constructor(env: ParsingEnvironment, functionOccurence: FunctionOccurence) {
        super(env, true, functionOccurence.funcNameToken, functionOccurence.openingParenthesisToken);
        this._functionOccurence = functionOccurence;
        this._currentArgumentBuilder = new ExpressionBuilder(env, false, functionOccurence.openingParenthesisToken);
    }

    override addValue(token: (QuotedValueToken | UnquotedValueToken)) {
        this._argTokens.push(token);
        this._currentArgumentBuilder.addValue(token);
    }

    override addOperator(token: OperatorToken) {
        this._argTokens.push(token);
        this._currentArgumentBuilder.addOperator(token);
    }

    nextArgument(comma: CommaToken) {
        this._argTokens.push(comma);
        this._args.push(this._currentArgumentBuilder.build(comma));
        this._currentArgumentBuilder = new ExpressionBuilder(this._env, false, comma);
    }

    override build(closingToken: IFormulaToken): Evaluable {

        if (this._args.length === 0 && this._currentArgumentBuilder.getIsEmpty()) {

            // allow for a function call with no arguments
            return new FunctionCall(this._functionOccurence.func, this._args);

        } else {

            this._args.push(this._currentArgumentBuilder.build(closingToken));
            return new FunctionCall(
                this._functionOccurence.func,
                this._args,
                new EvaluableSource(
                    this._functionOccurence.funcNameToken,
                    this._functionOccurence.openingParenthesisToken,
                    ...this._argTokens,
                    closingToken
                )
            );

        }

    }
}
