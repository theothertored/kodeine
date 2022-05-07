/** The context of the evaluation, containing the state of the device, editor, the module this evaluation is taking place in etc. */
export class EvaluationContext {
    constructor() {
        this.iReplacement = null;
        this.globals = new Map();
        this.sideEffects = new EvaluationSideEffects();
    }
    clearSideEffects() {
        this.sideEffects = new EvaluationSideEffects();
    }
    clone() {
        let newCtx = new EvaluationContext();
        // copy i replacement directly
        newCtx.iReplacement = this.iReplacement;
        // clone globals map
        newCtx.globals = new Map(this.globals);
        return newCtx;
    }
}
/** Holds all side effects produced during evaluation. */
export class EvaluationSideEffects {
    constructor() {
        this.warnings = [];
        this.errors = [];
        this.globalNameStack = [];
    }
}
/** A warning produced during evaluation. */
export class EvaluationWarning {
    constructor(evaluable, message) {
        this.evaluable = evaluable;
        this.message = message;
    }
}
/** Warns about using negation with a non-numeric argument. */
export class UnaryMinusStringModeWarning extends EvaluationWarning {
    constructor(operation) {
        super(operation, 'Weird behavior: string negation. Negating a string returns itself with "-null" appended (ex. -abc => abc-null).');
    }
}
//# sourceMappingURL=evaluation-context.js.map