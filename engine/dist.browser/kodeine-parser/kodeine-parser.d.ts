import { ILexer, IFormulaStringParser, ICharReader } from "../base.js";
import { Formula } from "../evaluables/formula.js";
import { ParsingContext } from "./parsing-context.js";
/**
 * Values representing the current state of the parser.
 * - {@link Default}: Not in an evaluable part of the formula
 * - {@link Kode}: In an evaluable part of the formula
*/
export declare enum KodeineParserState {
    Default = 0,
    Kode = 1
}
/**
 * The default kodeine parser. Uses a {@link StringCharReader} and {@link KodeineLexer}
 * to read a formula text and produce an evaluable {@link Formula} object.
 * The parser is also responsible for throwing {@link KodeSyntaxError}s when something is wrong with the formula.
 * @example
 * //Basic usage:
 * let parser = new KodeineParser(ParsingContextBuilder.buildDefault());
 * let formula = parser.parse('$2 + 2$');
 * let evalCtx = new EvaluationContext();
 * let formulaResult = formula.evaluate(evalCtx); // evaluate to a KodeValue
 * console.log(formulaResult.text);
 */
export declare class KodeineParser implements IFormulaStringParser {
    /** The parsing context. Contains function and operator implementations. */
    private _env;
    /** Constructs a {@link KodeineParser} with a parsing context.*/
    constructor(env: ParsingContext);
    parse(source: string | ICharReader | ILexer): Formula;
    /** The actual parser implementation - takes an {@link ILexer}, produces a {@link Formula}. */
    private _parseCore;
}
