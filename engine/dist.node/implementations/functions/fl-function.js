"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlFunction = exports.FlEvaluationError = exports.FlEvaluationWarning = exports.FlParsingError = exports.FlParsingWarning = void 0;
const base_js_1 = require("../../base.js");
const evaluation_context_js_1 = require("../../evaluables/evaluation-context.js");
const errors_js_1 = require("../../errors.js");
const parsing_context_js_1 = require("../../kodeine-parser/parsing-context.js");
const kodeine_parser_js_1 = require("../../kodeine-parser/kodeine-parser.js");
/** Thrown when a parsing error was produced when parsing one of the formulas given as argument to fl(). */
/** A parsing error that was produced when parsing one of the formulas given as argument to fl(). */
class FlParsingWarning extends evaluation_context_js_1.EvaluationWarning {
    constructor(formulaTextSource, inIncrement, internalWarning) {
        super(formulaTextSource, `Warning when parsing ${inIncrement ? 'increment' : 'evaluation'} formula in fl(): ` + internalWarning.message);
        this.internalWarning = internalWarning;
    }
}
exports.FlParsingWarning = FlParsingWarning;
/** A parsing error that was produced when parsing one of the formulas given as argument to fl(). */
class FlParsingError extends errors_js_1.EvaluationError {
    constructor(formulaTextSource, inIncrement, internalError) {
        super(formulaTextSource, `Error when parsing ${inIncrement ? 'increment' : 'evaluation'} formula in fl(): ` + internalError.message);
        this.internalError = internalError;
    }
}
exports.FlParsingError = FlParsingError;
/** A warning that was produced when evaluating one of the formulas given as argument to fl(). */
class FlEvaluationWarning extends evaluation_context_js_1.EvaluationWarning {
    constructor(formulaTextSource, iValue, inIncrement, internalWarning) {
        super(formulaTextSource, `Warning when evaluating ${inIncrement ? 'increment' : 'evaluation'} formula in fl() with i = ${iValue.text}: ` + internalWarning.message);
        this.internalWarning = internalWarning;
    }
}
exports.FlEvaluationWarning = FlEvaluationWarning;
/** An evaluation error that was produced when evaluating one of the formulas given as argument to fl(). */
class FlEvaluationError extends errors_js_1.EvaluationError {
    constructor(formulaTextSource, iValue, inIncrement, internalError) {
        super(formulaTextSource, `Error when evaluating ${inIncrement ? 'increment' : 'evaluation'} formula in fl() with i = ${iValue.text}: ` + internalError.message);
        this.internalError = internalError;
    }
}
exports.FlEvaluationError = FlEvaluationError;
/** Implementation of Kustom's `fl()` function. */
class FlFunction extends base_js_1.IKodeFunction {
    static get maxIterationCount() { return 1000; }
    getName() { return 'fl'; }
    call(evalCtx, call, args) {
        // validate argument count
        if (args.length < 4) {
            throw new errors_js_1.InvalidArgumentCountError(call, 'At least four arguments required (start, end, increment, formula text, optional separator).');
        }
        else if (args.length > 5) {
            throw new errors_js_1.InvalidArgumentCountError(call, 'At most five arguments allowed (start, end, increment, formula text, optional separator).');
        }
        let iterationCounter = 0;
        // 1st arg - initial value for i
        let i = args[0];
        // 2nd arg - loop exit value
        let endI = args[1];
        // if increment is empty, fl() should return nothing for some reason
        if (!args[2].text) {
            return new base_js_1.KodeValue('', call.source);
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
        let parsingCtx = parsing_context_js_1.ParsingContextBuilder.buildDefault();
        let parser = new kodeine_parser_js_1.KodeineParser(parsingCtx);
        // we only need to parse each formula once
        let incrFormula;
        let evalFormula;
        try {
            // try to parse the increment formula
            incrFormula = parser.parse(incrFormulaText);
        }
        catch (err) {
            if (err instanceof errors_js_1.KodeParsingError) {
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
            if (err instanceof errors_js_1.KodeParsingError) {
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
            evalCtx.sideEffects.errors.push(new FlParsingError(call.args[2], true, err));
        });
        // pass warnings to parent evalCtx
        parsingCtx.sideEffects.warnings.forEach(warn => {
            evalCtx.sideEffects.warnings.push(new FlParsingWarning(call.args[2], true, warn));
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
                    if (err instanceof errors_js_1.EvaluationError) {
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
                // clear side effects after adding them to parent evalCtx
                childEvalCtx.clearSideEffects();
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
                    if (err instanceof errors_js_1.EvaluationError) {
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
                // clear side effects after adding them to parent evalCtx
                childEvalCtx.clearSideEffects();
            }
            else {
                // no valid increment formula, set i to empty string
                i = new base_js_1.KodeValue('');
            }
        }
        // loop finished, add results together using the separator
        return new base_js_1.KodeValue(results.join(separator), call.source);
    }
}
exports.FlFunction = FlFunction;
//# sourceMappingURL=fl-function.js.map