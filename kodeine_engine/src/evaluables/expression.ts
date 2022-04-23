import { Evaluable, KodeValue } from "../base.js";
import { EvaluableSource, EvaluationContext } from "../base.js";

/** 
 * An expression is a set of evaluables and operators. 
 * The {@link Expression} class wraps an {@link evaluable} 
 * that is the last-in-order operation in the expression,
 * but it also keeps track of the tokens that surround the expression in its {@link source}  
 * 
 * For example, `(2 + 2 * 2)` would have an addition binary operation as its {@link evaluable}
 * and include the opening and closing parentheses in its source tokens  
 * *(then the addition binary operation would have the multiplication binary operation as its right hand side argument)*.
 */
export class Expression extends Evaluable {

    /** The last-in-order operation of this expression, or the only evaluable of this expression. */
    public readonly evaluable: Evaluable;

    /**
     * Constructs an expression from an evaluable and, optionally, a source.
     * @param evaluable The last-in-order operation of this expression, or the only evaluable of this expression.
     * @param source Optionally, a source of this expression.
     */
    constructor(evaluable: Evaluable, source?: EvaluableSource) {
        super(source);
        this.evaluable = evaluable;
    }

    evaluate(env: EvaluationContext): KodeValue {
        return this.evaluable.evaluate(env);
    }

}
