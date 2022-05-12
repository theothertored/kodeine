import { IKodeFunction, EvaluationContext, FunctionCall, Evaluable, KodeValue, EvaluationWarning, EvaluationError, KodeParsingError, ParsingWarning } from "../../kodeine.js";
/** Thrown when a parsing error was produced when parsing one of the formulas given as argument to fl(). */
/** A parsing error that was produced when parsing one of the formulas given as argument to fl(). */
export declare class FlParsingWarning extends EvaluationWarning {
    /** The parsing error that was originally thrown. */
    readonly internalWarning: ParsingWarning;
    constructor(formulaTextSource: Evaluable, inIncrement: boolean, internalWarning: ParsingWarning);
}
/** A parsing error that was produced when parsing one of the formulas given as argument to fl(). */
export declare class FlParsingError extends EvaluationError {
    /** The parsing error that was originally thrown. */
    readonly internalError: KodeParsingError;
    constructor(formulaTextSource: Evaluable, inIncrement: boolean, internalError: KodeParsingError);
}
/** A warning that was produced when evaluating one of the formulas given as argument to fl(). */
export declare class FlEvaluationWarning extends EvaluationWarning {
    /** The evaluation error that was originally produced. */
    readonly internalWarning: EvaluationWarning;
    constructor(formulaTextSource: Evaluable, iValue: KodeValue, inIncrement: boolean, internalWarning: EvaluationError);
}
/** An evaluation error that was produced when evaluating one of the formulas given as argument to fl(). */
export declare class FlEvaluationError extends EvaluationError {
    /** The evaluation error that was originally thrown. */
    readonly internalError: EvaluationError;
    constructor(formulaTextSource: Evaluable, iValue: KodeValue, inIncrement: boolean, internalError: EvaluationError);
}
/** Implementation of Kustom's `fl()` function. */
export declare class FlFunction extends IKodeFunction {
    static get maxIterationCount(): number;
    getName(): string;
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue;
}
