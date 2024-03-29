import { IKodeFunction, ParsingContextBuilder, KodeineParser, KodeValue, EvaluationWarning, EvaluationError, InvalidArgumentCountError, KodeParsingError } from "../../../kodeine.js";
/** Thrown when a parsing error was produced when parsing one of the formulas given as argument to fl(). */
/** A parsing error that was produced when parsing one of the formulas given as argument to fl(). */
export class FlParsingWarning extends EvaluationWarning {
    constructor(formulaTextSource, inIncrement, internalWarning) {
        super(formulaTextSource, `Warning when parsing ${inIncrement ? 'increment' : 'evaluation'} formula in fl(): ` + internalWarning.message);
        this.internalWarning = internalWarning;
    }
}
/** A parsing error that was produced when parsing one of the formulas given as argument to fl(). */
export class FlParsingError extends EvaluationError {
    constructor(formulaTextSource, inIncrement, internalError) {
        super(formulaTextSource, `Error when parsing ${inIncrement ? 'increment' : 'evaluation'} formula in fl(): ` + internalError.message);
        this.internalError = internalError;
    }
}
/** A warning that was produced when evaluating one of the formulas given as argument to fl(). */
export class FlEvaluationWarning extends EvaluationWarning {
    constructor(formulaTextSource, iValue, inIncrement, internalWarning) {
        super(formulaTextSource, `Warning when evaluating ${inIncrement ? 'increment' : 'evaluation'} formula in fl() with i = ${iValue.text}: ` + internalWarning.message);
        this.internalWarning = internalWarning;
    }
}
/** An evaluation error that was produced when evaluating one of the formulas given as argument to fl(). */
export class FlEvaluationError extends EvaluationError {
    constructor(formulaTextSource, iValue, inIncrement, internalError) {
        super(formulaTextSource, `Error when evaluating ${inIncrement ? 'increment' : 'evaluation'} formula in fl() with i = ${iValue.text}: ` + internalError.message);
        this.internalError = internalError;
    }
}
/** Implementation of Kustom's `fl()` (for loop) function. */
export class FlFunction extends IKodeFunction {
    static get maxIterationCount() { return 1000; }
    getName() { return 'fl'; }
    call(evalCtx, call, args) {
        // validate argument count
        if (args.length < 4) {
            throw new InvalidArgumentCountError(call, 'At least four arguments required (start, end, increment, formula text, optional separator).');
        }
        else if (args.length > 5) {
            throw new InvalidArgumentCountError(call, 'At most five arguments allowed (start, end, increment, formula text, optional separator).');
        }
        let iterationCounter = 0;
        // 1st arg - initial value for i
        let i = args[0];
        // 2nd arg - loop exit value
        let endI = args[1];
        // if increment is empty, fl() should return nothing for some reason
        if (!args[2].text) {
            return new KodeValue('', call.source);
        }
        // 3rd arg - increment (ex. "i + 1")
        let incrFormulaText = `$${args[2].text}$`;
        // 4th arg - formula (ex. "tc(cut, text, i, 1)")
        let evalFormulaText = `$${args[3].text}$`;
        // 5th arg - separator (optional)
        let separator = args[4] ? args[4].text : '';
        // we'll be adding the results of each evaluation to this array and at the end joining them with the separator
        let results = [];
        // we'll be parsing using the default context (clone formula context in the future?)
        let parsingCtx = ParsingContextBuilder.buildDefault();
        let parser = new KodeineParser(parsingCtx);
        // we only need to parse each formula once
        let incrFormula;
        let evalFormula;
        try {
            // try to parse the increment formula
            incrFormula = parser.parse(incrFormulaText);
        }
        catch (err) {
            if (err instanceof KodeParsingError) {
                // could not parse the increment formula
                evalCtx.sideEffects.errors.push(new FlParsingError(call.args[2], true, err));
                // set incrFormula to null - i will be set to empty string on every iteration
                incrFormula = null;
            }
            else {
                // rethrow crashes
                throw err;
            }
        }
        // pass errors to parent evalCtx
        parsingCtx.sideEffects.errors.forEach(err => {
            evalCtx.sideEffects.errors.push(new FlParsingError(call.args[2], true, err));
        });
        // pass warnings to parent evalCtx
        parsingCtx.sideEffects.warnings.forEach(warn => {
            evalCtx.sideEffects.warnings.push(new FlParsingWarning(call.args[2], true, warn));
        });
        parsingCtx.clearSideEffects();
        try {
            // try to parse the eval formula
            // make sure to not print $ when the eval formula is empty
            evalFormula = evalFormulaText === '$$' ? null : parser.parse(evalFormulaText);
        }
        catch (err) {
            if (err instanceof KodeParsingError) {
                // could not parse the eval formula
                evalCtx.sideEffects.errors.push(new FlParsingError(this.call.arguments[3], false, err));
                // set evalFormula to null - the formula will "return" empty string on every iteration
                evalFormula = null;
            }
            else {
                // rethrow crashes
                throw err;
            }
        }
        // pass errors to parent evalCtx
        parsingCtx.sideEffects.errors.forEach(err => {
            evalCtx.sideEffects.errors.push(new FlParsingError(call.args[3], false, err));
        });
        // pass warnings to parent evalCtx
        parsingCtx.sideEffects.warnings.forEach(warn => {
            evalCtx.sideEffects.warnings.push(new FlParsingWarning(call.args[3], false, warn));
        });
        // not the cleanest way to get an equality operator implementation
        let eqOperator = parsingCtx.findBinaryOperator('=');
        if (eqOperator === null) {
            throw new Error('Operator with symbol "=" was not found.');
        }
        // clone the current evaluation context
        let childEvalCtx = evalCtx.clone();
        while (iterationCounter++ < FlFunction.maxIterationCount) {
            // update the current value of i in the evaluation context
            childEvalCtx.iReplacement = i;
            // 1. evaluate eval with current i value
            if (evalFormula) {
                try {
                    let evalResult = evalFormula.evaluate(childEvalCtx);
                    results.push(evalResult.text);
                }
                catch (err) {
                    if (err instanceof EvaluationError) {
                        evalCtx.sideEffects.errors.push(new FlEvaluationError(call.args[3], i, false, err));
                    }
                    else {
                        // rethrow crashes
                        throw err;
                    }
                }
                // pass errors to parent evalCtx
                childEvalCtx.sideEffects.errors.forEach(err => {
                    evalCtx.sideEffects.errors.push(new FlEvaluationError(call.args[3], i, false, err));
                });
                // pass warnings to parent evalCtx
                childEvalCtx.sideEffects.warnings.forEach(warn => {
                    evalCtx.sideEffects.warnings.push(new FlEvaluationError(call.args[3], i, false, warn));
                });
                // clear errors and warnings, since they've been transferred to parent evalCtx
                childEvalCtx.sideEffects.errors = [];
                childEvalCtx.sideEffects.warnings = [];
            }
            else {
                results.push('');
            }
            // 2. if i value = end i value, exit the loop
            if (i.equals(endI)) {
                break;
            }
            // 3. evaluate increment to get new i value
            if (incrFormula) {
                try {
                    i = incrFormula.evaluate(childEvalCtx);
                }
                catch (err) {
                    if (err instanceof EvaluationError) {
                        evalCtx.sideEffects.errors.push(new FlEvaluationError(call.args[2], i, true, err));
                    }
                    else {
                        // rethrow crashes
                        throw err;
                    }
                }
                // pass errors to parent evalCtx
                childEvalCtx.sideEffects.errors.forEach(err => {
                    evalCtx.sideEffects.errors.push(new FlEvaluationError(call.args[2], i, true, err));
                });
                // pass warnings to parent evalCtx
                childEvalCtx.sideEffects.warnings.forEach(warn => {
                    evalCtx.sideEffects.warnings.push(new FlEvaluationError(call.args[2], i, true, warn));
                });
                // clear errors and warnings, since they've been transferred to parent evalCtx
                childEvalCtx.sideEffects.errors = [];
                childEvalCtx.sideEffects.warnings = [];
            }
            else {
                // no valid increment formula, set i to empty string
                i = new KodeValue('');
            }
        }
        // loop finished
        // copy local variables to parent evalCtx (childEvalCtx will be discarded, so we don't need to create a copy of the map)
        evalCtx.sideEffects.localVariables = childEvalCtx.sideEffects.localVariables;
        // add results together using the separator
        return new KodeValue(results.join(separator), call.source);
    }
}
//# sourceMappingURL=fl-function.js.map