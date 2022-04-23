import { IEvaluable } from "./abstractions.js";
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
export class FunctionCall extends IEvaluable {
    constructor(func, args, source) {
        super(source);
        this.func = func;
        this.args = args;
    }
    _evaluate(env) {
        let kodeVal = this.func.call(env, this.args.map(a => a.evaluate(env)));
        // the value resulting from this function call should have the same source as the operation
        kodeVal.source = this.source;
        return kodeVal;
    }
}
export class BinaryOperation extends IEvaluable {
    constructor(operator, argA, argB, source) {
        super(source);
        this.operator = operator;
        this.argA = argA;
        this.argB = argB;
    }
    _evaluate(env) {
        let kodeVal = this.operator.operation(this.argA.evaluate(env), this.argB.evaluate(env));
        // the value resulting from this operation should have the same source as the operation 
        kodeVal.source = this.source;
        return kodeVal;
    }
}
export class UnaryOperation extends IEvaluable {
    constructor(operator, arg, source) {
        super(source);
        this.operator = operator;
        this.arg = arg;
    }
    _evaluate(env) {
        return this.operator.operation(this.arg.evaluate(env));
    }
}
export class Expression extends IEvaluable {
    constructor(evaluable, source) {
        super(source);
        this.evaluable = evaluable;
    }
    _evaluate(env) {
        return this.evaluable.evaluate(env);
    }
}
export class Formula extends IEvaluable {
    constructor() {
        super(...arguments);
        this.evaluables = [];
    }
    _evaluate(env) {
        let output = '';
        for (var evaluable of this.evaluables) {
            output += evaluable.evaluate(env).text;
        }
        return new KodeValue(output);
    }
}
//# sourceMappingURL=evaluables.js.map