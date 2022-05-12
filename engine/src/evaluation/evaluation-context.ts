import { 
    EvaluationError,
    Evaluable,
    FormulaEvaluationTreeNode,
    Formula,
    KodeValue,
    UnaryOperation
} from "../kodeine.js";

/** The context of the evaluation, containing the state of the device, editor, the module this evaluation is taking place in etc. */
export class EvaluationContext {

    /** Side effects produced during evaluation. Expected to be cleared using {@link clearSideEffects()} before each evaluation run. */
    public sideEffects: EvaluationSideEffects;

    /** The value that should replace the value literal `i`. Intended to be used in `fl()`. */
    public iReplacement: KodeValue | null = null;

    /** A map of global values and their corresponding formulas. */
    public globals: Map<string, Formula> = new Map<string, Formula>();

    /** 
     * If set to true, a formula evaluation tree should be built during evaluation.
     * After evaluation, the tree can be accessed via `this.sideEffects.lastEvaluationTreeNode`.
     * @see {@link FormulaEvaluationTree}
     */
    public buildEvaluationTree: boolean = false;

    /** Constructs an empty {@link EvaluationContext}. */
    constructor() {
        this.sideEffects = new EvaluationSideEffects();
    }

    /** Clears all {@link sideEffects} from the context. */
    clearSideEffects() {
        this.sideEffects = new EvaluationSideEffects();
    }

    /** Creates a clone of the context with empty side effects. */
    clone(): EvaluationContext {

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

    public warnings: EvaluationWarning[] = [];
    public errors: EvaluationError[] = [];

    public globalNameStack: string[] = [];

    public lastEvaluationTreeNode: FormulaEvaluationTreeNode | null = null;

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
