//#region char reader
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
class BaseToken {
    constructor(text, startIndex, endIndex) {
        this._text = text;
        this._startIndex = startIndex;
        this._endIndex = endIndex;
    }
    getStringRepresentation() {
        return this._text;
    }
    getStartIndex() {
        return this._startIndex;
    }
    getEndIndex() {
        return this._endIndex;
    }
}
class PlainTextToken extends BaseToken {
    constructor(text, startIndex, endIndex) {
        super(text, startIndex, endIndex);
    }
}
class EscapedDollarSignToken extends BaseToken {
    constructor(startIndex) {
        super('$$', startIndex, startIndex + 2);
    }
}
class DollarSignToken extends BaseToken {
    constructor(startIndex) {
        super('$', startIndex, startIndex + 1);
    }
}
class OpeningParenthesisToken extends BaseToken {
    constructor(startIndex) {
        super('(', startIndex, startIndex + 1);
    }
}
class ClosingParenthesisToken extends BaseToken {
    constructor(startIndex) {
        super(')', startIndex, startIndex + 1);
    }
}
class CommaToken extends BaseToken {
    constructor(startIndex) {
        super(')', startIndex, startIndex + 1);
    }
}
class UnclosedQuotedValueToken {
    constructor(text, startIndex, endIndex) {
        this._text = text;
        this._startIndex = startIndex;
        this._endIndex = endIndex;
    }
    getText() {
        return this._text;
    }
    getStartIndex() {
        return this._startIndex;
    }
    getEndIndex() {
        return this._endIndex;
    }
    getStringRepresentation() { return `"${this._text}`; }
}
class QuotedValueToken {
    constructor(text, startIndex, endIndex) {
        this._text = text;
        this._startIndex = startIndex;
        this._endIndex = endIndex;
    }
    getText() {
        return this._text;
    }
    getStartIndex() {
        return this._startIndex;
    }
    getEndIndex() {
        return this._endIndex;
    }
    getStringRepresentation() { return `"${this._text}"`; }
}
class UnquotedValueToken extends BaseToken {
    constructor(text, startIndex, endIndex) {
        super(text, startIndex, endIndex);
    }
}
class OperatorToken extends BaseToken {
    constructor(text, startIndex, endIndex) {
        super(text, startIndex, endIndex);
    }
    is(operatorText) {
        return this._text === operatorText;
    }
}
class FunctionCallToken {
    constructor(text, startIndex, endIndex) {
        this._text = text;
        this._startIndex = startIndex;
        this._endIndex = endIndex;
    }
    getText() {
        return this._text;
    }
    getStartIndex() {
        return this._startIndex;
    }
    getEndIndex() {
        return this._endIndex;
    }
    getStringRepresentation() { return `${this._text}(`; }
}
var KodeineLexerState;
(function (KodeineLexerState) {
    KodeineLexerState[KodeineLexerState["Default"] = 0] = "Default";
    KodeineLexerState[KodeineLexerState["Kode"] = 1] = "Kode";
})(KodeineLexerState || (KodeineLexerState = {}));
class KodeineLexer {
    constructor(charReader) {
        this._operators = [
            '<=', '>=', '!=', '~=', '+', '-', '*', '/', '^', '%', '<', '>', '=', '&', '|'
        ].sort((op1, op2) => op1.length - op2.length);
        this._tokenQueue = [];
        this._state = KodeineLexerState.Default;
        this._charReader = charReader;
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
        return this._charReader.EOF();
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
                return new PlainTextToken(buffer, startIndex, this._charReader.getPosition());
            }
        }
        else if (this._state === KodeineLexerState.Kode) {
            // we are currently reading kode
            // read and discard leading whitespace by default
            while (this._isWhitespace(char)) {
                char = this._charReader.consume(1);
            }
            if (char === '$') {
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
                    return new UnclosedQuotedValueToken(buffer, startIndex, this._charReader.getPosition());
                }
                else {
                    // we found a closing quotation mark, consume the ending quote and return a quoted value token
                    this._charReader.consume(1);
                    return new QuotedValueToken(buffer, startIndex, this._charReader.getPosition());
                }
            }
            else {
                // find any operators that match
                let initiallyMatchingOperators = this._operators.filter(op => op.startsWith(char));
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
                        return new OperatorToken(longestMatchingOperator, startIndex, this._charReader.getPosition());
                    }
                    else {
                        // matched first character of operator, but not the entire operator
                        // with kustom's default set that means we have got a ~ or ! (problematic chars)
                        // those chars basically work like value tokens all by themselves
                        return new UnquotedValueToken(char, startIndex, this._charReader.getPosition());
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
                    // regardless of whether this is a function call or an unquoted value token, we don't want leading or trailing whitespace
                    buffer = buffer.trim();
                    let nextChar = this._charReader.peek(1);
                    if (nextChar === '(') {
                        // unquoted string ending with ( means a function call
                        this._charReader.consume(1);
                        return new FunctionCallToken(buffer, startIndex, this._charReader.getPosition());
                    }
                    else {
                        // regular unquoted string
                        return new UnquotedValueToken(buffer, startIndex, this._charReader.getPosition());
                    }
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
            || this._operators.some(op => op.startsWith(char));
        return !isSpecialChar;
    }
    _enqueueToken(token) {
        this._tokenQueue.push(token);
    }
    _dequeueToken() {
        return this._tokenQueue.shift();
    }
}
class PlainTextPart {
    constructor() {
        this.tokens = [];
    }
    getOutput() {
        let output = '';
        for (var token of this.tokens)
            output += token.getStringRepresentation();
        return output;
    }
}
//#endregion
class Formula {
    constructor() {
        this.parts = [];
    }
}
var KodeineParserState;
(function (KodeineParserState) {
    KodeineParserState[KodeineParserState["Default"] = 0] = "Default";
    KodeineParserState[KodeineParserState["Kode"] = 1] = "Kode";
})(KodeineParserState || (KodeineParserState = {}));
class KodeineParser {
    constructor(lexer) {
        this._lexer = lexer;
    }
    parse() {
        let formula = new Formula();
        while (!this._lexer.EOF()) {
            formula.parts.push(this._parseNextPart());
        }
        return formula;
    }
    _parseNextPart() {
        let token = this._lexer.consume(1)[0];
        if (token instanceof DollarSignToken) {
            // current token is a dollar sign token
        }
        else {
            // current token is a plain text token or an escaped dollar sign token
            // we are reading a plain text part until a dollar sign token
            let plainTextPart = new PlainTextPart();
            plainTextPart.tokens.push(token);
            // read any following plain text tokens into the plain text part's token list
            while (!this._lexer.EOF()
                && !(this._lexer.peek(1) instanceof DollarSignToken)) {
                plainTextPart.tokens.push(this._lexer.consume(1)[0]);
            }
            return plainTextPart;
        }
    }
}
//#endregion
//# sourceMappingURL=kodeine.js.map