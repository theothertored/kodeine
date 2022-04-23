import { IEvaluable } from "../abstractions.js";
import { KodeSyntaxError } from "../errors.js";
import { BinaryOperation, EvaluableSource, Expression, FunctionCall, KodeValue, UnaryOperation } from "../evaluables.js";
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
export class FunctionOccurence {
    constructor(func, funcNameToken, openingParenthesisToken) {
        this.funcNameToken = funcNameToken;
        this.openingParenthesisToken = openingParenthesisToken;
        this.func = func;
    }
}
export class ExpressionBuilder {
    constructor(env, includeSurroundingTokens, ...startingTokens) {
        this._elements = [];
        this._env = env;
        this._includeSurroundingTokens = includeSurroundingTokens;
        this._startingTokens = startingTokens;
    }
    _getLastElement() {
        return this._elements[this._elements.length - 1];
    }
    addValue(token) {
        let lastElement = this._getLastElement();
        if (lastElement instanceof IEvaluable) {
            // cannot have two values one after another
            throw new KodeSyntaxError(token, 'A value cannot follow another value.');
        }
        this._elements.push(KodeValue.fromToken(token));
    }
    addEvaluable(evaluable) {
        let lastElement = this._getLastElement();
        if (lastElement instanceof IEvaluable) {
            // cannot have two values one after another
            throw new KodeSyntaxError(evaluable.source.tokens[0], 'A value cannot follow another value.');
        }
        this._elements.push(evaluable);
    }
    addOperator(token) {
        let lastElement = this._getLastElement();
        let tokenShouldBeUnaryOperator = !lastElement
            || lastElement instanceof BinaryOperatorOccurence
            || lastElement instanceof UnaryOperatorOccurence;
        if (tokenShouldBeUnaryOperator) {
            let unaryOperator = this._env.findUnaryOperator(token.getSymbol());
            if (unaryOperator) {
                // found an unary operator
                this._elements.push(new UnaryOperatorOccurence(unaryOperator, token));
            }
            else {
                // unary operator not found
                let binaryOperator = this._env.findBinaryOperator(token.getSymbol());
                if (binaryOperator) {
                    // cannot have a binary operator at the start or after another operator
                    throw new KodeSyntaxError(token, `Left hand side argument for binary operator "${token.getSymbol()}" missing.`);
                }
                else {
                    // completely unknown operator encountered
                    throw new KodeSyntaxError(token, `Unrecognized operator "${token.getSymbol()}".`);
                }
            }
        }
        else {
            // token should be a binary operator
            let binaryOperator = this._env.findBinaryOperator(token.getSymbol());
            if (binaryOperator) {
                this._elements.push(new BinaryOperatorOccurence(binaryOperator, token));
            }
            else {
                // binary operator not found
                let unaryOperator = this._env.findUnaryOperator(token.getSymbol());
                if (unaryOperator) {
                    // cannot have an unary operator with a left hand side argument
                    throw new KodeSyntaxError(token, `Unary operator "${token.getSymbol()}" cannot have a left hand side argument.`);
                }
                else {
                    // completely unknown operator encountered
                    throw new KodeSyntaxError(token, `Unrecognized operator "${token.getSymbol()}".`);
                }
            }
        }
    }
    getIsEmpty() {
        return this._elements.length === 0;
    }
    build(closingToken) {
        if (this._elements.length === 0) {
            // empty parentheses - throw
            throw new KodeSyntaxError(closingToken, 'Empty expression.');
        }
        else {
            let finalElement;
            if (this._elements.length === 1) {
                // only one element in the parentheses
                finalElement = this._elements[0];
            }
            else {
                // multiple elements - construct operations
                // first pass - collapse any unary operators to IEvaluables
                for (var i = 0; i < this._elements.length; i++) {
                    let element = this._elements[i];
                    if (element instanceof UnaryOperatorOccurence) {
                        // if we encountered an unary operator, take every unary operator immediately following it
                        // and the value after all those unary operators and collapse them all into one evaluable
                        let firstElI = i; // the index of the first unary operator in the chain
                        let unaryOpStack = [element];
                        // start a second loop using the same i variable
                        for (i = i + 1; i < this._elements.length; i++) {
                            element = this._elements[i];
                            if (element instanceof UnaryOperatorOccurence) {
                                // add all unary operators to the stack
                                unaryOpStack.push(element);
                            }
                            else if (element instanceof IEvaluable) {
                                // if we encountered a value, we need to collapse the entire stack + value into a tree
                                // basically like this: UnaryOperation(UnaryOperation(IEvaluable))
                                let unaryOpCount = unaryOpStack.length;
                                let evaluable = element;
                                while (unaryOpStack.length > 0) {
                                    // apply operations in a reverse order by popping the stack
                                    let unaryOpOccurence = unaryOpStack.pop();
                                    evaluable = new UnaryOperation(unaryOpOccurence.operator, evaluable, new EvaluableSource(unaryOpOccurence.token.getStartIndex(), evaluable.source.endIndex, unaryOpOccurence.token, ...evaluable.source.tokens));
                                }
                                // replace array elements from first unary operator to last + 1, meaning replace the value too
                                this._elements.splice(firstElI, unaryOpCount + 1, evaluable);
                                // reset i to pretend this collapse didn't happen
                                i = firstElI;
                                // exit this loop
                                break;
                            }
                            else {
                                // this should never happen since we're checking for it when adding operators.
                                throw new KodeSyntaxError(closingToken, `Binary operator cannot follow an unary operator.`);
                            }
                        }
                    }
                }
                // after the first pass we should only be left with binary operators and evaluables
                // second pass - determine the order of operations for binary operators and collapse them in the proper order
                while (this._elements.length > 1) {
                    // step 1: find binary operator with the highest precedence
                    let maxPrecedence = -1;
                    let maxPrecedenceI = -1;
                    for (var i = 0; i < this._elements.length; i++) {
                        let element = this._elements[i];
                        if (element instanceof BinaryOperatorOccurence) {
                            if (element.operator.getPrecedence() > maxPrecedence) {
                                maxPrecedence = element.operator.getPrecedence();
                                maxPrecedenceI = i;
                            }
                        }
                    }
                    if (maxPrecedenceI === -1) {
                        // this should never happen
                        throw new KodeSyntaxError(closingToken, 'No binary operators found in the expression.');
                    }
                    else {
                        let opOccurence = this._elements[maxPrecedenceI];
                        if (maxPrecedenceI === 0 || !(this._elements[maxPrecedenceI - 1] instanceof IEvaluable)) {
                            throw new KodeSyntaxError(closingToken, `Left hand side argument for binary operator "${opOccurence.operator.getSymbol()}" missing.`);
                        }
                        else if (maxPrecedenceI === this._elements.length - 1 || !(this._elements[maxPrecedenceI + 1] instanceof IEvaluable)) {
                            throw new KodeSyntaxError(closingToken, `Right hand side argument for binary operator "${opOccurence.operator.getSymbol()}" missing.`);
                        }
                        else {
                            // collapse the operator and its two arguments into a one evaluable binary operation
                            let a = this._elements[maxPrecedenceI - 1];
                            let b = this._elements[maxPrecedenceI + 1];
                            let operation = new BinaryOperation(opOccurence.operator, a, b, new EvaluableSource(a.source.startIndex, b.source.endIndex, ...a.source.tokens, opOccurence.token, ...b.source.tokens));
                            this._elements.splice(maxPrecedenceI - 1, 3, operation);
                            // reset i like this collapse never happened
                            i = maxPrecedenceI - 1;
                        }
                    }
                }
                // after the second pass there should only be one element, being an instance of IEvaluable, so we succeeded
                finalElement = this._elements[0];
            }
            if (finalElement instanceof IEvaluable) {
                if (this._includeSurroundingTokens) {
                    return new Expression(finalElement, new EvaluableSource(this._startingTokens[0].getStartIndex(), closingToken.getEndIndex(), ...finalElement.source.tokens));
                }
                else {
                    return finalElement;
                }
            }
            else {
                throw new KodeSyntaxError(closingToken, `Expression cannot consist of only the "${finalElement.operator.getSymbol()}" operator.`);
            }
        }
    }
}
export class FunctionCallBuilder extends ExpressionBuilder {
    constructor(env, funcOccurence) {
        super(env, true, funcOccurence.funcNameToken, funcOccurence.openingParenthesisToken);
        this._argTokens = [];
        this._args = [];
        this._funcOccurence = funcOccurence;
        this._currentArgumentBuilder = new ExpressionBuilder(env, false, funcOccurence.openingParenthesisToken);
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
            return new FunctionCall(this._funcOccurence.func, this._args);
        }
        else {
            this._args.push(this._currentArgumentBuilder.build(closingToken));
            return new FunctionCall(this._funcOccurence.func, this._args, new EvaluableSource(this._funcOccurence.funcNameToken.getStartIndex(), closingToken.getEndIndex(), this._funcOccurence.funcNameToken, this._funcOccurence.openingParenthesisToken, ...this._argTokens, closingToken));
        }
    }
}
//# sourceMappingURL=builders.js.map