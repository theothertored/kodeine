import {
    IKodeFunction,
    EvaluationError,
    FunctionCall,
    KodeValue,
    EvaluationContext
} from "../../../kodeine.js";

export class DfFunction extends IKodeFunction {
    
    getName() { return 'df'; }

    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {

        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
        
    }

}