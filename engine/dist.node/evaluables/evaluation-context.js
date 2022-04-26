"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnaryMinusStringModeWarning = exports.EvaluationWarning = exports.EvaluationSideEffects = exports.EvaluationContext = void 0;
/** The context of the evaluation, containing the state of the device, editor, the module this evaluation is taking place in etc. */
class EvaluationContext {
    constructor() {
        this.sideEffects = new EvaluationSideEffects();
    }
    clearSideEffects() {
        this.sideEffects = new EvaluationSideEffects();
    }
}
exports.EvaluationContext = EvaluationContext;
/** Holds all side effects produced during evaluation. */
class EvaluationSideEffects {
    constructor() {
        this.warnings = [];
        this.errors = [];
    }
}
exports.EvaluationSideEffects = EvaluationSideEffects;
/** A warning produced during evaluation. */
class EvaluationWarning {
    constructor(evaluable, message) {
        this.evaluable = evaluable;
        this.message = message;
    }
}
exports.EvaluationWarning = EvaluationWarning;
/** Warns about using negation with a non-numeric argument. */
class UnaryMinusStringModeWarning extends EvaluationWarning {
    constructor(operation) {
        super(operation, 'Weird behavior: string negation. Negating a string returns itself with "-null" appended (ex. -abc => abc-null).');
    }
}
exports.UnaryMinusStringModeWarning = UnaryMinusStringModeWarning;
//# sourceMappingURL=evaluation-context.js.map