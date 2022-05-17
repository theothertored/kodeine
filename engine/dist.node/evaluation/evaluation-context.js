"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnaryMinusStringModeWarning = exports.EvaluationWarning = exports.EvaluationSideEffects = exports.EvaluationContext = void 0;
/** The context of the evaluation, containing the state of the device, editor, the module this evaluation is taking place in etc. */
class EvaluationContext {
    /** Constructs an empty {@link EvaluationContext}. */
    constructor() {
        /** The value that should replace the value literal `i`. Intended to be used in `fl()`. */
        this.iReplacement = null;
        /** A map of global values and their corresponding formulas. */
        this.globals = new Map();
        /**
         * If set to true, a formula evaluation tree should be built during evaluation.
         * After evaluation, the tree can be accessed via `this.sideEffects.lastEvaluationTreeNode`.
         * @see {@link FormulaEvaluationTree}
         */
        this.buildEvaluationTree = false;
        /** The current clock mode. Related to a setting in Kustom. */
        this.clockMode = 'auto';
        /** The day to treat as the first day of the week. Related to a setting in Kustom. */
        this.firstDayOfTheWeek = 'mon';
        this.sideEffects = new EvaluationSideEffects();
    }
    /** Clears all {@link sideEffects} from the context. */
    clearSideEffects() {
        this.sideEffects = new EvaluationSideEffects();
    }
    /** Creates a clone of the context with empty side effects. */
    clone() {
        let newCtx = new EvaluationContext();
        // copy i replacement directly
        newCtx.iReplacement = this.iReplacement;
        // clone globals map
        newCtx.globals = new Map(this.globals);
        return newCtx;
    }
    /** Gets the current date. Return a value different from `new Date()` to preview a formula's evaluation result at different dates & times. */
    getNow() {
        return new Date();
    }
}
exports.EvaluationContext = EvaluationContext;
/** Holds all side effects produced during evaluation. */
class EvaluationSideEffects {
    constructor() {
        this.warnings = [];
        this.errors = [];
        this.globalNameStack = [];
        this.lastEvaluationTreeNode = null;
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