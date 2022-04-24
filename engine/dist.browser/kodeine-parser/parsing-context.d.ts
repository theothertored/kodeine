import { IBinaryOperator, IKodeFunction, IUnaryOperator } from "../base.js";
/**
 * Exposes function and operator implementations.
 * {@link ParsingContextBuilder} provides convenient functions to construct an instance of this class.
 * @see {@link ParsingContextBuilder}
 */
export declare class ParsingContext {
    /** An object with function names as keys and implementations as values. */
    private readonly _functions;
    /** An object with unary operator symbols as keys and implementations as values. */
    private readonly _unaryOperators;
    /** An object with binary operator symbols as keys and implementations as values. */
    private readonly _binaryOperators;
    /** A collection of all unique operator symbols. */
    private readonly _operatorSymbols;
    /**
     * Constructs a {@link ParsingContext} with function and operator implementations.
     * @param functions An object with function names as keys and implementations as values.
     * @param unaryOperators An object with unary operator symbols as keys and implementations as values.
     * @param binaryOperators An object with binary operator symbols as keys and implementations as values.
     */
    constructor(functions: Record<string, IKodeFunction>, unaryOperators: Record<string, IUnaryOperator>, binaryOperators: Record<string, IBinaryOperator>);
    /**
     * Finds a function implementation with a given name or `null` if it is not found.
     * @param funcName The name of the function to find an implementation for.
     * @returns The function implementation or `null`.
     */
    findFunction(funcName: string): IKodeFunction;
    /**
     * Finds a unary operator implementation with a given name or `null` if it is not found.
     * @param symbol The symbol of the unary operator.
     * @returns The operator implementation or `null`.
     */
    findUnaryOperator(symbol: string): IUnaryOperator;
    /**
     * Finds a binary operator implementation with a given name or `null` if it is not found.
     * @param symbol The symbol of the binary operator.
     * @returns The operator implementation or `null`.
     */
    findBinaryOperator(symbol: string): IBinaryOperator;
    /** Returns an array of operator symbols, sorted by length, descending. */
    getOperatorSymbolsLongestFirst(): string[];
}
/** A union of types that can be added to a parsing context. */
declare type ParsingContextItem = IKodeFunction | IUnaryOperator | IBinaryOperator;
/**
 * A helper class to simplify creating {@link ParsingContext} instances.
 * @see {@link ParsingContext}
 */
export declare class ParsingContextBuilder {
    /** An object with function names as keys and implementations as values. */
    private readonly _functions;
    /** An object with unary operator symbols as keys and implementations as values. */
    private readonly _unaryOperators;
    /** An object with binary operator symbols as keys and implementations as values. */
    private readonly _binaryOperators;
    /** Creates a parsing context builder without any functions or operators. */
    constructor();
    private _addFunction;
    private _addUnaryOperator;
    private _addBinaryOperator;
    /**
     * Adds an item to the parsing context. The item can be an instance or simply a class name.
     * @returns This builder instance for call chaining.
     * @example
     * // add an instance:
     * builder.add(new IfFunction());
     * // add using class name:
     * builder.add(IfFunction);
     */
    add(obj: (new () => ParsingContextItem) | ParsingContextItem): ParsingContextBuilder;
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
    addFromModule(moduleNamespace: any): ParsingContextBuilder;
    /**
     * Adds default context items to the parsing context.
     * @returns This builder instance for call chaining.
     */
    addDefaults(): ParsingContextBuilder;
    /**
     * Creates a parsing context with all added items.
     * @returns The built parsing context.
     */
    build(): ParsingContext;
    /** Shorthand for `new ParsingContextBuilder().addDefaults().build()`. */
    static buildDefault(): ParsingContext;
}
export {};
