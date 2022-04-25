"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionModeOverload = exports.FunctionWithModes = void 0;
const base_js_1 = require("../base.js");
/** A base class for functions that have a mode as their first argument. */
class FunctionWithModes extends base_js_1.IKodeFunction {
    constructor() {
        super();
        this._modeOverloads = {};
    }
    mode(name, overloads) {
        this._modeOverloads[name] = overloads;
    }
    call(evalCtx, call, args) {
        let modeName = args[0].text.trim().toLowerCase();
        let modeOverloads = this._modeOverloads[modeName];
        // TODO:
        // - find an overload with the best matching argument pattern
        // - throw an error if no pattern matches
        // - construct an array of arguments to match the pattern
        // - call the overload implementation with the argument array
        let val = modeOverloads[0].func.call(this, ...['wow', 'cool']);
        return new base_js_1.KodeValue(val, new base_js_1.EvaluableSource(...call.source.tokens));
    }
}
exports.FunctionWithModes = FunctionWithModes;
class FunctionModeOverload {
    constructor(args, func) {
        this.args = args;
        this.func = func;
    }
}
exports.FunctionModeOverload = FunctionModeOverload;
//# sourceMappingURL=kode-function-with-modes.js.map