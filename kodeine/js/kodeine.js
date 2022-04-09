//#region formula tokens
class BaseToken {
    constructor(text, startIndex) {
        this._text = text;
        this._startIndex = startIndex;
    }
    getSourceText() {
        return this._text;
    }
    getStartIndex() {
        return this._startIndex;
    }
    getEndIndex() {
        return this._startIndex + this._text.length;
    }
}
class PlainTextToken extends BaseToken {
    constructor(text, startIndex) {
        super(text, startIndex);
    }
    getDescription() { return 'plain text'; }
}
class EscapedDollarSignToken extends BaseToken {
    constructor(startIndex) {
        super('$$', startIndex);
    }
    getDescription() { return 'escaped dollar sign'; }
}
class DollarSignToken extends BaseToken {
    constructor(startIndex) {
        super('$', startIndex);
    }
    getDescription() { return 'dollar sign'; }
}
class WhitespaceToken extends BaseToken {
    constructor(text, startIndex) {
        super(text, startIndex);
    }
    getDescription() { return 'whitespace'; }
}
class OpeningParenthesisToken extends BaseToken {
    constructor(startIndex) {
        super('(', startIndex);
    }
    getDescription() { return 'opening parenthesis'; }
}
class ClosingParenthesisToken extends BaseToken {
    constructor(startIndex) {
        super(')', startIndex);
    }
    getDescription() { return 'closing parenthesis'; }
}
class CommaToken extends BaseToken {
    constructor(startIndex) {
        super(')', startIndex);
    }
    getDescription() { return 'comma'; }
}
class UnclosedQuotedValueToken {
    constructor(text, startIndex) {
        this._text = text;
        this._startIndex = startIndex;
    }
    getValue() {
        return this._text;
    }
    getStartIndex() {
        return this._startIndex;
    }
    getEndIndex() {
        return this._startIndex + 1 + this._text.length;
    }
    getSourceText() { return `"${this._text}`; }
    getDescription() { return 'unclosed quoted value'; }
}
class QuotedValueToken {
    constructor(text, startIndex) {
        this._text = text;
        this._startIndex = startIndex;
    }
    getValue() {
        return this._text;
    }
    getStartIndex() {
        return this._startIndex;
    }
    getEndIndex() {
        return this._startIndex + 1 + this._text.length + 1;
    }
    getSourceText() { return `"${this._text}"`; }
    getDescription() { return 'quoted value'; }
}
class UnquotedValueToken extends BaseToken {
    constructor(text, startIndex) {
        super(text, startIndex);
    }
    getValue() {
        return this._text;
    }
    getDescription() { return 'unquoted value'; }
}
class OperatorToken extends BaseToken {
    constructor(text, startIndex) {
        super(text, startIndex);
    }
    getSymbol() { return this._text; }
    is(operatorText) { return this._text === operatorText; }
    getDescription() { return 'operator'; }
}
// #endregion
//#region functions
class IKodeFunction {
}
class LocationInfoFunction extends IKodeFunction {
    getName() { return 'li'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class AirQualityFunction extends IKodeFunction {
    getName() { return 'aq'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class NetworkConnectivityFunction extends IKodeFunction {
    getName() { return 'nc'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class SystemNotificationsFunction extends IKodeFunction {
    getName() { return 'ni'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class TextConverterFunction extends IKodeFunction {
    getName() { return 'tc'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class WebGetFunction extends IKodeFunction {
    getName() { return 'wg'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class ResourceMonitorFunction extends IKodeFunction {
    getName() { return 'rm'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class ColorEditorFunction extends IKodeFunction {
    getName() { return 'ce'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class GlobalVariableFunction extends IKodeFunction {
    getName() { return 'gv'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class ShellCommandFunction extends IKodeFunction {
    getName() { return 'sh'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class CurrentWeatherFunction extends IKodeFunction {
    getName() { return 'wi'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class BatteryInfoFunction extends IKodeFunction {
    getName() { return 'bi'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class SystemInfoFunction extends IKodeFunction {
    getName() { return 'si'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class IfFunction extends IKodeFunction {
    getName() { return 'if'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class MusicQueueFunction extends IKodeFunction {
    getName() { return 'mq'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class TrafficStatsFunction extends IKodeFunction {
    getName() { return 'ts'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class BitmapPaletteFunction extends IKodeFunction {
    getName() { return 'bp'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class ColorMakerFunction extends IKodeFunction {
    getName() { return 'cm'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class BroadcastReceiverFunction extends IKodeFunction {
    getName() { return 'br'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class ForLoopFunction extends IKodeFunction {
    getName() { return 'fl'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class DateFormatFunction extends IKodeFunction {
    getName() { return 'df'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class MusicInfoFunction extends IKodeFunction {
    getName() { return 'mi'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class WeatherForecastFunction extends IKodeFunction {
    getName() { return 'wf'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class TimeSpanFunction extends IKodeFunction {
    getName() { return 'tf'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class UnreadCounterFunction extends IKodeFunction {
    getName() { return 'uc'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class CalendarEventFunction extends IKodeFunction {
    getName() { return 'ci'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class AstronomicalInfoFunction extends IKodeFunction {
    getName() { return 'ai'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class FitnessDataFunction extends IKodeFunction {
    getName() { return 'fd'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class MathUtilsFunction extends IKodeFunction {
    getName() { return 'mu'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class DateParserFunction extends IKodeFunction {
    getName() { return 'dp'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
class TimerUtilsFunction extends IKodeFunction {
    getName() { return 'tu'; }
    call(env, args) {
        throw new Error('Not implemented.');
    }
}
//#endregion
//#region unary operators
class IUnaryOperator {
}
class NegationOperator extends IUnaryOperator {
    getSymbol() { return '-'; }
    operation(a) {
        if (a.isNumeric) {
            return new KodeValue(-a.numericValue);
        }
        else {
            return new KodeValue(a.text + '-null');
        }
    }
}
//#endregion
//#region binary operators
class IBinaryOperator {
}
class TwoModeBinaryOperator extends IBinaryOperator {
    operation(a, b) {
        if (a.isNumeric && b.isNumeric) {
            return new KodeValue(this.numericMode(a.numericValue, b.numericValue));
        }
        else {
            return this.textMode(a, b);
        }
    }
    textMode(a, b) {
        if (a.isNumeric)
            return new KodeValue(a.numericValue + this.getSymbol() + b.text);
        else if (b.isNumeric)
            return new KodeValue(a.text + this.getSymbol() + b.numericValue);
        else
            return new KodeValue(a.text + this.getSymbol() + b.text);
    }
}
// operator precedence values:
// 5    ^
// 4    * / %
// 3    + -
// 2    = != < > <= >= ~=
// 1    | &
// 5
class ExponentiationOperator extends TwoModeBinaryOperator {
    getSymbol() { return '^'; }
    getPrecedence() { return 5; }
    numericMode(a, b) {
        return Math.pow(a, b);
    }
}
// 4
class MultiplicationOperator extends TwoModeBinaryOperator {
    getSymbol() { return '*'; }
    getPrecedence() { return 4; }
    numericMode(a, b) {
        return a * b;
    }
}
class DivisionOperator extends TwoModeBinaryOperator {
    getSymbol() { return '/'; }
    getPrecedence() { return 4; }
    numericMode(a, b) {
        return a / b;
    }
}
class ModuloOperator extends TwoModeBinaryOperator {
    getSymbol() { return '%'; }
    getPrecedence() { return 4; }
    numericMode(a, b) {
        return a % b;
    }
}
// 3
class AdditionOperator extends IBinaryOperator {
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
class SubtractionOperator extends TwoModeBinaryOperator {
    getSymbol() { return '-'; }
    getPrecedence() { return 3; }
    numericMode(a, b) {
        return a - b;
    }
}
// 2
class EqualityOperator extends IBinaryOperator {
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
class InequalityOperator extends IBinaryOperator {
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
class LesserThanOperator extends TwoModeBinaryOperator {
    getSymbol() { return '<'; }
    getPrecedence() { return 2; }
    numericMode(a, b) {
        return a < b;
    }
}
class GreaterThanOperator extends TwoModeBinaryOperator {
    getSymbol() { return '>'; }
    getPrecedence() { return 2; }
    numericMode(a, b) {
        return a > b;
    }
}
class LesserThanOrEqualToOperator extends TwoModeBinaryOperator {
    getSymbol() { return '<='; }
    getPrecedence() { return 2; }
    numericMode(a, b) {
        return a <= b;
    }
}
class GreaterThanOrEqualToOperator extends TwoModeBinaryOperator {
    getSymbol() { return '>='; }
    getPrecedence() { return 2; }
    numericMode(a, b) {
        return a >= b;
    }
}
class RegexMatchOperator extends IBinaryOperator {
    getSymbol() { return '~='; }
    getPrecedence() { return 2; }
    operation(a, b) {
        return new KodeValue(new RegExp(b.text).test(a.text));
    }
}
// 1
class LogicalOrOperator extends TwoModeBinaryOperator {
    getSymbol() { return '|'; }
    getPrecedence() { return 1; }
    numericMode(a, b) {
        return a == 1 || b == 1 ? 1 : 0;
    }
}
class LogicalAndOperator extends TwoModeBinaryOperator {
    getSymbol() { return '&'; }
    getPrecedence() { return 1; }
    numericMode(a, b) {
        return a == 1 && b == 1 ? 1 : 0;
    }
}
//#endregion
//#region evaluables
class IEvaluable {
}
class KodeValue extends IEvaluable {
    constructor(value, source) {
        super();
        if (typeof value === 'boolean') {
            this.numericValue = value ? 1 : 0;
            this.text = this.numericValue.toString();
            this.isNumeric = true;
        }
        else if (typeof value === 'string') {
            this.text = value;
            this.numericValue = Number(value);
            this.isNumeric = !isNaN(this.numericValue);
        }
        else {
            this.numericValue = value;
            this.text = value.toString();
            this.isNumeric = true;
        }
        this.source = source;
    }
    evaluate(env) {
        return this;
    }
    static fromToken(token) {
        return new KodeValue(token.getValue(), token);
    }
}
class FunctionCall extends IEvaluable {
    constructor(func, args) {
        super();
        this.func = func;
        this.args = args;
    }
    evaluate(env) {
        return this.func.call(env, this.args.map(a => a.evaluate(env)));
    }
}
class BinaryOperation extends IEvaluable {
    constructor(operator, argA, argB) {
        super();
        this.operator = operator;
        this.argA = argA;
        this.argB = argB;
    }
    evaluate(env) {
        return this.operator.operation(this.argA.evaluate(env), this.argB.evaluate(env));
    }
}
class UnaryOperation extends IEvaluable {
    constructor(operator, arg) {
        super();
        this.operator = operator;
        this.arg = arg;
    }
    evaluate(env) {
        return this.operator.operation(this.arg.evaluate(env));
    }
}
class ExpressionBuilder {
    constructor(env) {
        this._elements = [];
        this._env = env;
    }
    _getLastElement() {
        return this._elements[this._elements.length - 1];
    }
    addValue(token) {
        let lastElement = this._getLastElement();
        if (lastElement instanceof IEvaluable) {
            // cannot have two values one after another
            throw new KodeSyntaxError(token, 'A value cannot follow another value.');
        }
        this._elements.push(KodeValue.fromToken(token));
    }
    addEvaluable(evaluable, token) {
        let lastElement = this._getLastElement();
        if (lastElement instanceof IEvaluable) {
            // cannot have two values one after another
            throw new KodeSyntaxError(token, 'A value cannot follow another value.');
        }
        this._elements.push(evaluable);
    }
    addOperator(token) {
        let lastElement = this._getLastElement();
        let tokenShouldBeUnaryOperator = !lastElement
            || lastElement instanceof IBinaryOperator
            || lastElement instanceof IUnaryOperator;
        if (tokenShouldBeUnaryOperator) {
            let unaryOperator = this._env.findUnaryOperator(token.getSymbol());
            if (unaryOperator) {
                // found an unary operator
                this._elements.push(unaryOperator);
            }
            else {
                // unary operator not found
                let binaryOperator = this._env.findBinaryOperator(token.getSymbol());
                if (binaryOperator) {
                    // cannot have a binary operator at the start or after another operator
                    throw new KodeSyntaxError(token, `Left hand side argument for binary operator "${token.getSymbol()}" missing.`);
                }
                else {
                    // completely unknown operator encountered
                    throw new KodeSyntaxError(token, `Unrecognized operator "${token.getSymbol()}".`);
                }
            }
        }
        else {
            // token should be a binary operator
            let binaryOperator = this._env.findBinaryOperator(token.getSymbol());
            if (binaryOperator) {
                this._elements.push(binaryOperator);
            }
            else {
                // binary operator not found
                let unaryOperator = this._env.findUnaryOperator(token.getSymbol());
                if (unaryOperator) {
                    // cannot have an unary operator with a left hand side argument
                    throw new KodeSyntaxError(token, `Unary operator "${token.getSymbol()}" cannot have a left hand side argument.`);
                }
                else {
                    // completely unknown operator encountered
                    throw new KodeSyntaxError(token, `Unrecognized operator "${token.getSymbol()}".`);
                }
            }
        }
    }
    build(closingToken) {
        if (this._elements.length === 0) {
            // empty parentheses - throw
            throw new KodeSyntaxError(closingToken, 'Empty parentheses.');
        }
        else if (this._elements.length === 1) {
            // only one element in the parentheses
            let onlyElement = this._elements[0];
            if (onlyElement instanceof IEvaluable) {
                return onlyElement;
            }
            else {
                throw new KodeSyntaxError(closingToken, `Expression cannot consist of only the "${onlyElement.getSymbol()}" operator.`);
            }
        }
        else {
            // multiple elements - construct operations
            // first pass - collapse any unary operators to IEvaluables
            for (var i = 0; i < this._elements.length; i++) {
                let element = this._elements[i];
                if (element instanceof IUnaryOperator) {
                    // if we encountered an unary operator, take every unary operator immediately following it
                    // and the value after all those unary operators and collapse them all into one evaluable
                    let firstElI = i; // the index of the first unary operator in the chain
                    let unaryOpStack = [element];
                    // start a second loop using the same i variable
                    for (i = i + 1; i < this._elements.length; i++) {
                        element = this._elements[i];
                        if (element instanceof IUnaryOperator) {
                            // add all unary operators to the stack
                            unaryOpStack.push(element);
                        }
                        else if (element instanceof IEvaluable) {
                            // if we encountered a value, we need to collapse the entire stack + value into a tree
                            // basically like this: UnaryOperation(UnaryOperation(IEvaluable))
                            let unaryOpCount = unaryOpStack.length;
                            let evaluable = element;
                            while (unaryOpStack.length > 0) {
                                // apply operations in a reverse order by popping the stack
                                let unaryOp = unaryOpStack.pop();
                                evaluable = new UnaryOperation(unaryOp, evaluable);
                            }
                            // replace array elements from first unary operator to last + 1, meaning replace the value too
                            this._elements.splice(firstElI, unaryOpCount + 1, evaluable);
                            // reset i to pretend this collapse didn't happen
                            i = firstElI;
                            // exit this loop
                            break;
                        }
                        else {
                            // this should never happen since we're checking for it when adding operators.
                            throw new KodeSyntaxError(closingToken, `Binary operator cannot follow an unary operator.`);
                        }
                    }
                }
            }
            // after the first pass we should only be left with binary operators and evaluables
            // second pass - determine the order of operations for binary operators and collapse them in the proper order
            while (this._elements.length > 1) {
                // step 1: find binary operator with the highest precedence
                let maxPrecedence = -1;
                let maxPrecedenceI = -1;
                for (var i = 0; i < this._elements.length; i++) {
                    let element = this._elements[i];
                    if (element instanceof IBinaryOperator) {
                        if (element.getPrecedence() > maxPrecedence) {
                            maxPrecedence = element.getPrecedence();
                            maxPrecedenceI = i;
                        }
                    }
                }
                if (maxPrecedenceI === -1) {
                    // this should never happen
                    throw new KodeSyntaxError(closingToken, 'No binary operators found in the expression.');
                }
                else {
                    let operator = this._elements[maxPrecedenceI];
                    if (maxPrecedenceI === 0 || !(this._elements[maxPrecedenceI - 1] instanceof IEvaluable)) {
                        throw new KodeSyntaxError(closingToken, `Left hand side argument for binary operator "${operator.getSymbol()}" missing.`);
                    }
                    else if (maxPrecedenceI === this._elements.length - 1 || !(this._elements[maxPrecedenceI + 1] instanceof IEvaluable)) {
                        throw new KodeSyntaxError(closingToken, `Right hand side argument for binary operator "${operator.getSymbol()}" missing.`);
                    }
                    else {
                        // collapse the operator and its two arguments into a one evaluable binary operation
                        let a = this._elements[maxPrecedenceI - 1];
                        let b = this._elements[maxPrecedenceI + 1];
                        let operation = new BinaryOperation(operator, a, b);
                        this._elements.splice(maxPrecedenceI - 1, 3, operation);
                        // reset i like this collapse never happened
                        i = maxPrecedenceI - 1;
                    }
                }
            }
            // after the second pass there should only be one element, being an instance of IEvaluable, so we succeeded
            return this._elements[0];
        }
    }
}
class FunctionCallBuilder extends ExpressionBuilder {
    constructor(env, func) {
        super(env);
        this._args = [];
        this._func = func;
        this._currentArgumentBuilder = new ExpressionBuilder(env);
    }
    addValue(token) {
        this._currentArgumentBuilder.addValue(token);
    }
    addOperator(token) {
        this._currentArgumentBuilder.addOperator(token);
    }
    nextArgument(comma) {
        this._args.push(this._currentArgumentBuilder.build(comma));
        this._currentArgumentBuilder = new ExpressionBuilder(this._env);
    }
    build(closingParenthesis) {
        this._args.push(this._currentArgumentBuilder.build(closingParenthesis));
        return new FunctionCall(this._func, this._args);
    }
}
//#endregion
//#region formula parts
class Formula {
    constructor() {
        this.parts = [];
    }
    evaluateToString(env) {
        let output = '';
        for (var part of this.parts) {
            output += part.evaluateToString(env);
        }
        return output;
    }
}
class PlainTextPart {
    constructor(tokens) {
        this.tokens = tokens || [];
    }
    evaluateToString(env) {
        let output = '';
        for (var token of this.tokens)
            output += token.getSourceText();
        return output;
    }
}
class EvaluablePart {
    constructor(tokens, evaluable) {
        this.tokens = tokens;
        this.evaluable = evaluable;
    }
    evaluateToString(env) {
        return this.evaluable.evaluate(env).text;
    }
}
//#endregion
//#region errors
class KodeParseError extends Error {
    constructor(prefix, token, message) {
        super(`${prefix} at index ${token.getStartIndex()}: ${message}`);
    }
}
class KodeSyntaxError extends KodeParseError {
    constructor(token, message) {
        super('Syntax error', token, message);
    }
}
class KodeFunctionNotFoundError extends KodeParseError {
    constructor(token) {
        super('Function not found', token, `Function with name "${token.getSourceText()}" was not found.`);
    }
}
class UnrecognizedTokenError extends KodeParseError {
    constructor(token) {
        super('Unrecognized token', token, `Token "${token.getDescription()}" was not recognized by the parser.`);
    }
}
//#endregion
//#region environments
class ParsingEnvironment {
    constructor(...args) {
        this._functions = {};
        this._unaryOperators = {};
        this._binaryOperators = {};
        this._operatorSymbols = new Set();
        args.forEach(arg => this.register(arg));
    }
    register(arg) {
        if (arg instanceof IKodeFunction)
            return this.registerFunction(arg);
        else if (arg instanceof IUnaryOperator)
            return this.registerUnaryOperator(arg);
        else if (arg instanceof IBinaryOperator)
            return this.registerBinaryOperator(arg);
        else
            throw new Error('Attempted to register an unknown object in the parsing environment.');
    }
    registerFunction(func) {
        this._functions[func.getName()] = func;
        return this;
    }
    registerUnaryOperator(operator) {
        this._unaryOperators[operator.getSymbol()] = operator;
        this._operatorSymbols.add(operator.getSymbol());
        return this;
    }
    registerBinaryOperator(operator) {
        this._binaryOperators[operator.getSymbol()] = operator;
        this._operatorSymbols.add(operator.getSymbol());
        return this;
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
    static createDefault() {
        return new ParsingEnvironment(
        // functions
        new LocationInfoFunction(), new AirQualityFunction(), new NetworkConnectivityFunction(), new SystemNotificationsFunction(), new TextConverterFunction(), new WebGetFunction(), new ResourceMonitorFunction(), new ColorEditorFunction(), new GlobalVariableFunction(), new ShellCommandFunction(), new CurrentWeatherFunction(), new BatteryInfoFunction(), new SystemInfoFunction(), new IfFunction(), new MusicQueueFunction(), new TrafficStatsFunction(), new BitmapPaletteFunction(), new ColorMakerFunction(), new BroadcastReceiverFunction(), new ForLoopFunction(), new DateFormatFunction(), new MusicInfoFunction(), new WeatherForecastFunction(), new TimeSpanFunction(), new UnreadCounterFunction(), new CalendarEventFunction(), new AstronomicalInfoFunction(), new FitnessDataFunction(), new MathUtilsFunction(), new DateParserFunction(), new TimerUtilsFunction(), 
        // unary operators
        new NegationOperator(), 
        // binary operators
        new ExponentiationOperator(), new MultiplicationOperator(), new DivisionOperator(), new ModuloOperator(), new AdditionOperator(), new SubtractionOperator(), new EqualityOperator(), new InequalityOperator(), new LesserThanOperator(), new GreaterThanOperator(), new LesserThanOrEqualToOperator(), new GreaterThanOrEqualToOperator(), new RegexMatchOperator(), new LogicalOrOperator(), new LogicalAndOperator());
    }
}
class EvaluationEnvironment {
}
class StringCharReader {
    constructor(text) {
        this._text = text;
        this._position = 0;
    }
    getPosition() {
        return this._position;
    }
    peek(charCount) {
        return this._text.substr(this._position, charCount);
    }
    consume(charCount) {
        let oldPos = this._position;
        this._position += charCount;
        return this._text.substr(oldPos, charCount);
    }
    EOF() {
        return this._position >= this._text.length;
    }
}
var KodeineLexerState;
(function (KodeineLexerState) {
    KodeineLexerState[KodeineLexerState["Default"] = 0] = "Default";
    KodeineLexerState[KodeineLexerState["Kode"] = 1] = "Kode";
})(KodeineLexerState || (KodeineLexerState = {}));
class KodeineLexer {
    constructor(charReader, operatorSymbols) {
        this._state = KodeineLexerState.Default;
        this._tokenQueue = [];
        this._charReader = charReader;
        this._operatorSymbols = operatorSymbols;
    }
    peek(tokenCount) {
        let outTokens;
        if (this._tokenQueue.length > 0) {
            outTokens = this._tokenQueue.slice(0, tokenCount);
        }
        else {
            outTokens = [];
        }
        while (outTokens.length < tokenCount
            && !this._charReader.EOF()) {
            let nextToken = this._readNextToken();
            this._enqueueToken(nextToken);
            outTokens.push(nextToken);
        }
        return outTokens;
    }
    consume(tokenCount) {
        let outTokens;
        if (this._tokenQueue.length > 0) {
            outTokens = this._tokenQueue.slice(0, tokenCount);
            this._tokenQueue.splice(0, outTokens.length);
        }
        else {
            outTokens = [];
        }
        while (outTokens.length < tokenCount
            && !this._charReader.EOF()) {
            let nextToken = this._readNextToken();
            outTokens.push(nextToken);
        }
        return outTokens;
    }
    EOF() {
        return this._charReader.EOF() && this._tokenQueue.length === 0;
    }
    _readNextToken() {
        let startIndex = this._charReader.getPosition();
        let char = this._charReader.consume(1);
        if (this._state === KodeineLexerState.Default) {
            // default state = we are not currently in kode
            if (char === '$') {
                // this segment starts with a $
                // we need to check next char
                let nextChar = this._charReader.peek(1);
                if (nextChar === '$') {
                    // we found a $$
                    this._charReader.consume(1);
                    return new EscapedDollarSignToken(startIndex);
                }
                else {
                    // we found a formula beginning
                    this._state = KodeineLexerState.Kode;
                    return new DollarSignToken(startIndex);
                }
            }
            else {
                // current segment does not start with a $
                // read a plain text token until a $ is peeked
                // put the current character in the buffer
                let buffer = char;
                // read while we are not and EOF and the next character is not a $
                while (!this._charReader.EOF() && this._charReader.peek(1) !== '$') {
                    // consume character into buffer
                    buffer += this._charReader.consume(1);
                }
                // we read all plain text into the buffer, next run will start with EOF or $
                return new PlainTextToken(buffer, startIndex);
            }
        }
        else if (this._state === KodeineLexerState.Kode) {
            // we are currently reading kode
            // read leading whitespace
            if (this._isWhitespace(char)) {
                let buffer = char;
                while (!this._charReader.EOF()
                    && this._isWhitespace(this._charReader.peek(1))) {
                    buffer += this._charReader.consume(1);
                }
                return new WhitespaceToken(buffer, startIndex);
            }
            else if (char === '$') {
                // encountered a dollar sign - reached formula end
                this._state = KodeineLexerState.Default;
                return new DollarSignToken(startIndex);
            }
            else if (char === '(') {
                return new OpeningParenthesisToken(startIndex);
            }
            else if (char === ')') {
                return new ClosingParenthesisToken(startIndex);
            }
            else if (char === ',') {
                return new CommaToken(startIndex);
            }
            else if (char === '"') {
                // encountered a quotation mark - read a quoted value token until a " is peeked
                // start with an empty buffer - we don't consider the quotation marks a part of the string
                let buffer = '';
                while (!this._charReader.EOF() && this._charReader.peek(1) !== '"') {
                    // consume character into buffer
                    buffer += this._charReader.consume(1);
                }
                if (this._charReader.EOF()) {
                    // we found an unclosed quoted value, which is an error, but we don't throw syntax errors in the lexer
                    // instead we return an unclosed quoted value token and let the parser decide what to do with it
                    return new UnclosedQuotedValueToken(buffer, startIndex);
                }
                else {
                    // we found a closing quotation mark, consume the ending quote and return a quoted value token
                    this._charReader.consume(1);
                    return new QuotedValueToken(buffer, startIndex);
                }
            }
            else {
                // find any operators that match
                let initiallyMatchingOperators = this._operatorSymbols.filter(op => op.startsWith(char));
                if (initiallyMatchingOperators.length > 0) {
                    // found at least one operator with first char matching
                    // with kustom's default set of operators, there are no two multi-char operators with the same first character
                    // so there's always going to be one matching operator at most
                    // but if this is to be extensible, it should allow for any number of operators
                    let longestMatchingOperator = '';
                    let longestMatchingOperatorLength = 0;
                    for (var multiCharOperator of initiallyMatchingOperators) {
                        if (multiCharOperator.length > longestMatchingOperatorLength
                            && char + this._charReader.peek(multiCharOperator.length - 1) === multiCharOperator) {
                            // we found a fully matching operator that is longer than the previous fully matching operator
                            longestMatchingOperator = multiCharOperator;
                            longestMatchingOperatorLength = multiCharOperator.length;
                        }
                    }
                    // after that process we either have the longest matching multi-char operator or empty string
                    if (longestMatchingOperator) {
                        // matched an operator
                        this._charReader.consume(longestMatchingOperator.length - 1);
                        return new OperatorToken(longestMatchingOperator, startIndex);
                    }
                    else {
                        // matched first character of operator, but not the entire operator
                        // with kustom's default set that means we have got a ~ or ! (problematic chars)
                        // those chars basically work like value tokens all by themselves
                        return new UnquotedValueToken(char, startIndex);
                    }
                }
                else {
                    // did not match any operators
                    // we could be in an unquoted value token or a function call token
                    // put the current character in the buffer
                    let buffer = char;
                    while (!this._charReader.EOF()
                        && this._isUnquotedTextChar(this._charReader.peek(1))) {
                        buffer += this._charReader.consume(1);
                    }
                    // make a trimmed copy of the buffer
                    let trimmedBuffer = buffer.trim();
                    if (trimmedBuffer.length < buffer.length) {
                        // if the trimmed buffer is of different length than the untrimmed buffer,
                        // there was trailing whitespace, put it in a whitespace token and put that token in the queue
                        this._enqueueToken(new WhitespaceToken(buffer.substr(trimmedBuffer.length), startIndex + trimmedBuffer.length));
                    }
                    // regular unquoted string
                    return new UnquotedValueToken(trimmedBuffer, startIndex);
                }
            }
        }
        else {
            throw new Error('Invalid lexer state: ' + this._state);
        }
    }
    _isWhitespace(char) {
        return char.trim().length === 0;
    }
    _isUnquotedTextChar(char) {
        let isSpecialChar = char === '('
            || char === ')'
            || char === '"'
            || char === ','
            || char === '$'
            || this._operatorSymbols.some(op => op.startsWith(char));
        return !isSpecialChar;
    }
    _enqueueToken(token) {
        this._tokenQueue.push(token);
    }
    _dequeueToken() {
        return this._tokenQueue.shift();
    }
}
var KodeineParserState;
(function (KodeineParserState) {
    KodeineParserState[KodeineParserState["Default"] = 0] = "Default";
    KodeineParserState[KodeineParserState["Kode"] = 1] = "Kode";
})(KodeineParserState || (KodeineParserState = {}));
class KodeineParser {
    constructor(lexer, env) {
        this._state = KodeineParserState.Default;
        this._lexer = lexer;
        this._env = env;
    }
    parse() {
        let formula = new Formula();
        let tokenBuffer = [];
        let exprBuilderStack = [];
        function getPrevNonWhitespaceToken(backIndex = 1) {
            // start from this index
            let index = tokenBuffer.length - backIndex;
            if (index < 0) {
                // token buffer too small
                return null;
            }
            else {
                let token = tokenBuffer[index];
                while (token && token instanceof WhitespaceToken) {
                    index--;
                    token = tokenBuffer[index];
                }
                return token;
            }
        }
        ;
        function getLastExprBuilder() {
            return exprBuilderStack[exprBuilderStack.length - 1];
        }
        while (!this._lexer.EOF()) {
            // read token
            let token = this._lexer.consume(1)[0];
            let skipPushingToBuffer = false;
            if (this._state === KodeineParserState.Default) {
                // we are currently not in a formula
                if (token instanceof DollarSignToken) {
                    // this is a dollar sign token, a formula is beginning
                    this._state = KodeineParserState.Kode;
                    // add a base expression builder to the stack
                    exprBuilderStack = [new ExpressionBuilder(this._env)];
                    if (tokenBuffer.length > 0) {
                        // we read some plain text tokens before this point, add a plain text part
                        formula.parts.push(new PlainTextPart(tokenBuffer));
                        // clear the buffer. no matter what, the dollar sign is not going into the output.
                        tokenBuffer = [token];
                    }
                }
                else {
                    // add any other token to the buffer
                    tokenBuffer.push(token);
                }
            }
            else if (this._state === KodeineParserState.Kode) {
                // we are currently parsing a formula
                // formula tokens:
                // WhitespaceToken, OpeningParenthesisToken, ClosingParenthesisToken, CommaToken, UnclosedQuotedValueToken, QuotedValueToken, UnquotedValueToken, OperatorToken
                if (token instanceof UnquotedValueToken) {
                    // TODO: peek next non-whitespace
                    let nextToken = this._lexer.peek(1)[0];
                    if (nextToken instanceof OpeningParenthesisToken) {
                        // consume the opening parenthesis immediately
                        this._lexer.consume(1);
                        // override the default buffer behaviour
                        skipPushingToBuffer = true;
                        tokenBuffer.push(token);
                        tokenBuffer.push(nextToken);
                        // find a function by name
                        let funcName = token.getValue();
                        let func = this._env.findFunction(funcName);
                        if (func) {
                            // found a function call, start a function call builder
                            exprBuilderStack.push(new FunctionCallBuilder(this._env, func));
                        }
                        else {
                            // function not found, throw
                            throw new KodeFunctionNotFoundError(token);
                        }
                    }
                    else {
                        getLastExprBuilder().addValue(token);
                    }
                }
                else if (token instanceof QuotedValueToken) {
                    // pass the token to the current expression builder and let it throw exceptions if necessary
                    getLastExprBuilder().addValue(token);
                }
                else if (token instanceof OperatorToken) {
                    // pass the token to the current expression builder and let it throw exceptions if necessary
                    getLastExprBuilder().addOperator(token);
                }
                else if (token instanceof OpeningParenthesisToken) {
                    // found an opening parenthesis - it's either a subexpression or a function call
                    // TODO: kustom has some funky behaviour around parentheses:
                    // empty parentheses don't throw even when the function name is invalid
                    // asdf() -> asdf
                    // non-empty parentheses arguments throw
                    // asdf(2) -> err: null
                    // a comma not followed by a value throws
                    // asdf(2,) -> err: argument is missing
                    // binary operators inside of parentheses work and take whatever is in front of the parenthesis as the second argument
                    // regardless of which side the operator got a value on
                    // 1(/2) -> 1/2 -> 0.5
                    // 1(2/) -> 1/2 -> 0.5
                    // 1(2-) -> -1
                    // unary minus with a value gets treated the same as a value, so it throws
                    // 1(-2) -> err: null
                    // unary minus without a value works like it was in front of the value before the parenthesis:
                    // 1(-) -> -1.0
                    // this behaviour overrides operator precedence:
                    // 2 / 2 (a +) -> 22a (a got appended first despite / having a higher precedence)
                    // and it works with subexpressions on the left as well:
                    // (2 + 2)(a +) -> 4a
                    // it does not work with following expressions:
                    // (a+)1 -> err: null
                    // but if you have an unclosed operator following the parenthesis it works:
                    // (a)1/ -> 1/a
                    // when there are multiple operators with missing arguments, the one with the highest precedence gets the value from in front of the parenthesis
                    // 2(2+/2) -> 2 / 2 + 2 -> 3
                    // this is probably a bug, but because it doesn't crash or throw, we need to find a way to simulate it
                    let prevToken = getPrevNonWhitespaceToken();
                    if (prevToken === null || prevToken instanceof OperatorToken || prevToken instanceof OpeningParenthesisToken) {
                        // if there is no previous token or this parenthesis follows an operator,
                        // the parenthesis starts a subexpression
                        exprBuilderStack.push(new ExpressionBuilder(this._env));
                    }
                    else if (prevToken instanceof UnquotedValueToken) {
                        // if the previous token is an unquoted value token, interpret this as a function call
                        throw new KodeSyntaxError(token, `Unquoted value followed by an opening parenthesis wasn't picked up as a function call.`);
                    }
                    else {
                        throw new KodeSyntaxError(token, `An opening parenthesis cannot follow a(n) ${token.getDescription()}.`);
                    }
                }
                else if (token instanceof CommaToken) {
                    let lastExprBuilder = getLastExprBuilder();
                    if (lastExprBuilder instanceof FunctionCallBuilder) {
                        lastExprBuilder.nextArgument(token);
                    }
                    else {
                        throw new KodeSyntaxError(token, `A comma cannot appear outside of function calls.`);
                    }
                }
                else if (token instanceof ClosingParenthesisToken) {
                    if (exprBuilderStack.length <= 1) {
                        throw new KodeSyntaxError(token, `Too many closing parentheses.`);
                    }
                    else {
                        let evaluable = exprBuilderStack.pop().build(token);
                        getLastExprBuilder().addEvaluable(evaluable, token);
                    }
                }
                else if (token instanceof DollarSignToken) {
                    // a dollar sign token ends the current evaluable part
                    skipPushingToBuffer = true;
                    tokenBuffer.push(token);
                    if (exprBuilderStack.length > 1) {
                        throw new KodeSyntaxError(tokenBuffer[tokenBuffer.length], `Unclosed parentheses (${exprBuilderStack.length - 1}).`);
                    }
                    formula.parts.push(new EvaluablePart(tokenBuffer, exprBuilderStack.pop().build(token)));
                    this._state = KodeineParserState.Default;
                    tokenBuffer = [];
                }
                else if (token instanceof UnclosedQuotedValueToken) {
                    // an unclosed quoted value token causes the entire formula to be treated like plain text,
                    // except the leading $ gets removed from the output.
                    this._state = KodeineParserState.Default;
                    formula.parts.push(new PlainTextPart(tokenBuffer));
                    tokenBuffer = [];
                    // there should be no more tokens after an unclosed quoted value token
                }
                else if (token instanceof WhitespaceToken) {
                    // do nothing with whitespace, but don't throw UnrecognizedTokenError
                }
                else {
                    throw new UnrecognizedTokenError(token);
                }
                if (!skipPushingToBuffer) {
                    tokenBuffer.push(token);
                }
            }
            else {
                throw new Error('Invalid parser state.');
            }
        }
        if (tokenBuffer.length > 0) {
            formula.parts.push(new PlainTextPart(tokenBuffer));
            tokenBuffer = [];
        }
        return formula;
    }
}
//#endregion
//# sourceMappingURL=kodeine.js.map