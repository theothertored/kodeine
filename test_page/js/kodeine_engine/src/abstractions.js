/** Represents a token emited by the lexer. */
export class IFormulaToken {
}
/** A base class for unary and binary operators. Requires operators to have a symbol. */
export class IOperator {
}
/** Represents an unary operator. */
export class IUnaryOperator extends IOperator {
}
/** Represents a binary operator. */
export class IBinaryOperator extends IOperator {
}
/** Represents a function. */
export class IKodeFunction {
}
/** Represents a part of a formula that can be evaluated. */
export class IEvaluable {
    constructor(source) {
        this.source = source;
    }
    evaluate(env) {
        let value = this._evaluate(env);
        // log evaluations (but don't log evaluate calls on KodeValue)
        if (!(this instanceof KodeValue))
            env.logEvaluation(this, value);
        return value;
    }
}
export class KodeValue extends IEvaluable {
    constructor(value, source) {
        super(source);
        if (typeof value === 'boolean') {
            this.numericValue = value ? 1 : 0;
            this.text = this.numericValue.toString();
            this.isNumeric = true;
        }
        else if (typeof value === 'string') {
            this.text = value;
            this.numericValue = Number(value);
            this.isNumeric = !isNaN(this.numericValue);
        }
        else {
            this.numericValue = value;
            this.text = value.toString();
            this.isNumeric = true;
        }
    }
    _evaluate(env) {
        return this;
    }
    static fromToken(token) {
        return new KodeValue(token.getValue(), EvaluableSource.fromToken(token));
    }
}
export class EvaluableSource {
    constructor(startIndex, endIndex, ...tokens) {
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.tokens = tokens;
    }
    static fromToken(token) {
        return new EvaluableSource(token.getStartIndex(), token.getEndIndex(), token);
    }
}
export class EvaluationStep {
    constructor(evaluable, value) {
        this.evaluable = evaluable;
        this.value = value;
    }
}
export class EvaluationEnvironment {
    logEvaluation(evaluable, evaluationResult) {
        this.evaluationSteps.push(new EvaluationStep(evaluable, evaluationResult));
    }
}
/** Represents a forward-only formula source text character reader. */
export class ICharReader {
}
/** Represents a forward-only formula token lexer. */
export class ILexer {
}
export class IParser {
}
//# sourceMappingURL=abstractions.js.map