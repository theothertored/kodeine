import { IBinaryOperator, IKodeFunction, IOperator, IUnaryOperator } from "../base.js";
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

    /** An object with function names as keys and implementations as values. */
    private readonly _functions: Record<string, IKodeFunction>;
    
    /** An object with unary operator symbols as keys and implementations as values. */
    private readonly _unaryOperators: Record<string, IUnaryOperator>;

    /** An object with binary operator symbols as keys and implementations as values. */
    private readonly _binaryOperators: Record<string, IBinaryOperator>;

    /** A collection of all unique operator symbols. */
    private readonly _operatorSymbols: Set<string> = new Set<string>();

    /**
     * Constructs a {@link ParsingContext} with function and operator implementations.
     * @param functions An object with function names as keys and implementations as values.
     * @param unaryOperators An object with unary operator symbols as keys and implementations as values.
     * @param binaryOperators An object with binary operator symbols as keys and implementations as values.
     */
    constructor(
        functions: Record<string, IKodeFunction>,
        unaryOperators: Record<string, IUnaryOperator>,
        binaryOperators: Record<string, IBinaryOperator>
    ) {

        this._functions = functions;
        this._unaryOperators = unaryOperators;
        this._binaryOperators = binaryOperators;

        // collect operator symbols 

        for (const opSymbol in unaryOperators)
            this._operatorSymbols.add(opSymbol);

        for (const opSymbol in binaryOperators)
            this._operatorSymbols.add(opSymbol);
    }

    /**
     * Finds a function implementation with a given name or `null` if it is not found.
     * @param funcName The name of the function to find an implementation for.
     * @returns The function implementation or `null`.
     */
    findFunction(funcName: string): IKodeFunction {
        return this._functions[funcName] ?? null;
    }

    /**
     * Finds a unary operator implementation with a given name or `null` if it is not found.
     * @param symbol The symbol of the unary operator.
     * @returns The operator implementation or `null`.
     */
    findUnaryOperator(symbol: string): IUnaryOperator {
        return this._unaryOperators[symbol] ?? null;
    }

    /**
     * Finds a binary operator implementation with a given name or `null` if it is not found.
     * @param symbol The symbol of the binary operator.
     * @returns The operator implementation or `null`.
     */
    findBinaryOperator(symbol: string): IBinaryOperator {
        return this._binaryOperators[symbol] ?? null;
    }

    /** Returns an array of operator symbols, sorted by length, descending. */
    getOperatorSymbolsLongestFirst(): string[] {
        return Array.from(this._operatorSymbols).sort((a, b) => b.length - a.length);
    }

}

/** A union of types that can be added to a parsing context. */
type ParsingContextItem = IKodeFunction | IUnaryOperator | IBinaryOperator;

/** 
 * A helper class to simplify creating {@link ParsingContext} instances.
 * @see {@link ParsingContext}
 */
export class ParsingContextBuilder {

    /** An object with function names as keys and implementations as values. */
    private readonly _functions: Record<string, IKodeFunction> = {};

    /** An object with unary operator symbols as keys and implementations as values. */
    private readonly _unaryOperators: Record<string, IUnaryOperator> = {};

    /** An object with binary operator symbols as keys and implementations as values. */
    private readonly _binaryOperators: Record<string, IBinaryOperator> = {};

    /** Creates a parsing context builder without any functions or operators. */
    constructor() { }

    private _addFunction(func: IKodeFunction) {
        this._functions[func.getName()] = func;
    }

    private _addUnaryOperator(operator: IUnaryOperator) {
        this._unaryOperators[operator.getSymbol()] = operator;
    }

    private _addBinaryOperator(operator: IBinaryOperator) {
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
    add(obj: (new () => ParsingContextItem) | ParsingContextItem): ParsingContextBuilder {

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
    addFromModule(moduleNamespace: any): ParsingContextBuilder {

        for (const className in moduleNamespace) {

            let classFunc = moduleNamespace[className] as (new () => ParsingContextItem);

            if (classFunc) {
                try {
                    this.add(classFunc);
                } catch (err) {
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
    addDefaults(): ParsingContextBuilder {

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
    build(): ParsingContext {
        return new ParsingContext(this._functions, this._unaryOperators, this._binaryOperators);
    }

    /** Shorthand for `new ParsingContextBuilder().addDefaults().build()`. */
    static buildDefault(): ParsingContext {
        return new ParsingContextBuilder()
            .addDefaults()
            .build();
    }

}