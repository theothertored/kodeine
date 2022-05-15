"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogicalAndOperator = exports.LogicalOrOperator = exports.RegexMatchOperator = exports.GreaterThanOrEqualToOperator = exports.LesserThanOrEqualToOperator = exports.GreaterThanOperator = exports.LesserThanOperator = exports.InequalityOperator = exports.EqualityOperator = exports.SubtractionOperator = exports.AdditionOperator = exports.ModuloOperator = exports.DivisionOperator = exports.MultiplicationOperator = exports.ExponentiationOperator = void 0;
const kodeine_js_1 = require("../../../kodeine.js");
// this module contains implementations of all binary operators available in Kustom.
// most operators here extend TwoModeBinaryOperator and therefore only need to
// implement their symbol, precedence and numeric mode.
// operator precedence values:
// 5    ^
// 4    * / %
// 3    + -
// 2    = != < > <= >= ~=
// 1    | &
// precedence: 5
class ExponentiationOperator extends kodeine_js_1.TwoModeBinaryOperator {
    getSymbol() { return '^'; }
    getPrecedence() { return 5; }
    numericMode(a, b) {
        return a ** b;
    }
}
exports.ExponentiationOperator = ExponentiationOperator;
// precedence: 4
class MultiplicationOperator extends kodeine_js_1.TwoModeBinaryOperator {
    getSymbol() { return '*'; }
    getPrecedence() { return 4; }
    numericMode(a, b) {
        return a * b;
    }
}
exports.MultiplicationOperator = MultiplicationOperator;
class DivisionOperator extends kodeine_js_1.TwoModeBinaryOperator {
    getSymbol() { return '/'; }
    getPrecedence() { return 4; }
    numericMode(a, b) {
        return a / b;
    }
}
exports.DivisionOperator = DivisionOperator;
class ModuloOperator extends kodeine_js_1.TwoModeBinaryOperator {
    getSymbol() { return '%'; }
    getPrecedence() { return 4; }
    numericMode(a, b) {
        return a % b;
    }
}
exports.ModuloOperator = ModuloOperator;
// precedence: 3
class AdditionOperator extends kodeine_js_1.IBinaryOperator {
    getSymbol() { return '+'; }
    getPrecedence() { return 3; }
    operation(evalCtx, operation, a, b) {
        if (!isNaN(a.numericValue) && !isNaN(b.numericValue)) {
            return new kodeine_js_1.KodeValue(a.numericValue + b.numericValue);
        }
        else {
            if (!isNaN(a.numericValue))
                return new kodeine_js_1.KodeValue(a.numericValue + b.text, operation.source);
            else if (!isNaN(b.numericValue))
                return new kodeine_js_1.KodeValue(a.text + b.numericValue, operation.source);
            else
                return new kodeine_js_1.KodeValue(a.text + b.text, operation.source);
        }
    }
}
exports.AdditionOperator = AdditionOperator;
class SubtractionOperator extends kodeine_js_1.TwoModeBinaryOperator {
    getSymbol() { return '-'; }
    getPrecedence() { return 3; }
    numericMode(a, b) {
        return a - b;
    }
}
exports.SubtractionOperator = SubtractionOperator;
// precedence: 2
class EqualityOperator extends kodeine_js_1.IBinaryOperator {
    getSymbol() { return '='; }
    getPrecedence() { return 2; }
    operation(evalCtx, operation, a, b) {
        return new kodeine_js_1.KodeValue(a.equals(b), operation.source);
    }
}
exports.EqualityOperator = EqualityOperator;
class InequalityOperator extends kodeine_js_1.IBinaryOperator {
    getSymbol() { return '!='; }
    getPrecedence() { return 2; }
    operation(evalCtx, operation, a, b) {
        return new kodeine_js_1.KodeValue(!a.equals(b), operation.source);
    }
}
exports.InequalityOperator = InequalityOperator;
class LesserThanOperator extends kodeine_js_1.TwoModeBinaryOperator {
    getSymbol() { return '<'; }
    getPrecedence() { return 2; }
    numericMode(a, b) {
        return a < b;
    }
}
exports.LesserThanOperator = LesserThanOperator;
class GreaterThanOperator extends kodeine_js_1.TwoModeBinaryOperator {
    getSymbol() { return '>'; }
    getPrecedence() { return 2; }
    numericMode(a, b) {
        return a > b;
    }
}
exports.GreaterThanOperator = GreaterThanOperator;
class LesserThanOrEqualToOperator extends kodeine_js_1.TwoModeBinaryOperator {
    getSymbol() { return '<='; }
    getPrecedence() { return 2; }
    numericMode(a, b) {
        return a <= b;
    }
}
exports.LesserThanOrEqualToOperator = LesserThanOrEqualToOperator;
class GreaterThanOrEqualToOperator extends kodeine_js_1.TwoModeBinaryOperator {
    getSymbol() { return '>='; }
    getPrecedence() { return 2; }
    numericMode(a, b) {
        return a >= b;
    }
}
exports.GreaterThanOrEqualToOperator = GreaterThanOrEqualToOperator;
class RegexMatchOperator extends kodeine_js_1.IBinaryOperator {
    getSymbol() { return '~='; }
    getPrecedence() { return 2; }
    operation(evalCtx, operation, a, b) {
        try {
            return new kodeine_js_1.KodeValue(new RegExp(b.text).test(a.text), operation.source);
        }
        catch (err) {
            throw new kodeine_js_1.RegexEvaluationError(operation.argB, err?.toString());
        }
    }
}
exports.RegexMatchOperator = RegexMatchOperator;
// precedence: 1
class LogicalOrOperator extends kodeine_js_1.TwoModeBinaryOperator {
    getSymbol() { return '|'; }
    getPrecedence() { return 1; }
    numericMode(a, b) {
        return a == 1 || b == 1 ? 1 : 0;
    }
}
exports.LogicalOrOperator = LogicalOrOperator;
class LogicalAndOperator extends kodeine_js_1.TwoModeBinaryOperator {
    getSymbol() { return '&'; }
    getPrecedence() { return 1; }
    numericMode(a, b) {
        return a == 1 && b == 1 ? 1 : 0;
    }
}
exports.LogicalAndOperator = LogicalAndOperator;
//# sourceMappingURL=binary-operators.js.map