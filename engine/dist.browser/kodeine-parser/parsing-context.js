import { IBinaryOperator, IKodeFunction, IUnaryOperator } from "../base.js";
import { IfFunction } from "../implementations/if-function.js";
import * as UnimplementedFunctions from "../implementations/unimplemented-functions.js";
import * as UnaryOperators from "../implementations/unary-operators.js";
import * as BinaryOperators from "../implementations/binary-operators.js";
/**
 * Exposes function and operator implementations.
 * {@link ParsingContextBuilder} provides convenient functions to construct an instance of this class.
 * @see {@link ParsingContextBuilder}
 */
export class ParsingContext {
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
        var _a;
        return (_a = this._functions[funcName]) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Finds a unary operator implementation with a given name or `null` if it is not found.
     * @param symbol The symbol of the unary operator.
     * @returns The operator implementation or `null`.
     */
    findUnaryOperator(symbol) {
        var _a;
        return (_a = this._unaryOperators[symbol]) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Finds a binary operator implementation with a given name or `null` if it is not found.
     * @param symbol The symbol of the binary operator.
     * @returns The operator implementation or `null`.
     */
    findBinaryOperator(symbol) {
        var _a;
        return (_a = this._binaryOperators[symbol]) !== null && _a !== void 0 ? _a : null;
    }
    /** Returns an array of operator symbols, sorted by length, descending. */
    getOperatorSymbolsLongestFirst() {
        return Array.from(this._operatorSymbols).sort((a, b) => b.length - a.length);
    }
    clearSideEffects() {
        this.sideEffects = new ParsingSideEffects();
    }
}
/**
 * A helper class to simplify creating {@link ParsingContext} instances.
 * @see {@link ParsingContext}
 */
export class ParsingContextBuilder {
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
     * @returns This builder instance for call chaining.
     * @example
     * // add an instance:
     * builder.add(new IfFunction());
     * // add using class name:
     * builder.add(IfFunction);
     */
    add(obj) {
        if (obj instanceof IKodeFunction)
            this._addFunction(obj);
        else if (obj instanceof IUnaryOperator)
            this._addUnaryOperator(obj);
        else if (obj instanceof IBinaryOperator)
            this._addBinaryOperator(obj);
        else
            this.add(new obj());
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
        this.add(IfFunction)
            .addFromModule(UnimplementedFunctions)
            .addFromModule(UnaryOperators)
            .addFromModule(BinaryOperators);
        return this;
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
/** Holds all side effects produced during parsing. */
export class ParsingSideEffects {
    constructor() {
        /** A list of warnings produced during parsing. */
        this.warnings = [];
    }
}
/** A warning produced during parsing. */
export class ParsingWarning {
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
/** Warns about an unclosed dollar sign. */
export class UnclosedDollarSignWarning extends ParsingWarning {
    constructor(...tokens) {
        super('Unclosed dollar sign. The $ will be ignored and everything after it will be printed as plain text.', ...tokens);
    }
}
export class UnclosedQuotedValueWarning extends ParsingWarning {
    constructor(...tokens) {
        super('Unclosed quotation mark. The $ that started this evaluable part will be ignored, and everything after it will be printed as plain text.', ...tokens);
    }
}
//# sourceMappingURL=parsing-context.js.map