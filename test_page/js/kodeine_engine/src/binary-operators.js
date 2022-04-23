import { IBinaryOperator } from "./abstractions.js";
import { KodeValue } from "./evaluables.js";
// operator precedence values:
// 5    ^
// 4    * / %
// 3    + -
// 2    = != < > <= >= ~=
// 1    | &
/**
 * Base class for operators that work in one way if both arguments are numeric,
 * and otherwise concatenate with the operator symbol in the middle.
 * @example <caption>Example two mode operator.</caption>
 * 2 / 2    // returns 1
 * "a" / 2  // returns "a/2"
 */
export class TwoModeBinaryOperator extends IBinaryOperator {
    /** Selects between a numeric mode and default text mode. */
    operation(a, b) {
        if (a.isNumeric && b.isNumeric) {
            // both values are numeric, run numeric mode
            return new KodeValue(this.numericMode(a.numericValue, b.numericValue));
        }
        else {
            // at least one of the values is not numeric, run text mode
            return new KodeValue(this.textMode(a, b));
        }
    }
    /**
     * Implements the text mode of this operator.
     * The default implementation concatenates two values together
     * and inserts the operator symbol in the middle.
     * @param a The left hand side argument.
     * @param b The right hand side argument.
     * @returns Text mode operation result.
     */
    textMode(a, b) {
        if (a.isNumeric)
            return a.numericValue + this.getSymbol() + b.text;
        else if (b.isNumeric)
            return a.text + this.getSymbol() + b.numericValue;
        else
            return a.text + this.getSymbol() + b.text;
    }
}
// precedence: 5
export class ExponentiationOperator extends TwoModeBinaryOperator {
    getSymbol() { return '^'; }
    getPrecedence() { return 5; }
    numericMode(a, b) {
        return a ** b;
    }
}
// precedence: 4
export class MultiplicationOperator extends TwoModeBinaryOperator {
    getSymbol() { return '*'; }
    getPrecedence() { return 4; }
    numericMode(a, b) {
        return a * b;
    }
}
export class DivisionOperator extends TwoModeBinaryOperator {
    getSymbol() { return '/'; }
    getPrecedence() { return 4; }
    numericMode(a, b) {
        return a / b;
    }
}
export class ModuloOperator extends TwoModeBinaryOperator {
    getSymbol() { return '%'; }
    getPrecedence() { return 4; }
    numericMode(a, b) {
        return a % b;
    }
}
// precedence: 3
export class AdditionOperator extends IBinaryOperator {
    getSymbol() { return '+'; }
    getPrecedence() { return 3; }
    operation(a, b) {
        if (a.isNumeric && b.isNumeric) {
            return new KodeValue(a.numericValue + b.numericValue);
        }
        else {
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
    numericMode(a, b) {
        return a - b;
    }
}
// precedence: 2
export class EqualityOperator extends IBinaryOperator {
    getSymbol() { return '='; }
    getPrecedence() { return 2; }
    operation(a, b) {
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
    operation(a, b) {
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
    numericMode(a, b) {
        return a < b;
    }
}
export class GreaterThanOperator extends TwoModeBinaryOperator {
    getSymbol() { return '>'; }
    getPrecedence() { return 2; }
    numericMode(a, b) {
        return a > b;
    }
}
export class LesserThanOrEqualToOperator extends TwoModeBinaryOperator {
    getSymbol() { return '<='; }
    getPrecedence() { return 2; }
    numericMode(a, b) {
        return a <= b;
    }
}
export class GreaterThanOrEqualToOperator extends TwoModeBinaryOperator {
    getSymbol() { return '>='; }
    getPrecedence() { return 2; }
    numericMode(a, b) {
        return a >= b;
    }
}
export class RegexMatchOperator extends IBinaryOperator {
    getSymbol() { return '~='; }
    getPrecedence() { return 2; }
    operation(a, b) {
        return new KodeValue(new RegExp(b.text).test(a.text));
    }
}
// precedence: 1
export class LogicalOrOperator extends TwoModeBinaryOperator {
    getSymbol() { return '|'; }
    getPrecedence() { return 1; }
    numericMode(a, b) {
        return a == 1 || b == 1 ? 1 : 0;
    }
}
export class LogicalAndOperator extends TwoModeBinaryOperator {
    getSymbol() { return '&'; }
    getPrecedence() { return 1; }
    numericMode(a, b) {
        return a == 1 && b == 1 ? 1 : 0;
    }
}
//# sourceMappingURL=binary-operators.js.map