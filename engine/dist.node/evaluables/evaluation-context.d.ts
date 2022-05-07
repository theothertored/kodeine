import { Evaluable, KodeValue } from "../base.js";
import { EvaluationError } from "../errors.js";
import { Formula } from "./formula.js";
import { UnaryOperation } from "./unary-operation.js";
/** The context of the evaluation, containing the state of the device, editor, the module this evaluation is taking place in etc. */
export declare class EvaluationContext {
    sideEffects: EvaluationSideEffects;
    iReplacement: KodeValue | null;
    globals: Map<string, Formula>;
    constructor();
    clearSideEffects(): void;
    clone(): EvaluationContext;
}
/** Holds all side effects produced during evaluation. */
export declare class EvaluationSideEffects {
    warnings: EvaluationWarning[];
    errors: EvaluationError[];
    globalNameStack: string[];
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
