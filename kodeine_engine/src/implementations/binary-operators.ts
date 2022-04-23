import { IBinaryOperator, KodeValue } from "../base.js";
import { TwoModeBinaryOperator } from "./two-mode-binary-operator.js";

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

export class ExponentiationOperator extends TwoModeBinaryOperator {
    getSymbol() { return '^'; }
    getPrecedence() { return 5; }
    numericMode(a: number, b: number): number {
        return a ** b;
    }
}


// precedence: 4

export class MultiplicationOperator extends TwoModeBinaryOperator {
    getSymbol() { return '*'; }
    getPrecedence() { return 4; }
    numericMode(a: number, b: number): number {
        return a * b;
    }
}

export class DivisionOperator extends TwoModeBinaryOperator {
    getSymbol() { return '/'; }
    getPrecedence() { return 4; }
    numericMode(a: number, b: number): number {
        return a / b;
    }
}

export class ModuloOperator extends TwoModeBinaryOperator {
    getSymbol() { return '%'; }
    getPrecedence() { return 4; }
    numericMode(a: number, b: number): number {
        return a % b;
    }
}


// precedence: 3

export class AdditionOperator extends IBinaryOperator {
    getSymbol() { return '+'; }
    getPrecedence() { return 3; }
    operation(a: KodeValue, b: KodeValue): KodeValue {
        if (a.isNumeric && b.isNumeric) {
            return new KodeValue(a.numericValue + b.numericValue);
        } else {
            if (a.isNumeric)
                return new KodeValue(a.numericValue + b.text);
            else if (b.isNumeric)
                return new KodeValue(a.text + b.numericValue);
            else
                return new KodeValue(a.text + b.text);
        }
    }
}

export class SubtractionOperator extends TwoModeBinaryOperator {
    getSymbol() { return '-'; }
    getPrecedence() { return 3; }
    numericMode(a: number, b: number): number {
        return a - b;
    }
}


// precedence: 2

export class EqualityOperator extends IBinaryOperator {
    getSymbol() { return '='; }
    getPrecedence() { return 2; }
    operation(a: KodeValue, b: KodeValue): KodeValue {
        if (a.isNumeric && b.isNumeric)
            return new KodeValue(a.numericValue == b.numericValue);
        else if (a.isNumeric || b.isNumeric)
            return new KodeValue(0);
        else
            return new KodeValue(a.text.trim().toLowerCase() == b.text.trim().toLowerCase());
    }
}

export class InequalityOperator extends IBinaryOperator {
    getSymbol() { return '!='; }
    getPrecedence() { return 2; }
    operation(a: KodeValue, b: KodeValue): KodeValue {
        if (a.isNumeric && b.isNumeric)
            return new KodeValue(a.numericValue != b.numericValue);
        else if (a.isNumeric || b.isNumeric)
            return new KodeValue(1);
        else
            return new KodeValue(a.text.trim().toLowerCase() != b.text.trim().toLowerCase());
    }
}

export class LesserThanOperator extends TwoModeBinaryOperator {
    getSymbol() { return '<'; }
    getPrecedence() { return 2; }
    numericMode(a: number, b: number): boolean {
        return a < b;
    }
}

export class GreaterThanOperator extends TwoModeBinaryOperator {
    getSymbol() { return '>'; }
    getPrecedence() { return 2; }
    numericMode(a: number, b: number): boolean {
        return a > b;
    }
}

export class LesserThanOrEqualToOperator extends TwoModeBinaryOperator {
    getSymbol() { return '<='; }
    getPrecedence() { return 2; }
    numericMode(a: number, b: number): boolean {
        return a <= b;
    }
}

export class GreaterThanOrEqualToOperator extends TwoModeBinaryOperator {
    getSymbol() { return '>='; }
    getPrecedence() { return 2; }
    numericMode(a: number, b: number): boolean {
        return a >= b;
    }
}

export class RegexMatchOperator extends IBinaryOperator {
    getSymbol() { return '~='; }
    getPrecedence() { return 2; }
    operation(a: KodeValue, b: KodeValue): KodeValue {
        return new KodeValue(new RegExp(b.text).test(a.text));
    }
}


// precedence: 1

export class LogicalOrOperator extends TwoModeBinaryOperator {
    getSymbol() { return '|'; }
    getPrecedence() { return 1; }
    numericMode(a: number, b: number): number {
        return a == 1 || b == 1 ? 1 : 0;
    }
}

export class LogicalAndOperator extends TwoModeBinaryOperator {
    getSymbol() { return '&'; }
    getPrecedence() { return 1; }
    numericMode(a: number, b: number): number {
        return a == 1 && b == 1 ? 1 : 0;
    }
}
