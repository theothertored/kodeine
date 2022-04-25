import { Evaluable } from "../base.js";
import { UnaryOperation } from "./unary-operation.js";

/** The context of the evaluation, containing the state of the device, editor, the module this evaluation is taking place in etc. */
export class EvaluationContext {

    public sideEffects: SideEffectCollection;

    constructor() {
        this.sideEffects = new SideEffectCollection();
    }
    
    clearSideEffects() {
        this.sideEffects = new SideEffectCollection();
    }

}

export class SideEffectCollection {

    public warnings: EvaluationWarning[] = [];

}

export class EvaluationWarning {

    public evaluable: Evaluable;
    public message: string;

    constructor(evaluable: Evaluable, message: string) {
        this.evaluable = evaluable;
        this.message = message;
    }

}

export class UnaryMinusStringModeWarning extends EvaluationWarning {

    constructor(operation: UnaryOperation) {
        super(operation, 'Weird behavior: string negation. Negating a string returns itself with "-null" appended (ex. -abc => abc-null).');
    }

}