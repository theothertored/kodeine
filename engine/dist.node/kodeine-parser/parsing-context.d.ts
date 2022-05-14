import { IBinaryOperator, IKodeFunction, IUnaryOperator, KodeParsingError, FormulaToken } from "../kodeine.js";
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
    /** Side effects produced during the last parsing attempt. */
    sideEffects: ParsingSideEffects;
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
    /** Returns an array of function names. */
    getFunctionNames(): string[];
    clearSideEffects(): void;
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
     * @param obj The item to add to the parsing context. Can be an instance or simply a class name.
     * @returns This builder instance for call chaining.
     * @example
     * // add an instance:
     * builder.add(new IfFunction());
     * // add using class name:
     * builder.add(IfFunction);
     */
    add(obj: (new () => ParsingContextItem) | ParsingContextItem): ParsingContextBuilder;
    /**
     * Adds all items passed as arguments to the parsing context.
     * @param objs The items to add.
     * @returns This builder instance for call chaining.
     * @see {@link add} for information about what objects can be added.
     */
    addAll(...objs: (new () => ParsingContextItem | ParsingContextItem)[]): ParsingContextBuilder;
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
/** Holds all side effects produced during parsing. */
export declare class ParsingSideEffects {
    /** A list of warnings produced during parsing. */
    warnings: ParsingWarning[];
    errors: KodeParsingError[];
}
/** A warning produced during parsing. */
export declare class ParsingWarning {
    /** The token this warning is related to. */
    tokens: FormulaToken[];
    /** A message explaining the warning. */
    message: string;
    /**
     * Constructs a {@link ParsingWarning} for a token with a message.
     * @param tokens The tokens this warning is related to.
     * @param message A message explaining the warning.
     */
    constructor(message: string, ...tokens: FormulaToken[]);
}
/** Warns about an unclosed dollar sign. */
export declare class UnclosedDollarSignWarning extends ParsingWarning {
    constructor(...tokens: FormulaToken[]);
}
export declare class UnclosedQuotedValueWarning extends ParsingWarning {
    constructor(...tokens: FormulaToken[]);
}
export {};
