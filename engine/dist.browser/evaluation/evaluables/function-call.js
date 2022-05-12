import { EvaluationError, Evaluable, EvaluatedFunctionCall, KodeValue } from "../../kodeine.js";
/** A function call, consisting of a kode function being called and arguments for the call. */
export class FunctionCall extends Evaluable {
    /**
     * Constructs a function call from a kode function being called, arguments for the call, and, optionally a source of the call.
     * @param func The kode function being called.
     * @param args The arguments for the function call.
     * @param source Optionally, the source of the call.
     */
    constructor(func, args, source) {
        super(source);
        this.func = func;
        this.args = args;
    }
    evaluate(evalCtx) {
        try {
            if (evalCtx.buildEvaluationTree) {
                let argResults = [];
                let argNodes = [];
                for (let i = 0; i < this.args.length; i++) {
                    const arg = this.args[i];
                    argResults[i] = arg.evaluate(evalCtx);
                    argNodes[i] = evalCtx.sideEffects.lastEvaluationTreeNode;
                }
                let funcResult = this.func.call(evalCtx, this, argResults);
                evalCtx.sideEffects.lastEvaluationTreeNode = new EvaluatedFunctionCall(this, argNodes, funcResult);
                return funcResult;
            }
            else {
                // call the function with an array of values acquired by evaluating all arguments
                return this.func.call(evalCtx, this, this.args.map(a => a.evaluate(evalCtx)));
            }
        }
        catch (err) {
            if (err instanceof EvaluationError) {
                // add error to evaluation side effects
                evalCtx.sideEffects.errors.push(err);
                // return empty string from the function call
                return new KodeValue('', this.source);
            }
            else {
                // rethrow other errors (crashes)
                throw err;
            }
        }
    }
}
//# sourceMappingURL=function-call.js.map