"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnclosedQuotedValueWarning = exports.UnclosedDollarSignWarning = exports.ParsingWarning = exports.ParsingSideEffects = exports.ParsingContextBuilder = exports.ParsingContext = void 0;
const kodeine_js_1 = require("../kodeine.js");
/**
 * Exposes function and operator implementations.
 * {@link ParsingContextBuilder} provides convenient functions to construct an instance of this class.
 * @see {@link ParsingContextBuilder}
 */
class ParsingContext {
    /**
     * Constructs a {@link ParsingContext} with function and operator implementations.
     * @param functions An object with function names as keys and implementations as values.
     * @param unaryOperators An object with unary operator symbols as keys and implementations as values.
     * @param binaryOperators An object with binary operator symbols as keys and implementations as values.
     */
    constructor(functions, unaryOperators, binaryOperators) {
        /** A collection of all unique operator symbols. */
        this._operatorSymbols = new Set();
        this._functions = functions;
        this._unaryOperators = unaryOperators;
        this._binaryOperators = binaryOperators;
        // collect operator symbols 
        for (const opSymbol in unaryOperators)
            this._operatorSymbols.add(opSymbol);
        for (const opSymbol in binaryOperators)
            this._operatorSymbols.add(opSymbol);
        this.sideEffects = new ParsingSideEffects();
    }
    /**
     * Finds a function implementation with a given name or `null` if it is not found.
     * @param funcName The name of the function to find an implementation for.
     * @returns The function implementation or `null`.
     */
    findFunction(funcName) {
        return this._functions[funcName] ?? null;
    }
    /**
     * Finds a unary operator implementation with a given name or `null` if it is not found.
     * @param symbol The symbol of the unary operator.
     * @returns The operator implementation or `null`.
     */
    findUnaryOperator(symbol) {
        return this._unaryOperators[symbol] ?? null;
    }
    /**
     * Finds a binary operator implementation with a given name or `null` if it is not found.
     * @param symbol The symbol of the binary operator.
     * @returns The operator implementation or `null`.
     */
    findBinaryOperator(symbol) {
        return this._binaryOperators[symbol] ?? null;
    }
    /** Returns an array of operator symbols, sorted by length, descending. */
    getOperatorSymbolsLongestFirst() {
        return Array.from(this._operatorSymbols).sort((a, b) => b.length - a.length);
    }
    /** Returns an array of function names. */
    getFunctionNames() {
        return Object.keys(this._functions);
    }
    clearSideEffects() {
        this.sideEffects = new ParsingSideEffects();
    }
}
exports.ParsingContext = ParsingContext;
/**
 * A helper class to simplify creating {@link ParsingContext} instances.
 * @see {@link ParsingContext}
 */
class ParsingContextBuilder {
    /** Creates a parsing context builder without any functions or operators. */
    constructor() {
        /** An object with function names as keys and implementations as values. */
        this._functions = {};
        /** An object with unary operator symbols as keys and implementations as values. */
        this._unaryOperators = {};
        /** An object with binary operator symbols as keys and implementations as values. */
        this._binaryOperators = {};
    }
    _addFunction(func) {
        this._functions[func.getName()] = func;
    }
    _addUnaryOperator(operator) {
        this._unaryOperators[operator.getSymbol()] = operator;
    }
    _addBinaryOperator(operator) {
        this._binaryOperators[operator.getSymbol()] = operator;
    }
    /**
     * Adds an item to the parsing context. The item can be an instance or simply a class name.
     * @param obj The item to add to the parsing context. Can be an instance or simply a class name.
     * @returns This builder instance for call chaining.
     * @example
     * // add an instance:
     * builder.add(new IfFunction());
     * // add using class name:
     * builder.add(IfFunction);
     */
    add(obj) {
        if (obj instanceof kodeine_js_1.IKodeFunction)
            this._addFunction(obj);
        else if (obj instanceof kodeine_js_1.IUnaryOperator)
            this._addUnaryOperator(obj);
        else if (obj instanceof kodeine_js_1.IBinaryOperator)
            this._addBinaryOperator(obj);
        else
            this.add(new obj());
        return this;
    }
    /**
     * Adds all items passed as arguments to the parsing context.
     * @param objs The items to add.
     * @returns This builder instance for call chaining.
     * @see {@link add} for information about what objects can be added.
     */
    addAll(...objs) {
        objs.forEach(obj => {
            try {
                this.add(obj);
            }
            catch (err) {
                let a = obj;
                throw err;
            }
        });
        return this;
    }
    /**
     * Adds parsing context items from an imported module.
     * @param moduleNamespace The namespace under which the module was imported (see example).
     * @returns This builder instance for call chaining.
     * @example
     * // import a module with function implementations
     * import * as Functions from "./functions.js";
     * // add the module to the parsing context
     * builder.addFromModule(Functions);
     */
    addFromModule(moduleNamespace) {
        for (const className in moduleNamespace) {
            let classFunc = moduleNamespace[className];
            if (classFunc) {
                try {
                    this.add(classFunc);
                }
                catch (err) {
                    throw new Error(`Error when adding ${className} from module ${moduleNamespace.name}: ${err}. Perhaps you left an abstract class in the module?`);
                }
            }
        }
        return this;
    }
    /**
     * Adds default context items to the parsing context.
     * @returns This builder instance for call chaining.
     */
    addDefaults() {
        return this
            // implemented operators
            .addAll(kodeine_js_1.NegationOperator, kodeine_js_1.ExponentiationOperator, kodeine_js_1.MultiplicationOperator, kodeine_js_1.DivisionOperator, kodeine_js_1.ModuloOperator, kodeine_js_1.AdditionOperator, kodeine_js_1.SubtractionOperator, kodeine_js_1.EqualityOperator, kodeine_js_1.InequalityOperator, kodeine_js_1.LesserThanOperator, kodeine_js_1.GreaterThanOperator, kodeine_js_1.LesserThanOrEqualToOperator, kodeine_js_1.GreaterThanOrEqualToOperator, kodeine_js_1.RegexMatchOperator, kodeine_js_1.LogicalOrOperator, kodeine_js_1.LogicalAndOperator)
            // implemented functions
            .addAll(kodeine_js_1.IfFunction, kodeine_js_1.TcFunction, kodeine_js_1.MuFunction, kodeine_js_1.FlFunction, kodeine_js_1.GvFunction, kodeine_js_1.LvFunction)
            // unimplemented functions
            .addAll(kodeine_js_1.LiFunction, kodeine_js_1.AqFunction, kodeine_js_1.NcFunction, kodeine_js_1.NiFunction, kodeine_js_1.WgFunction, kodeine_js_1.RmFunction, kodeine_js_1.CiFunction, kodeine_js_1.ShFunction, kodeine_js_1.WiFunction, kodeine_js_1.BiFunction, kodeine_js_1.SiFunction, kodeine_js_1.MqFunction, kodeine_js_1.TsFunction, kodeine_js_1.BpFunction, kodeine_js_1.CmFunction, kodeine_js_1.BrFunction, kodeine_js_1.DfFunction, kodeine_js_1.MiFunction, kodeine_js_1.WfFunction, kodeine_js_1.TfFunction, kodeine_js_1.UcFunction, kodeine_js_1.CeFunction, kodeine_js_1.AiFunction, kodeine_js_1.FdFunction, kodeine_js_1.DpFunction, kodeine_js_1.TuFunction);
    }
    /**
     * Creates a parsing context with all added items.
     * @returns The built parsing context.
     */
    build() {
        return new ParsingContext(this._functions, this._unaryOperators, this._binaryOperators);
    }
    /** Shorthand for `new ParsingContextBuilder().addDefaults().build()`. */
    static buildDefault() {
        return new ParsingContextBuilder()
            .addDefaults()
            .build();
    }
}
exports.ParsingContextBuilder = ParsingContextBuilder;
/** Holds all side effects produced during parsing. */
class ParsingSideEffects {
    constructor() {
        /** A list of warnings produced during parsing. */
        this.warnings = [];
        this.errors = [];
    }
}
exports.ParsingSideEffects = ParsingSideEffects;
/** A warning produced during parsing. */
class ParsingWarning {
    /**
     * Constructs a {@link ParsingWarning} for a token with a message.
     * @param tokens The tokens this warning is related to.
     * @param message A message explaining the warning.
     */
    constructor(message, ...tokens) {
        this.tokens = tokens;
        this.message = message;
    }
}
exports.ParsingWarning = ParsingWarning;
/** Warns about an unclosed dollar sign. */
class UnclosedDollarSignWarning extends ParsingWarning {
    constructor(...tokens) {
        super('Unclosed dollar sign. The $ will be ignored and everything after it will be printed as plain text.', ...tokens);
    }
}
exports.UnclosedDollarSignWarning = UnclosedDollarSignWarning;
class UnclosedQuotedValueWarning extends ParsingWarning {
    constructor(...tokens) {
        super('Unclosed quotation mark. The $ that started this evaluable part will be ignored, and everything after it will be printed as plain text.', ...tokens);
    }
}
exports.UnclosedQuotedValueWarning = UnclosedQuotedValueWarning;
//# sourceMappingURL=parsing-context.js.map