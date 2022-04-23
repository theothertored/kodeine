import { IBinaryOperator, IKodeFunction, IOperator, IUnaryOperator } from "../base.js";
import { IfFunction } from "../implementations/if-function.js";
import * as UnimplementedFunctions from "../implementations/unimplemented-functions.js";
import * as UnaryOperators from "../implementations/unary-operators.js";
import * as BinaryOperators from "../implementations/binary-operators.js";

export class ParsingEnvironment {

    private readonly _functions: Record<string, IKodeFunction> = {};
    private readonly _unaryOperators: Record<string, IUnaryOperator> = {};
    private readonly _binaryOperators: Record<string, IBinaryOperator> = {};

    private _operatorSymbols: Set<string> = new Set<string>();

    constructor(
        functions: Record<string, IKodeFunction>,
        unaryOperators: Record<string, IUnaryOperator>,
        binaryOperators: Record<string, IBinaryOperator>
    ) {
        this._functions = functions;
        this._unaryOperators = unaryOperators;
        this._binaryOperators = binaryOperators;

        for (const opSymbol in unaryOperators)
            this._operatorSymbols.add(opSymbol);

        for (const opSymbol in binaryOperators)
            this._operatorSymbols.add(opSymbol);
    }

    findFunction(funcName: string): IKodeFunction {
        return this._functions[funcName];
    }

    findUnaryOperator(symbol: string): IUnaryOperator {
        return this._unaryOperators[symbol];
    }

    findBinaryOperator(symbol: string): IBinaryOperator {
        return this._binaryOperators[symbol];
    }

    getSortedOperatorSymbols(): string[] {
        return Array.from(this._operatorSymbols).sort((a, b) => b.length - a.length);
    }

}

type ParsingEnvironmentItem = IKodeFunction | IUnaryOperator | IBinaryOperator;

export class ParsingEnvironmentBuilder {

    private readonly _functions: Record<string, IKodeFunction> = {};
    private readonly _unaryOperators: Record<string, IUnaryOperator> = {};
    private readonly _binaryOperators: Record<string, IBinaryOperator> = {};

    constructor() {

    }

    private _addFunction(func: IKodeFunction) {
        this._functions[func.getName()] = func;
    }

    private _addUnaryOperator(operator: IUnaryOperator) {
        this._unaryOperators[operator.getSymbol()] = operator;
    }

    private _addBinaryOperator(operator: IBinaryOperator) {
        this._binaryOperators[operator.getSymbol()] = operator;
    }

    add(obj: (new () => ParsingEnvironmentItem) | ParsingEnvironmentItem): ParsingEnvironmentBuilder {

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

    addFromModule(moduleNamespace: any): ParsingEnvironmentBuilder {

        for (const className in moduleNamespace) {

            let classFunc = moduleNamespace[className] as (new () => ParsingEnvironmentItem);

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

    addDefaults(): ParsingEnvironmentBuilder {

        this.add(IfFunction)
            .addFromModule(UnimplementedFunctions)
            .addFromModule(UnaryOperators)
            .addFromModule(BinaryOperators);

        return this;
    }

    build(): ParsingEnvironment {
        return new ParsingEnvironment(this._functions, this._unaryOperators, this._binaryOperators);
    }

}