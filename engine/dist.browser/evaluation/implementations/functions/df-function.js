import { IKodeFunction, EvaluationError } from "../../../kodeine.js";
export class DfFunction extends IKodeFunction {
    getName() { return 'df'; }
    call(evalCtx, call, args) {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}
//# sourceMappingURL=df-function.js.map