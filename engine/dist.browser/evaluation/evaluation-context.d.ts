import { EvaluationError, Evaluable, FormulaEvaluationTreeNode, Formula, KodeValue, UnaryOperation } from "../kodeine.js";
export declare const ValidClockModes: readonly ["auto", "12h", "24h"];
export declare type ClockMode = typeof ValidClockModes[number];
export declare const ValidWeekdays: readonly ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
export declare type Weekday = typeof ValidWeekdays[number];
/** The context of the evaluation, containing the state of the device, editor, the module this evaluation is taking place in etc. */
export declare class EvaluationContext {
    /** Side effects produced during evaluation. Expected to be cleared using {@link clearSideEffects()} before each evaluation run. */
    sideEffects: EvaluationSideEffects;
    /** The value that should replace the value literal `i`. Intended to be used in `fl()`. */
    iReplacement: KodeValue | null;
    /** A map of global values and their corresponding formulas. */
    globals: Map<string, Formula>;
    /**
     * If set to true, a formula evaluation tree should be built during evaluation.
     * After evaluation, the tree can be accessed via `this.sideEffects.lastEvaluationTreeNode`.
     * @see {@link FormulaEvaluationTree}
     */
    buildEvaluationTree: boolean;
    /** Constructs an empty {@link EvaluationContext}. */
    constructor();
    /** Clears all {@link sideEffects} from the context. */
    clearSideEffects(): void;
    /** Creates a clone of the context with empty side effects. */
    clone(): EvaluationContext;
    /** Gets the current date. Return a value different from `new Date()` to preview a formula's evaluation result at different dates & times. */
    getNow(): Date;
    /** The current clock mode. Related to a setting in Kustom. */
    clockMode: ClockMode;
    /** The day to treat as the first day of the week. Related to a setting in Kustom. */
    firstDayOfTheWeek: Weekday;
}
/** Holds all side effects produced during evaluation. */
export declare class EvaluationSideEffects {
    warnings: EvaluationWarning[];
    errors: EvaluationError[];
    globalNameStack: string[];
    lastEvaluationTreeNode: FormulaEvaluationTreeNode | null;
    localVariables: Map<string, KodeValue>;
}
/** A warning produced during evaluation. */
export declare class EvaluationWarning {
    /** The evaluable this warning is related to. */
    evaluable: Evaluable;
    /** A message explaining the warning. */
    message: string;
    constructor(evaluable: Evaluable, message: string);
}
/** Warns about using negation with a non-numeric argument. */
export declare class UnaryMinusStringModeWarning extends EvaluationWarning {
    constructor(operation: UnaryOperation);
}
