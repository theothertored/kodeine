"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnaryMinusStringModeWarning = exports.EvaluationWarning = exports.SideEffectCollection = exports.EvaluationContext = void 0;
/** The context of the evaluation, containing the state of the device, editor, the module this evaluation is taking place in etc. */
class EvaluationContext {
    constructor() {
        this.sideEffects = new SideEffectCollection();
    }
    clearSideEffects() {
        this.sideEffects = new SideEffectCollection();
    }
}
exports.EvaluationContext = EvaluationContext;
class SideEffectCollection {
    constructor() {
        this.warnings = [];
    }
}
exports.SideEffectCollection = SideEffectCollection;
class EvaluationWarning {
    constructor(evaluable, message) {
        this.evaluable = evaluable;
        this.message = message;
    }
}
exports.EvaluationWarning = EvaluationWarning;
class UnaryMinusStringModeWarning extends EvaluationWarning {
    constructor(operation) {
        super(operation, 'Weird behavior: string negation. Negating a string returns itself with "-null" appended (ex. -abc => abc-null).');
    }
}
exports.UnaryMinusStringModeWarning = UnaryMinusStringModeWarning;
//# sourceMappingURL=evaluation-context.js.map