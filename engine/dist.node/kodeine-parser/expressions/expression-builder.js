"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionBuilder = void 0;
const base_js_1 = require("../../base.js");
const base_js_2 = require("../../base.js");
const errors_js_1 = require("../../errors.js");
const binary_operation_js_1 = require("../../evaluables/binary-operation.js");
const expression_js_1 = require("../../evaluables/expression.js");
const unary_operation_js_1 = require("../../evaluables/unary-operation.js");
const operator_occurences_js_1 = require("./operator-occurences.js");
/** Parsing helper class that can be fed tokens and then builds an evaluable tree. */
class ExpressionBuilder {
    /**
     * Constructs an expression builder with a given parsing context.
     * @param env The parsing context for this expression builder.
     * @param includeSurroundingTokens Whether the built expression should include starting and ending tokens in its source.
     * @param startingTokens The token or tokens that started the built expression.
     */
    constructor(env, includeSurroundingTokens, ...startingTokens) {
        /** Elements of the built expression. Expressions consist of evaluables and operators. */
        this._elements = [];
        this._env = env;
        this._includeSurroundingTokens = includeSurroundingTokens;
        this._startingTokens = startingTokens;
    }
    /** Returns the current last element of {@link _elements}. */
    _getLastElement() {
        return this._elements[this._elements.length - 1];
    }
    addValue(token) {
        // check the current last element
        if (this._getLastElement() instanceof base_js_1.Evaluable) {
            // cannot have two values one after another
            throw new errors_js_1.KodeSyntaxError(token, 'A value cannot follow another value.');
        }
        // create kode value and add as element
        this._elements.push(base_js_1.KodeValue.fromToken(token));
    }
    addEvaluable(evaluable) {
        // check the current last element
        let lastElement = this._getLastElement();
        if (lastElement instanceof base_js_1.Evaluable) {
            // cannot have two values one after another
            // TODO: make this not crash when an evaluable doesn't have a source.
            throw new errors_js_1.KodeSyntaxError(evaluable.source.tokens[0], 'A value cannot follow another value.');
        }
        this._elements.push(evaluable);
    }
    addOperator(token) {
        let lastElement = this._getLastElement();
        // the token should be a unary operator if it is the first element of the expression
        // or is preceded by another operator, be it unary or binary.
        let tokenShouldBeUnaryOperator = !lastElement
            || lastElement instanceof operator_occurences_js_1.BinaryOperatorOccurence
            || lastElement instanceof operator_occurences_js_1.UnaryOperatorOccurence;
        if (tokenShouldBeUnaryOperator) {
            let unaryOperator = this._env.findUnaryOperator(token.getSymbol());
            if (unaryOperator) {
                // found the unary operator
                this._elements.push(new operator_occurences_js_1.UnaryOperatorOccurence(unaryOperator, token));
            }
            else {
                // unary operator not found
                let binaryOperator = this._env.findBinaryOperator(token.getSymbol());
                if (binaryOperator) {
                    // cannot have a binary operator at the start or after another operator
                    throw new errors_js_1.KodeSyntaxError(token, `Left hand side argument for binary operator "${token.getSymbol()}" missing.`);
                }
                else {
                    // completely unknown operator encountered
                    throw new errors_js_1.KodeSyntaxError(token, `Unrecognized operator "${token.getSymbol()}".`);
                }
            }
        }
        else {
            // token should be a binary operator
            let binaryOperator = this._env.findBinaryOperator(token.getSymbol());
            if (binaryOperator) {
                // found the binary operator
                this._elements.push(new operator_occurences_js_1.BinaryOperatorOccurence(binaryOperator, token));
            }
            else {
                // binary operator not found
                let unaryOperator = this._env.findUnaryOperator(token.getSymbol());
                if (unaryOperator) {
                    // cannot have a unary operator with a left hand side argument
                    throw new errors_js_1.KodeSyntaxError(token, `Unary operator "${token.getSymbol()}" cannot have a left hand side argument.`);
                }
                else {
                    // completely unknown operator encountered
                    throw new errors_js_1.KodeSyntaxError(token, `Unrecognized operator "${token.getSymbol()}".`);
                }
            }
        }
    }
    /** Returns whether this expression has any elements. */
    getIsEmpty() {
        return this._elements.length === 0;
    }
    /**
     * Builds an evaluable tree from added expression elements.
     * @param closingToken The token that is closing this expression (closing parenthesis, dollar sign etc.).
     * @returns An evaluable tree. If {@link includeSurroundingTokens} is `true`, returns an {@link Expression}
     * wrapping an evaluable and containing the opening and closing tokens in its source.
     * Otherwise, returns the root (last-in-order) evaluable of the expression.
     */
    build(closingToken) {
        if (this._elements.length === 0) {
            // empty parentheses - throw
            throw new errors_js_1.KodeSyntaxError(closingToken, 'Empty expression.');
        }
        else {
            // the root element of the expression
            let finalElement;
            if (this._elements.length === 1) {
                // this expression only has one element, so it wil be the root element
                // it needs to be an evaluable - this is checked below the current if.
                finalElement = this._elements[0];
            }
            else {
                // multiple elements - construct operations
                // first pass - collapse any unary operators to IEvaluables
                for (var i = 0; i < this._elements.length; i++) {
                    let element = this._elements[i];
                    if (element instanceof operator_occurences_js_1.UnaryOperatorOccurence) {
                        // if we encountered a unary operator, take every unary operator immediately following it
                        // and the value after all those unary operators and collapse them all into one evaluable
                        let firstElI = i; // the index of the first unary operator in the chain
                        let unaryOpStack = [element];
                        // start a second loop using the same i variable
                        for (i = i + 1; i < this._elements.length; i++) {
                            element = this._elements[i];
                            if (element instanceof operator_occurences_js_1.UnaryOperatorOccurence) {
                                // add all unary operators to the stack
                                unaryOpStack.push(element);
                            }
                            else if (element instanceof base_js_1.Evaluable) {
                                // if we encountered a value, we need to collapse the entire stack + value into a tree
                                // basically like this: UnaryOperation(UnaryOperation(IEvaluable))
                                let unaryOpCount = unaryOpStack.length;
                                let evaluable = element;
                                while (unaryOpStack.length > 0) {
                                    // apply operations in a reverse order by popping the stack
                                    let unaryOpOccurence = unaryOpStack.pop();
                                    evaluable = new unary_operation_js_1.UnaryOperation(unaryOpOccurence.operator, evaluable, 
                                    // TODO: make this not crash when the evaluable has no source 
                                    new base_js_2.EvaluableSource(unaryOpOccurence.token, ...evaluable.source.tokens));
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
                                throw new errors_js_1.KodeSyntaxError(closingToken, `Binary operator cannot follow a unary operator.`);
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
                        if (element instanceof operator_occurences_js_1.BinaryOperatorOccurence) {
                            if (element.operator.getPrecedence() > maxPrecedence) {
                                maxPrecedence = element.operator.getPrecedence();
                                maxPrecedenceI = i;
                            }
                        }
                    }
                    if (maxPrecedenceI === -1) {
                        // this should never happen
                        throw new errors_js_1.KodeSyntaxError(closingToken, 'No binary operators found in the expression.');
                    }
                    else {
                        let opOccurence = this._elements[maxPrecedenceI];
                        if (maxPrecedenceI === 0 || !(this._elements[maxPrecedenceI - 1] instanceof base_js_1.Evaluable)) {
                            throw new errors_js_1.KodeSyntaxError(closingToken, `Left hand side argument for binary operator "${opOccurence.operator.getSymbol()}" missing.`);
                        }
                        else if (maxPrecedenceI === this._elements.length - 1 || !(this._elements[maxPrecedenceI + 1] instanceof base_js_1.Evaluable)) {
                            throw new errors_js_1.KodeSyntaxError(closingToken, `Right hand side argument for binary operator "${opOccurence.operator.getSymbol()}" missing.`);
                        }
                        else {
                            // collapse the operator and its two arguments into a one evaluable binary operation
                            let a = this._elements[maxPrecedenceI - 1];
                            let b = this._elements[maxPrecedenceI + 1];
                            let operation = new binary_operation_js_1.BinaryOperation(opOccurence.operator, a, b, 
                            // TODO: make this not crash when the evaluables have no sources
                            new base_js_2.EvaluableSource(...a.source.tokens, opOccurence.token, ...b.source.tokens));
                            this._elements.splice(maxPrecedenceI - 1, 3, operation);
                            // reset i like this collapse never happened
                            i = maxPrecedenceI - 1;
                        }
                    }
                }
                // after the second pass there should only be one element, being an instance of IEvaluable, so we succeeded
                finalElement = this._elements[0];
            }
            // at this point we have the final element, make sure it is an evaluable
            if (finalElement instanceof base_js_1.Evaluable) {
                if (this._includeSurroundingTokens) {
                    // we are including surrounding tokens, and so the expression needs to exist
                    // build it with surrounding tokens
                    return new expression_js_1.Expression(finalElement, 
                    // TODO: make this not crash when the evaluable has no source
                    new base_js_2.EvaluableSource(...this._startingTokens, ...finalElement.source.tokens, closingToken));
                }
                else {
                    // we are not including surrounding tokens, which means we don't need an expression object
                    // return the root element directly
                    return finalElement;
                }
            }
            else {
                // this expression has a final element that isn't an evaluable, throw
                throw new errors_js_1.KodeSyntaxError(closingToken, `Expression cannot consist of only the "${finalElement.operator.getSymbol()}" operator.`);
            }
        }
    }
}
exports.ExpressionBuilder = ExpressionBuilder;
//# sourceMappingURL=expression-builder.js.map