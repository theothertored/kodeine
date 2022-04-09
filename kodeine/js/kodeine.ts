
//#region formula tokens


interface IFormulaToken {
    getStartIndex(): number;
    getEndIndex(): number;
    getSourceText(): string;
    getDescription(): string;
}

abstract class BaseToken implements IFormulaToken {

    protected readonly _text: string;
    protected readonly _startIndex: number;

    constructor(text: string, startIndex: number) {
        this._text = text;
        this._startIndex = startIndex;
    }

    getSourceText(): string {
        return this._text;
    }

    getStartIndex(): number {
        return this._startIndex;
    }

    getEndIndex(): number {
        return this._startIndex + this._text.length;
    }

    abstract getDescription(): string;
}


class PlainTextToken extends BaseToken {
    constructor(text: string, startIndex: number) {
        super(text, startIndex);
    }
    getDescription(): string { return 'plain text'; }
}

class EscapedDollarSignToken extends BaseToken {
    constructor(startIndex: number) {
        super('$$', startIndex);
    }
    getDescription(): string { return 'escaped dollar sign'; }
}

class DollarSignToken extends BaseToken {
    constructor(startIndex: number) {
        super('$', startIndex);
    }
    getDescription(): string { return 'dollar sign'; }
}

class WhitespaceToken extends BaseToken {
    constructor(text: string, startIndex: number) {
        super(text, startIndex);
    }
    getDescription(): string { return 'whitespace'; }
}

class OpeningParenthesisToken extends BaseToken {
    constructor(startIndex: number) {
        super('(', startIndex);
    }
    getDescription(): string { return 'opening parenthesis'; }
}

class ClosingParenthesisToken extends BaseToken {
    constructor(startIndex: number) {
        super(')', startIndex);
    }
    getDescription(): string { return 'closing parenthesis'; }
}

class CommaToken extends BaseToken {
    constructor(startIndex: number) {
        super(')', startIndex);
    }
    getDescription(): string { return 'comma'; }
}

class UnclosedQuotedValueToken implements IFormulaToken {

    private readonly _text: string;
    private readonly _startIndex: number;

    constructor(text: string, startIndex: number) {
        this._text = text;
        this._startIndex = startIndex;
    }

    getValue(): string {
        return this._text;
    }

    getStartIndex(): number {
        return this._startIndex;
    }

    getEndIndex(): number {
        return this._startIndex + 1 + this._text.length;
    }

    getSourceText() { return `"${this._text}`; }

    getDescription(): string { return 'unclosed quoted value'; }
}

class QuotedValueToken implements IFormulaToken {

    private readonly _text: string;
    private readonly _startIndex: number;

    constructor(text: string, startIndex: number) {
        this._text = text;
        this._startIndex = startIndex;
    }

    getValue(): string {
        return this._text;
    }

    getStartIndex(): number {
        return this._startIndex;
    }

    getEndIndex(): number {
        return this._startIndex + 1 + this._text.length + 1;
    }

    getSourceText() { return `"${this._text}"`; }

    getDescription(): string { return 'quoted value'; }
}

class UnquotedValueToken extends BaseToken {
    constructor(text: string, startIndex: number) {
        super(text, startIndex);
    }

    getValue(): string {
        return this._text;
    }

    getDescription(): string { return 'unquoted value'; }
}

class OperatorToken extends BaseToken {
    constructor(text: string, startIndex: number) {
        super(text, startIndex);
    }

    getSymbol() { return this._text; }

    is(operatorText: string): boolean { return this._text === operatorText; }

    getDescription(): string { return 'operator'; }
}


// #endregion


//#region functions


abstract class IKodeFunction {
    abstract getName(): string;
    abstract call(env: EvaluationEnvironment, args: KodeValue[]): KodeValue;
}


class DateFormatFunction extends IKodeFunction {
    getName() { return 'df'; }
    call(env: EvaluationEnvironment, args: KodeValue[]): KodeValue {
        throw new Error('Not implemented.');
    }
}

class MathUtilsFunction extends IKodeFunction {
    getName() { return 'mu'; }
    call(env: EvaluationEnvironment, args: KodeValue[]): KodeValue {
        throw new Error('Not implemented.');
    }
}

class TimerUtilsFunction extends IKodeFunction {
    getName() { return 'tu'; }
    call(env: EvaluationEnvironment, args: KodeValue[]): KodeValue {
        throw new Error('Not implemented.');
    }
}


//#endregion


//#region unary operators


abstract class IUnaryOperator {
    abstract getSymbol(): string;
    abstract operation(a: KodeValue): KodeValue;
}


class NegationOperator extends IUnaryOperator {

    getSymbol() { return '-'; }

    operation(a: KodeValue): KodeValue {
        throw new Error('Not implemented.');
    }

}


//#endregion


//#region binary operators


abstract class IBinaryOperator {
    abstract getSymbol(): string;
    abstract getPrecedence(): number;
    abstract operation(a: KodeValue, b: KodeValue): KodeValue;
}


class AdditionOperator extends IBinaryOperator {
    getSymbol() { return '+'; }
    getPrecedence() { return 1; }
    operation(a: KodeValue, b: KodeValue): KodeValue {
        throw new Error("Method not implemented.");
    }
}

class SubtractionOperator extends IBinaryOperator {
    getSymbol() { return '-'; }
    getPrecedence() { return 1; }
    operation(a: KodeValue, b: KodeValue): KodeValue {
        throw new Error("Method not implemented.");
    }
}

//#endregion


//#region evaluables

class EvaluationEnvironment { }


abstract class IEvaluable {
    abstract evaluate(env: EvaluationEnvironment): KodeValue;
}


class KodeValue extends IEvaluable {

    public readonly text: string;
    public readonly source: any;

    constructor(token: (QuotedValueToken | UnquotedValueToken)) {
        super();
        this.source = token;
        this.text = token.getValue();
    }

    evaluate(env: EvaluationEnvironment): KodeValue {
        return this;
    }
}

class FunctionCall extends IEvaluable {

    public readonly func: IKodeFunction;
    public readonly args: IEvaluable[];

    constructor(func: IKodeFunction, args: IEvaluable[]) {
        super();
        this.func = func;
        this.args = args;
    }

    evaluate(env: EvaluationEnvironment): KodeValue {
        return this.func.call(env, this.args.map(a => a.evaluate(env)));
    }

}

class BinaryOperation extends IEvaluable {

    public readonly operator: IBinaryOperator;
    public readonly argA: IEvaluable;
    public readonly argB: IEvaluable;

    constructor(operator: IBinaryOperator, argA: IEvaluable, argB: IEvaluable) {
        super();
        this.operator = operator;
        this.argA = argA;
        this.argB = argB;
    }

    evaluate(env: EvaluationEnvironment): KodeValue {
        return this.operator.operation(this.argA.evaluate(env), this.argB.evaluate(env));
    }

}

class UnaryOperation extends IEvaluable {

    public readonly operator: IUnaryOperator;
    public readonly arg: IEvaluable;

    constructor(operator: IUnaryOperator, arg: IEvaluable) {
        super();
        this.operator = operator;
        this.arg = arg;
    }

    public evaluate(env: EvaluationEnvironment): KodeValue {
        throw new Error('Not implemented.');
    }

}


class ExpressionBuilder {

    protected readonly _env: ParsingEnvironment;

    constructor(env: ParsingEnvironment) {
        this._env = env;
    }

    private _elements: (IEvaluable | IUnaryOperator | IBinaryOperator)[] = [];

    private _getLastElement() {
        return this._elements[this._elements.length - 1];
    }

    addValue(token: (QuotedValueToken | UnquotedValueToken)) {

        let lastElement = this._getLastElement();

        if (lastElement instanceof IEvaluable) {

            // cannot have two values one after another
            throw new KodeSyntaxError(token, 'A value cannot follow another value.');

        }

        this._elements.push(new KodeValue(token));
    }

    addEvaluable(evaluable: IEvaluable, token: IFormulaToken) {

        let lastElement = this._getLastElement();

        if (lastElement instanceof IEvaluable) {

            // cannot have two values one after another
            throw new KodeSyntaxError(token, 'A value cannot follow another value.');

        }

        this._elements.push(evaluable);

    }

    addOperator(token: OperatorToken) {

        let lastElement = this._getLastElement();

        let tokenShouldBeUnaryOperator = !lastElement
            || lastElement instanceof IBinaryOperator
            || lastElement instanceof IUnaryOperator;


        if (tokenShouldBeUnaryOperator) {

            let unaryOperator = this._env.findUnaryOperator(token.getSymbol());

            if (unaryOperator) {

                // found an unary operator
                this._elements.push(unaryOperator);

            } else {

                // unary operator not found
                let binaryOperator = this._env.findBinaryOperator(token.getSymbol());

                if (binaryOperator) {

                    // cannot have a binary operator at the start or after another operator
                    throw new KodeSyntaxError(token, `Left hand side argument for binary operator "${token.getSymbol()}" missing.`);

                } else {

                    // completely unknown operator encountered
                    throw new KodeSyntaxError(token, `Unrecognized operator "${token.getSymbol()}".`);

                }

            }

        } else {

            // token should be a binary operator
            let binaryOperator = this._env.findBinaryOperator(token.getSymbol());

            if (binaryOperator) {

                this._elements.push(binaryOperator);

            } else {

                // binary operator not found
                let unaryOperator = this._env.findUnaryOperator(token.getSymbol());

                if (unaryOperator) {

                    // cannot have an unary operator with a left hand side argument
                    throw new KodeSyntaxError(token, `Unary operator "${token.getSymbol()}" cannot have a left hand side argument.`);

                } else {

                    // completely unknown operator encountered
                    throw new KodeSyntaxError(token, `Unrecognized operator "${token.getSymbol()}".`);

                }

            }

        }
    }

    build(closingToken: IFormulaToken): IEvaluable {

        if (this._elements.length === 0) {

            // empty parentheses - throw
            throw new KodeSyntaxError(closingToken, 'Empty parentheses.');

        } else if (this._elements.length === 1) {

            // only one element in the parentheses
            let onlyElement = this._elements[0];

            if (onlyElement instanceof IEvaluable) {

                return onlyElement;

            } else {

                throw new KodeSyntaxError(closingToken, `Expression cannot consist of only the "${onlyElement.getSymbol()}" operator.`)

            }

        } else {

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

                        } else if (element instanceof IEvaluable) {

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

                        } else {

                            // this should never happen since we're checking for it when adding operators.
                            throw new KodeSyntaxError(closingToken, `Binary operator cannot follow an unary operator.`)

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

                } else {

                    let operator = this._elements[maxPrecedenceI] as IBinaryOperator;

                    if (maxPrecedenceI === 0 || !(this._elements[maxPrecedenceI - 1] instanceof IEvaluable)) {

                        throw new KodeSyntaxError(closingToken, `Left hand side argument for binary operator "${operator.getSymbol()}" missing.`);

                    } else if (maxPrecedenceI === this._elements.length - 1 || !(this._elements[maxPrecedenceI + 1] instanceof IEvaluable)) {

                        throw new KodeSyntaxError(closingToken, `Right hand side argument for binary operator "${operator.getSymbol()}" missing.`);

                    } else {

                        // collapse the operator and its two arguments into a one evaluable binary operation
                        let a = this._elements[maxPrecedenceI - 1] as IEvaluable;
                        let b = this._elements[maxPrecedenceI + 1] as IEvaluable;
                        let operation = new BinaryOperation(operator, a, b);
                        this._elements.splice(maxPrecedenceI - 1, 3, operation);

                        // reset i like this collapse never happened
                        i = maxPrecedenceI - 1;

                    }
                }

            }

            // after the second pass there should only be one element, being an instance of IEvaluable, so we succeeded
            return this._elements[0] as IEvaluable;

        }

    }
}

class FunctionCallBuilder extends ExpressionBuilder {

    private readonly _func: IKodeFunction;
    private _currentArgumentBuilder: ExpressionBuilder;
    private _args: IEvaluable[] = [];

    constructor(env: ParsingEnvironment, func: IKodeFunction) {
        super(env);
        this._func = func;
        this._currentArgumentBuilder = new ExpressionBuilder(env);
    }

    override addValue(token: (QuotedValueToken | UnquotedValueToken)) {
        this._currentArgumentBuilder.addValue(token);
    }

    override addOperator(token: OperatorToken) {
        this._currentArgumentBuilder.addOperator(token);
    }

    nextArgument(comma: CommaToken) {
        this._args.push(this._currentArgumentBuilder.build(comma));
        this._currentArgumentBuilder = new ExpressionBuilder(this._env);
    }

    override build(closingParenthesis: ClosingParenthesisToken): IEvaluable {
        this._args.push(this._currentArgumentBuilder.build(closingParenthesis));

        return new FunctionCall(this._func, this._args);
    }
}


//#endregion


//#region formula parts

class Formula {
    public text: string;
    public parts: IFormulaPart[] = [];
}


interface IFormulaPart {
    evaluate(env: EvaluationEnvironment): string;
}


class PlainTextPart implements IFormulaPart {
    public readonly tokens: IFormulaToken[];

    constructor(tokens: IFormulaToken[]) {
        this.tokens = tokens || [];
    }

    evaluate(env: EvaluationEnvironment): string {
        let output = '';
        for (var token of this.tokens) output += token.getSourceText();
        return output;
    }
}

class EvaluablePart implements IFormulaPart {

    public readonly tokens: IFormulaToken[];
    public readonly evaluable: IEvaluable;

    constructor(tokens: IFormulaToken[], evaluable: IEvaluable) {
        this.tokens = tokens;
        this.evaluable = evaluable;
    }

    evaluate(env: EvaluationEnvironment): string {
        return this.evaluable.evaluate(env).text;
    }
}


//#endregion


//#region errors

class KodeParseError extends Error {
    public token: IFormulaToken;
    constructor(prefix: string, token: IFormulaToken, message: string) {
        super(`${prefix} at index ${token.getStartIndex()}: ${message}`);
    }
}

class KodeSyntaxError extends KodeParseError {
    constructor(token: IFormulaToken, message: string) {
        super('Syntax error', token, message);
    }
}

class KodeFunctionNotFoundError extends KodeParseError {
    constructor(token: UnquotedValueToken) {
        super('Function not found', token, `Function with name "${token.getSourceText()}" was not found.`);
    }
}

class UnrecognizedTokenError extends KodeParseError {
    constructor(token: IFormulaToken) {
        super('Unrecognized token', token, `Token "${token.getDescription()}" was not recognized by the parser.`);
    }
}

//#endregion


class ParsingEnvironment implements IOperatorSymbolProvider {

    private readonly _functions: Record<string, IKodeFunction> = {};
    private readonly _unaryOperators: Record<string, IUnaryOperator> = {};
    private readonly _binaryOperators: Record<string, IBinaryOperator> = {};

    private _operatorSymbols: Set<string> = new Set<string>();

    constructor(...args: (IKodeFunction | IUnaryOperator | IBinaryOperator)[]) {
        args.forEach(arg => this.register(arg));
    }

    register(arg: (IKodeFunction | IUnaryOperator | IBinaryOperator)) {

        if (arg instanceof IKodeFunction)
            return this.registerFunction(arg);
        else if (arg instanceof IUnaryOperator)
            return this.registerUnaryOperator(arg);
        else if (arg instanceof IBinaryOperator)
            return this.registerBinaryOperator(arg);
        else
            throw new Error('Attempted to register an unknown object in the parsing environment.');
    }

    registerFunction(func: IKodeFunction): ParsingEnvironment {
        this._functions[func.getName()] = func;
        return this;
    }

    registerUnaryOperator(operator: IUnaryOperator): ParsingEnvironment {
        this._unaryOperators[operator.getSymbol()] = operator;
        this._operatorSymbols.add(operator.getSymbol());
        return this;
    }

    registerBinaryOperator(operator: IBinaryOperator): ParsingEnvironment {
        this._binaryOperators[operator.getSymbol()] = operator;
        this._operatorSymbols.add(operator.getSymbol());
        return this;
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


    static createDefault(): ParsingEnvironment {
        return new ParsingEnvironment(
            new MathUtilsFunction(),
            new TimerUtilsFunction(),
            new DateFormatFunction(),

            new NegationOperator(),

            new AdditionOperator(),
            new SubtractionOperator()
        );
    }
}


//#region char reader


interface ICharReader {
    peek(charCount: number): string;
    consume(charCount: number): string;
    getPosition(): number;
    EOF(): boolean;
}


class StringCharReader implements ICharReader {

    private _text: string;
    private _position: number;

    constructor(text: string) {
        this._text = text;
        this._position = 0;
    }

    getPosition(): number {
        return this._position;
    }

    peek(charCount: number): string {
        return this._text.substr(this._position, charCount);
    }

    consume(charCount: number): string {
        let oldPos = this._position;
        this._position += charCount;
        return this._text.substr(oldPos, charCount)
    }

    EOF(): boolean {
        return this._position >= this._text.length;
    }

}


//#endregion


//#region lexer

interface ILexer {
    peek(tokenCount: number): IFormulaToken[];
    consume(tokenCount: number): IFormulaToken[];
    EOF(): boolean;
}

interface IOperatorSymbolProvider {
    getSortedOperatorSymbols(): string[];
}

enum KodeineLexerState {
    Default, Kode
}

class KodeineLexer implements ILexer {

    private readonly _charReader: ICharReader;
    private readonly _operatorSymbols: string[];

    private _state = KodeineLexerState.Default;
    private _tokenQueue: IFormulaToken[] = [];

    constructor(charReader: ICharReader, operatorSymbols: string[]) {
        this._charReader = charReader;
        this._operatorSymbols = operatorSymbols;
    }

    peek(tokenCount: number): IFormulaToken[] {

        let outTokens: IFormulaToken[];

        if (this._tokenQueue.length > 0) {
            outTokens = this._tokenQueue.slice(0, tokenCount);
        } else {
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

    consume(tokenCount: number): IFormulaToken[] {

        let outTokens: IFormulaToken[];

        if (this._tokenQueue.length > 0) {
            outTokens = this._tokenQueue.slice(0, tokenCount);
            this._tokenQueue.splice(0, outTokens.length);
        } else {
            outTokens = [];
        }

        while (outTokens.length < tokenCount
            && !this._charReader.EOF()) {

            let nextToken = this._readNextToken();
            outTokens.push(nextToken);

        }

        return outTokens;

    }

    EOF(): boolean {
        return this._charReader.EOF();
    }


    private _readNextToken(): IFormulaToken {

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

                } else {

                    // we found a formula beginning
                    this._state = KodeineLexerState.Kode;
                    return new DollarSignToken(startIndex);

                }

            } else {

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

        } else if (this._state === KodeineLexerState.Kode) {

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

            } else if (char === '(') {

                return new OpeningParenthesisToken(startIndex);

            } else if (char === ')') {

                return new ClosingParenthesisToken(startIndex);

            } else if (char === ',') {

                return new CommaToken(startIndex);

            } else if (char === '"') {

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

                } else {

                    // we found a closing quotation mark, consume the ending quote and return a quoted value token
                    this._charReader.consume(1);
                    return new QuotedValueToken(buffer, startIndex);

                }

            } else {

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

                    } else {

                        // matched first character of operator, but not the entire operator
                        // with kustom's default set that means we have got a ~ or ! (problematic chars)
                        // those chars basically work like value tokens all by themselves
                        return new UnquotedValueToken(char, startIndex);

                    }


                } else {

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


        } else {

            throw new Error('Invalid lexer state: ' + this._state);

        }
    }


    private _isWhitespace(char: string): boolean {
        return char.trim().length === 0;
    }

    private _isUnquotedTextChar(char: string): boolean {
        let isSpecialChar = char === '('
            || char === ')'
            || char === '"'
            || char === ','
            || char === '$'
            || this._operatorSymbols.some(op => op.startsWith(char));

        return !isSpecialChar;
    }


    private _enqueueToken(token: IFormulaToken) {
        this._tokenQueue.push(token);
    }

    private _dequeueToken(): IFormulaToken {
        return this._tokenQueue.shift();
    }
}


//#endregion


//#region parser

interface IParser {
    parse(formulaText: string): Formula;
}

enum KodeineParserState {
    Default, Kode
}

class KodeineParser implements IParser {

    private readonly _lexer: ILexer;
    private readonly _env: ParsingEnvironment;

    private _state = KodeineParserState.Default;

    constructor(lexer: ILexer, env: ParsingEnvironment) {
        this._lexer = lexer;
        this._env = env;
    }

    parse(): Formula {

        let formula = new Formula();

        let tokenBuffer: IFormulaToken[] = [];
        let exprBuilderStack: ExpressionBuilder[] = [];

        function getPrevNonWhitespaceToken(backIndex: number = 1) {

            // start from this index
            let index = tokenBuffer.length - backIndex;

            if (index < 0) {
                // token buffer too small
                return null;
            } else {
                let token = tokenBuffer[index];

                while (token && token instanceof WhitespaceToken) {
                    index--;
                    token = tokenBuffer[index];
                }

                return token;
            }
        };

        function getLastExprBuilder() {
            return exprBuilderStack[exprBuilderStack.length - 1];
        }

        while (!this._lexer.EOF()) {

            // read token
            let token = this._lexer.consume(1)[0];

            if (this._state === KodeineParserState.Default) {

                // we are currently not in a formula

                if (token instanceof DollarSignToken) {

                    // this is a dollar sign token, a formula is beginning
                    this._state = KodeineParserState.Kode

                    // add a base expression builder to the stack
                    exprBuilderStack = [new ExpressionBuilder(this._env)];

                    if (tokenBuffer.length > 0) {

                        // we read some plain text tokens before this point, add a plain text part
                        formula.parts.push(new PlainTextPart(tokenBuffer));
                        // clear the buffer. no matter what, the dollar sign is not going into the output.
                        tokenBuffer = [];

                    }

                } else {

                    // add any other token to the buffer
                    tokenBuffer.push(token);

                }

            } else if (this._state === KodeineParserState.Kode) {

                // we are currently parsing a formula
                // formula tokens:
                // WhitespaceToken, OpeningParenthesisToken, ClosingParenthesisToken, CommaToken, UnclosedQuotedValueToken, QuotedValueToken, UnquotedValueToken, OperatorToken

                if (token instanceof UnquotedValueToken || token instanceof QuotedValueToken) {

                    // pass the token to the current expression builder and let it throw exceptions if necessary
                    getLastExprBuilder().addValue(token);

                } else if (token instanceof OperatorToken) {

                    // pass the token to the current expression builder and let it throw exceptions if necessary
                    getLastExprBuilder().addOperator(token);


                } else if (token instanceof OpeningParenthesisToken) {

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

                    if (prevToken === null || prevToken instanceof OperatorToken) {

                        // if there is no previous token or this parenthesis follows an operator,
                        // the parenthesis starts a subexpression
                        exprBuilderStack.push(new ExpressionBuilder(this._env));

                    } else if (prevToken instanceof UnquotedValueToken) {

                        // if the previous token is an unquoted value token, interpret this as a function call

                        // find a function by name
                        let funcName = prevToken.getSourceText();
                        let func = this._env.findFunction(funcName);

                        if (func) {

                            // found a function call, start a function call builder
                            exprBuilderStack.push(new FunctionCallBuilder(this._env, func));

                        } else {

                            // function not found, throw
                            throw new KodeFunctionNotFoundError(prevToken);

                        }


                    } else {

                        throw new KodeSyntaxError(token, `An opening parenthesis cannot follow a(n) ${token.getDescription()}.`);

                    }

                } else if (token instanceof CommaToken) {

                    let lastExprBuilder = getLastExprBuilder();

                    if (lastExprBuilder instanceof FunctionCallBuilder) {

                        lastExprBuilder.nextArgument(token);

                    } else {

                        throw new KodeSyntaxError(token, `A comma cannot appear outside of function calls.`);

                    }


                } else if (token instanceof ClosingParenthesisToken) {

                    if (exprBuilderStack.length <= 1) {

                        throw new KodeSyntaxError(token, `Too many closing parentheses.`);

                    } else {

                        let evaluable = exprBuilderStack.pop().build(token);

                        getLastExprBuilder().addEvaluable(evaluable, token);

                    }

                } else if (token instanceof DollarSignToken) {

                    // a dollar sign token ends the current evaluable part 

                    if (exprBuilderStack.length > 1) {
                        throw new KodeSyntaxError(tokenBuffer[tokenBuffer.length - 1], `Unclosed parentheses (${exprBuilderStack.length - 1}).`);
                    }

                    formula.parts.push(new EvaluablePart(tokenBuffer, exprBuilderStack.pop().build(token)));

                    this._state = KodeineParserState.Default;
                    tokenBuffer = [];


                } else if (token instanceof UnclosedQuotedValueToken) {

                    // an unclosed quoted value token causes the entire formula to be treated like plain text,
                    // except the leading $ gets removed from the output.
                    this._state = KodeineParserState.Default;

                    formula.parts.push(new PlainTextPart(tokenBuffer));
                    tokenBuffer = [];

                    // there should be no more tokens after an unclosed quoted value token

                } else if (token instanceof WhitespaceToken) {

                    // do nothing with whitespace, but don't throw UnrecognizedTokenError

                } else {
                    throw new UnrecognizedTokenError(token);
                }

                tokenBuffer.push(token);

            } else {
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