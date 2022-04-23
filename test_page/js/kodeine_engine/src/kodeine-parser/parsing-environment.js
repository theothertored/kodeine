import { IBinaryOperator, IKodeFunction, IUnaryOperator } from "../base.js";
import { IfFunction } from "../implementations/if-function.js";
import * as UnimplementedFunctions from "../implementations/unimplemented-functions.js";
import * as UnaryOperators from "../implementations/unary-operators.js";
import * as BinaryOperators from "../implementations/binary-operators.js";
export class ParsingEnvironment {
    constructor(functions, unaryOperators, binaryOperators) {
        this._functions = {};
        this._unaryOperators = {};
        this._binaryOperators = {};
        this._operatorSymbols = new Set();
        this._functions = functions;
        this._unaryOperators = unaryOperators;
        this._binaryOperators = binaryOperators;
        for (const opSymbol in unaryOperators)
            this._operatorSymbols.add(opSymbol);
        for (const opSymbol in binaryOperators)
            this._operatorSymbols.add(opSymbol);
    }
    findFunction(funcName) {
        return this._functions[funcName];
    }
    findUnaryOperator(symbol) {
        return this._unaryOperators[symbol];
    }
    findBinaryOperator(symbol) {
        return this._binaryOperators[symbol];
    }
    getSortedOperatorSymbols() {
        return Array.from(this._operatorSymbols).sort((a, b) => b.length - a.length);
    }
}
export class ParsingEnvironmentBuilder {
    constructor() {
        this._functions = {};
        this._unaryOperators = {};
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
    addDefaults() {
        this.add(IfFunction)
            .addFromModule(UnimplementedFunctions)
            .addFromModule(UnaryOperators)
            .addFromModule(BinaryOperators);
        return this;
    }
    build() {
        return new ParsingEnvironment(this._functions, this._unaryOperators, this._binaryOperators);
    }
}
//# sourceMappingURL=parsing-environment.js.map