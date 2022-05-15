import { EvaluationError, Evaluable, FormulaEvaluationTreeNode, Formula, KodeValue, UnaryOperation } from "../kodeine.js";
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
}
/** Holds all side effects produced during evaluation. */
export declare class EvaluationSideEffects {
    warnings: EvaluationWarning[];
    errors: EvaluationError[];
    globalNameStack: string[];
    lastEvaluationTreeNode: FormulaEvaluationTreeNode | null;
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
