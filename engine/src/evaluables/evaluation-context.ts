import { Evaluable, KodeValue } from "../base.js";
import { EvaluationError } from "../errors.js";
import { UnaryOperation } from "./unary-operation.js";

/** The context of the evaluation, containing the state of the device, editor, the module this evaluation is taking place in etc. */
export class EvaluationContext {

    public sideEffects: EvaluationSideEffects;
    public iReplacement: KodeValue | null = null;

    constructor() {
        this.sideEffects = new EvaluationSideEffects();
    }

    clearSideEffects() {
        this.sideEffects = new EvaluationSideEffects();
    }

    clone(): EvaluationContext {

        let newCtx = new EvaluationContext();

        // copy properties to make a clone
        newCtx.iReplacement = this.iReplacement;

        return newCtx;

    }
}


/** Holds all side effects produced during evaluation. */
export class EvaluationSideEffects {

    public warnings: EvaluationWarning[] = [];
    public errors: EvaluationError[] = [];

}

/** A warning produced during evaluation. */
export class EvaluationWarning {

    /** The evaluable this warning is related to. */
    public evaluable: Evaluable;

    /** A message explaining the warning. */
    public message: string;

    constructor(evaluable: Evaluable, message: string) {
        this.evaluable = evaluable;
        this.message = message;
    }

}

/** Warns about using negation with a non-numeric argument. */
export class UnaryMinusStringModeWarning extends EvaluationWarning {

    constructor(operation: UnaryOperation) {
        super(operation, 'Weird behavior: string negation. Negating a string returns itself with "-null" appended (ex. -abc => abc-null).');
    }

}