import { Evaluable, FormulaToken, KodeValue } from "../../base.js";
import { EvaluableSource } from "../../base.js";
import { KodeSyntaxError } from "../../errors.js";
import { BinaryOperation } from "../../evaluables/binary-operation.js";
import { Expression } from "../../evaluables/expression.js";
import { UnaryOperation } from "../../evaluables/unary-operation.js";
import { OperatorToken, QuotedValueToken, UnquotedValueToken } from "../../kodeine-lexer/formula-tokens.js";
import { ParsingContext } from "../parsing-context.js";
import { UnaryOperatorOccurence, BinaryOperatorOccurence } from "./operator-occurences.js";

/** Parsing helper class that can be fed tokens and then builds an evaluable tree. */
export class ExpressionBuilder {

    /** The parsing context. Contains information on what functions and operators exist and ties their names/symbols to implementations. */
    protected readonly _parsingCtx: ParsingContext;

    /** 
     * Whether the built expression should include starting and ending tokens in its source.  
     * Should be true for expressions in parentheses and root formula expressions (between dollar signs).
     */
    protected readonly _includeSurroundingTokens: boolean;

    /** The token or tokens that started this expression (opening parenthesis, dollar sign, function name + opening parenthesis etc.). */
    protected readonly _startingTokens: FormulaToken[];

    /**
     * Constructs an expression builder with a given parsing context.
     * @param parsingCtx The parsing context for this expression builder.
     * @param includeSurroundingTokens Whether the built expression should include starting and ending tokens in its source.
     * @param startingTokens The token or tokens that started the built expression.
     */
    constructor(parsingCtx: ParsingContext, includeSurroundingTokens: boolean, ...startingTokens: FormulaToken[]) {
        this._parsingCtx = parsingCtx;
        this._includeSurroundingTokens = includeSurroundingTokens;
        this._startingTokens = startingTokens;
    }

    /** Elements of the built expression. Expressions consist of evaluables and operators. */
    private _elements: (Evaluable | UnaryOperatorOccurence | BinaryOperatorOccurence)[] = [];

    /** Returns the current last element of {@link _elements}. */
    private _getLastElement() {
        return this._elements[this._elements.length - 1];
    }

    addValue(token: (QuotedValueToken | UnquotedValueToken)) {

        // check the current last element

        let lastElement = this._getLastElement();

        if (lastElement instanceof Evaluable) {

            // ugly if to print a more accurate error message for problematic characters
            if (
                (
                    token instanceof UnquotedValueToken 
                    && (token.getSourceText() == '~' || token.getSourceText() == '!')

                ) || (
                    lastElement instanceof KodeValue
                    && lastElement.source?.tokens.length === 1
                    && lastElement.source.tokens[0] instanceof UnquotedValueToken
                    && (lastElement.text == "~" || lastElement.text == "!")
                )
            ) {

                // detected an unquoted value problematic token
                throw new KodeSyntaxError(
                    token, 
                    'A value cannot follow another value. '
                    + 'Kustom treats first characters of binary operators as standalone unquoted values '
                    + 'when they are not a part of a full operator symbols. ! and ~ both behave this way '
                    + '(first characters of != and ~= respectively).'
                );

            } else {

                // cannot have two values one after another
                throw new KodeSyntaxError(token, 'A value cannot follow another value.');

            }

        }

        // create kode value and add as element
        this._elements.push(KodeValue.fromToken(token));
    }

    addEvaluable(evaluable: Evaluable) {

        // check the current last element
        let lastElement = this._getLastElement();
        if (lastElement instanceof Evaluable) {

            // cannot have two values one after another
            // TODO: make this not crash when an evaluable doesn't have a source.
            throw new KodeSyntaxError(evaluable.source!.tokens[0], 'A value cannot follow another value.');

        }

        this._elements.push(evaluable);

    }

    addOperator(token: OperatorToken) {

        let lastElement = this._getLastElement();

        // the token should be a unary operator if it is the first element of the expression
        // or is preceded by another operator, be it unary or binary.
        let tokenShouldBeUnaryOperator = !lastElement
            || lastElement instanceof BinaryOperatorOccurence
            || lastElement instanceof UnaryOperatorOccurence;


        if (tokenShouldBeUnaryOperator) {

            let unaryOperator = this._parsingCtx.findUnaryOperator(token.getSymbol());

            if (unaryOperator) {

                // found the unary operator
                this._elements.push(new UnaryOperatorOccurence(unaryOperator, token));

            } else {

                // unary operator not found
                let binaryOperator = this._parsingCtx.findBinaryOperator(token.getSymbol());

                if (binaryOperator) {

                    // cannot have a binary operator at the start or after another operator
                    throw new KodeSyntaxError(token, `Left hand side argument for binary operator "${token.getSymbol()}" missing.`);

                } else {

                    // completely unknown operator encountered
                    throw new KodeSyntaxError(token, `Unrecognized operator "${token.getSymbol()}".`);

                }

            }

        } else {

            // token should be a binary operator
            let binaryOperator = this._parsingCtx.findBinaryOperator(token.getSymbol());

            if (binaryOperator) {

                // found the binary operator
                this._elements.push(new BinaryOperatorOccurence(binaryOperator, token));

            } else {

                // binary operator not found
                let unaryOperator = this._parsingCtx.findUnaryOperator(token.getSymbol());

                if (unaryOperator) {

                    // cannot have a unary operator with a left hand side argument
                    throw new KodeSyntaxError(token, `Unary operator "${token.getSymbol()}" cannot have a left hand side argument.`);

                } else {

                    // completely unknown operator encountered
                    throw new KodeSyntaxError(token, `Unrecognized operator "${token.getSymbol()}".`);

                }

            }

        }
    }

    /** Returns whether this expression has any elements. */
    getIsEmpty(): boolean {
        return this._elements.length === 0;
    }

    /**
     * Builds an evaluable tree from added expression elements.
     * @param closingToken The token that is closing this expression (closing parenthesis, dollar sign etc.).
     * @returns An evaluable tree. If {@link includeSurroundingTokens} is `true`, returns an {@link Expression}
     * wrapping an evaluable and containing the opening and closing tokens in its source.
     * Otherwise, returns the root (last-in-order) evaluable of the expression.
     */
    build(closingToken: FormulaToken): Evaluable {

        if (this._elements.length === 0) {

            // empty parentheses - throw
            throw new KodeSyntaxError(closingToken, 'Empty expression.');

        } else {

            // the root element of the expression
            let finalElement: (Evaluable | UnaryOperatorOccurence | BinaryOperatorOccurence);

            if (this._elements.length === 1) {

                // this expression only has one element, so it wil be the root element
                // it needs to be an evaluable - this is checked below the current if.
                finalElement = this._elements[0];

            } else {

                // multiple elements - construct operations

                // first pass - collapse any unary operators to IEvaluables
                for (var i = 0; i < this._elements.length; i++) {

                    let element = this._elements[i];

                    if (element instanceof UnaryOperatorOccurence) {

                        // if we encountered a unary operator, take every unary operator immediately following it
                        // and the value after all those unary operators and collapse them all into one evaluable

                        let firstElI = i; // the index of the first unary operator in the chain
                        let unaryOpStack = [element];

                        // start a second loop using the same i variable
                        for (i = i + 1; i < this._elements.length; i++) {

                            element = this._elements[i];

                            if (element instanceof UnaryOperatorOccurence) {

                                // add all unary operators to the stack
                                unaryOpStack.push(element);

                            } else if (element instanceof Evaluable) {

                                // if we encountered a value, we need to collapse the entire stack + value into a tree
                                // basically like this: UnaryOperation(UnaryOperation(IEvaluable))

                                let unaryOpCount = unaryOpStack.length;
                                let evaluable = element;

                                while (unaryOpStack.length > 0) {

                                    // apply operations in a reverse order by popping the stack
                                    let unaryOpOccurence = unaryOpStack.pop()!;

                                    evaluable = new UnaryOperation(
                                        unaryOpOccurence.operator, evaluable,
                                        // TODO: make this not crash when the evaluable has no source 
                                        new EvaluableSource(unaryOpOccurence.token, ...evaluable.source!.tokens)
                                    );

                                }

                                // replace array elements from first unary operator to last + 1, meaning replace the value too
                                this._elements.splice(firstElI, unaryOpCount + 1, evaluable);

                                // reset i to pretend this collapse didn't happen
                                i = firstElI;

                                // exit this loop
                                break;

                            } else {

                                // this should never happen since we're checking for it when adding operators.
                                throw new KodeSyntaxError(closingToken, `Binary operator cannot follow a unary operator.`)

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

                    } else {

                        let opOccurence = this._elements[maxPrecedenceI] as BinaryOperatorOccurence;

                        if (maxPrecedenceI === 0 || !(this._elements[maxPrecedenceI - 1] instanceof Evaluable)) {

                            throw new KodeSyntaxError(closingToken, `Left hand side argument for binary operator "${opOccurence.operator.getSymbol()}" missing.`);

                        } else if (maxPrecedenceI === this._elements.length - 1 || !(this._elements[maxPrecedenceI + 1] instanceof Evaluable)) {

                            throw new KodeSyntaxError(closingToken, `Right hand side argument for binary operator "${opOccurence.operator.getSymbol()}" missing.`);

                        } else {

                            // collapse the operator and its two arguments into a one evaluable binary operation
                            let a = this._elements[maxPrecedenceI - 1] as Evaluable;
                            let b = this._elements[maxPrecedenceI + 1] as Evaluable;

                            let operation = new BinaryOperation(
                                opOccurence.operator,
                                a,
                                b,
                                // TODO: make this not crash when the evaluables have no sources
                                new EvaluableSource(...a.source!.tokens, opOccurence.token, ...b.source!.tokens)
                            );

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
            if (finalElement instanceof Evaluable) {

                if (this._includeSurroundingTokens) {

                    // we are including surrounding tokens, and so the expression needs to exist
                    // build it with surrounding tokens
                    return new Expression(
                        finalElement,
                        // TODO: make this not crash when the evaluable has no source
                        new EvaluableSource(...this._startingTokens, ...finalElement.source!.tokens, closingToken)
                    );

                } else {

                    // we are not including surrounding tokens, which means we don't need an expression object
                    // return the root element directly
                    return finalElement;

                }


            } else {

                // this expression has a final element that isn't an evaluable, throw
                throw new KodeSyntaxError(closingToken, `Expression cannot consist of only the "${finalElement.operator.getSymbol()}" operator.`)

            }
        }

    }

}
