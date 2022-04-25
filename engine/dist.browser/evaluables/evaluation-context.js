/** The context of the evaluation, containing the state of the device, editor, the module this evaluation is taking place in etc. */
export class EvaluationContext {
    constructor() {
        this.sideEffects = new SideEffectCollection();
    }
    clearSideEffects() {
        this.sideEffects = new SideEffectCollection();
    }
}
export class SideEffectCollection {
    constructor() {
        this.warnings = [];
    }
}
export class EvaluationWarning {
    constructor(evaluable, message) {
        this.evaluable = evaluable;
        this.message = message;
    }
}
export class UnaryMinusStringModeWarning extends EvaluationWarning {
    constructor(operation) {
        super(operation, 'Weird behavior: string negation. Negating a string returns itself with "-null" appended (ex. -abc => abc-null).');
    }
}
//# sourceMappingURL=evaluation-context.js.map