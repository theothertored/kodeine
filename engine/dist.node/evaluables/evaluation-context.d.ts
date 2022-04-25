import { Evaluable } from "../base.js";
import { UnaryOperation } from "./unary-operation.js";
/** The context of the evaluation, containing the state of the device, editor, the module this evaluation is taking place in etc. */
export declare class EvaluationContext {
    sideEffects: SideEffectCollection;
    constructor();
    clearSideEffects(): void;
}
export declare class SideEffectCollection {
    warnings: EvaluationWarning[];
}
export declare class EvaluationWarning {
    evaluable: Evaluable;
    message: string;
    constructor(evaluable: Evaluable, message: string);
}
export declare class UnaryMinusStringModeWarning extends EvaluationWarning {
    constructor(operation: UnaryOperation);
}
