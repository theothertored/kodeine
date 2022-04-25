import { ClosingParenthesisToken, CommaToken, DollarSignToken, EscapedDollarSignToken, OpeningParenthesisToken, OperatorToken, PlainTextToken, QuotedValueToken, UnclosedQuotedValueToken, UnquotedValueToken, WhitespaceToken } from "./formula-tokens.js";
/**
 * Values representing the current state of the lexer.
 * - {@link Default}: Not in an evaluable part of the formula (reading plain text)
 * - {@link Kode}: In an evaluable part of the formula (reading kode tokens)
*/
export var KodeineLexerState;
(function (KodeineLexerState) {
    KodeineLexerState[KodeineLexerState["Default"] = 0] = "Default";
    KodeineLexerState[KodeineLexerState["Kode"] = 1] = "Kode";
})(KodeineLexerState || (KodeineLexerState = {}));
/** The default Kodeine lexer. Reads characters from an {@link ICharReader} and combines them into {@link FormulaToken}s. */
export class KodeineLexer {
    /** Constructs a {@link KodeineLexer} with an {@link ICharReader} as a source of characters and an array of operator symbols. */
    constructor(charReader, operatorSymbols) {
        /** The current state of the lexer. The lexer will only interpret certain characters as tokens if its in the {@link KodeineLexerState.Kode} state. */
        this._state = KodeineLexerState.Default;
        /** A queue holding tokens that were already peeked, but not consumed. */
        this._tokenQueue = [];
        this._charReader = charReader;
        this._operatorSymbols = operatorSymbols;
    }
    peek(tokenCount, offset = 0) {
        // the array of tokens to be returned
        let outTokens;
        if (this._tokenQueue.length > 0) {
            // there are tokens in the queue, start filling up the outTokens array from the queue
            outTokens = this._tokenQueue.slice(offset, tokenCount);
        }
        else {
            // no tokens in the queue, start with an empty array
            outTokens = [];
        }
        // continue reading tokens into the queue and the outTokens array
        // until we have enough tokens or there are no more characters to read
        while (outTokens.length < tokenCount && !this._charReader.EOF()) {
            let nextToken = this._readNextToken();
            this._tokenQueue.push(nextToken);
            outTokens.push(nextToken);
        }
        // return tokens
        return outTokens;
    }
    consume(tokenCount) {
        // the array of tokens to be returned
        let outTokens;
        if (this._tokenQueue.length > 0) {
            // there are tokens in the queue, remove them from the queue and put in outTokens
            outTokens = this._tokenQueue.splice(0, tokenCount);
        }
        else {
            // no tokens in the queue, start with an empty array
            outTokens = [];
        }
        // continue reading tokens into the outTokens array 
        // until we have enough tokens or there are no more characters to read
        // don't queue tokens, they are consumed immediately
        while (outTokens.length < tokenCount && !this._charReader.EOF()) {
            let nextToken = this._readNextToken();
            outTokens.push(nextToken);
        }
        // return tokens
        return outTokens;
    }
    EOF() {
        // no more characters AND token queue is empty
        return this._charReader.EOF() && this._tokenQueue.length === 0;
    }
    /**
     * Reads characters from the source until a full token is read.
     *
     * As a principle, the lexer does not throw syntax errors when reading tokens,
     * leaving it up to the parser to check if the order of tokens is valid.
     *
     * @returns The next token read from the source.
     */
    _readNextToken() {
        // save the current position in the source formula text
        // to use as the start index of the token we will be reading
        let startIndex = this._charReader.getPosition();
        // consume the first character of this token
        let char = this._charReader.consume(1);
        // check the current state of the lexer
        if (this._state === KodeineLexerState.Default) {
            // default state = we are not currently in kode
            // every character is plain text, unless we encounter a dollar sign
            // in the future we might also need to watch out for BB codes
            if (char === '$') {
                // this token starts with a dollar sign ($)
                // - beggining of an evaluable part ($),
                // - escaped dollar sign ($$)
                // to know, we need to check the following character:
                let nextChar = this._charReader.peek(1);
                if (nextChar === '$') {
                    // this is an escaped dollar sign ($$)
                    // consume the second dollar sign as a part of this token
                    this._charReader.consume(1);
                    return new EscapedDollarSignToken(startIndex);
                }
                else {
                    // this is the beginning of an evaluable part
                    // switch the lexer state
                    this._state = KodeineLexerState.Kode;
                    return new DollarSignToken(startIndex);
                }
            }
            else {
                // this token does not start with a dollar sign, and so it is a plain text token
                // create a buffer containing the first character of the token
                let buffer = char;
                // read until there are no more characters, or a dollar sign ($) is peeked
                while (!this._charReader.EOF() && this._charReader.peek(1) !== '$') {
                    // consume character into buffer
                    buffer += this._charReader.consume(1);
                }
                // all characters of this plain text token are now in the buffer
                return new PlainTextToken(buffer, startIndex);
            }
        }
        else if (this._state === KodeineLexerState.Kode) {
            // kode state
            // we have to pay attention to more than just dollar signs here
            if (this._isWhitespace(char)) {
                // this token starts with a whitespace character, so we are reading a whitespace token
                // create a buffer containing the first character of the token
                let buffer = char;
                // read until there are no more characters, or a non-whitespace character is peeked
                while (!this._charReader.EOF() && this._isWhitespace(this._charReader.peek(1))) {
                    // consume character into buffer
                    buffer += this._charReader.consume(1);
                }
                // all characters of this whitespace token are now in the buffer
                return new WhitespaceToken(buffer, startIndex);
            }
            else if (char === '(') {
                // opening parenthesis
                // it's the parser's job to check if this begins a subexpression or a function call
                return new OpeningParenthesisToken(startIndex);
            }
            else if (char === ')') {
                // closing parenthesis
                return new ClosingParenthesisToken(startIndex);
            }
            else if (char === ',') {
                // comma
                return new CommaToken(startIndex);
            }
            else if (char === '"') {
                // this token starts with a quotation mark
                // start with an empty buffer - we only pass the inner value to the token
                let buffer = '';
                // read until there are no more characters, or a closing doublequote is peeked
                while (!this._charReader.EOF() && this._charReader.peek(1) !== '"') {
                    // consume character into buffer
                    buffer += this._charReader.consume(1);
                }
                if (this._charReader.EOF()) {
                    // reached EOF before reaching a closing quotation mark
                    // this means we found an unclosed quoted value, which is a syntax error,
                    // because we don't throw syntax errors in the lexer, we return an unclosed quoted value token
                    // and let the parser decide what to do with it
                    return new UnclosedQuotedValueToken(buffer, startIndex);
                }
                else {
                    // we reached a closing quotation mark
                    // consume the ending quotation mark character
                    this._charReader.consume(1);
                    // all inner value characters are now in the buffer
                    return new QuotedValueToken(buffer, startIndex);
                }
            }
            else if (char === '$') {
                // we encountered a dollar sign, which signals the end of this evaluable part
                // switch the state to default
                this._state = KodeineLexerState.Default;
                return new DollarSignToken(startIndex);
            }
            else {
                // this token starts with a character that isn't easily recognizable as a special character
                // we could have encountered:
                // - an operator
                // - an unquoted value
                // find any operators that start with the same character as this token
                let initiallyMatchingOperatorSymbols = this._operatorSymbols.filter(op => op.startsWith(char));
                if (initiallyMatchingOperatorSymbols.length > 0) {
                    // found at least one operator with first char matching
                    // with kustom's default set of operators, there are no two multi-char operators with the same first character
                    // so there's always going to be one matching operator at most
                    // but since I made this pretty extensible, it should work regardless of how many operators match
                    // find the longest matching operator by peeking an appropriate number of characters
                    // and comparing to the operator symbol
                    let longestMatchingOperatorSymbol = '';
                    for (var multiCharOperatorSymbol of initiallyMatchingOperatorSymbols) {
                        if (multiCharOperatorSymbol.length > longestMatchingOperatorSymbol.length
                            && char + this._charReader.peek(multiCharOperatorSymbol.length - 1) === multiCharOperatorSymbol) {
                            // we found a fully matching operator that is longer than the previous fully matching operator
                            longestMatchingOperatorSymbol = multiCharOperatorSymbol;
                        }
                    }
                    // after that process we either have the longest matching multi-char operator or an empty string indicating that no operators matched
                    if (longestMatchingOperatorSymbol) {
                        // matched an entire operator, consume remaining characters of the symbol
                        this._charReader.consume(longestMatchingOperatorSymbol.length - 1);
                        return new OperatorToken(longestMatchingOperatorSymbol, startIndex);
                    }
                    else {
                        // matched first character of operator, but not the entire operator
                        // with kustom's default set of operators that means ~ or ! (problematic characters)
                        // those chars are treated like value tokens all by themselves, 
                        // by which I mean that they throw err: literal cannot follow another literal
                        // when next to a quoted or unquoted value.
                        return new UnquotedValueToken(char, startIndex);
                    }
                }
                else {
                    // did not match any operators
                    // we are reading an unquoted value token
                    // create a buffer containing the first character of the token
                    let buffer = char;
                    // create an empty buffer for whitespace
                    let whitespaceBuffer = '';
                    // counter holding how many characters ahead we are peeking to see if the whitespace is trailing or in the middle
                    let offset = 0;
                    let foundTrailingWhitespace = false;
                    // read until manual break
                    while (true) {
                        // peek the next character
                        let nextChar = this._charReader.peek(1, offset++);
                        if (this._isWhitespace(nextChar)) {
                            // the next character is whitespace
                            whitespaceBuffer = nextChar;
                            // continue reading whitespace into the whitespace buffer until manual break
                            while (true) {
                                // peek next character
                                nextChar = this._charReader.peek(1, offset++);
                                if (this._isWhitespace(nextChar)) {
                                    // the next character is whitespace, add to buffer
                                    whitespaceBuffer += nextChar;
                                }
                                else if (this._isUnquotedTextChar(nextChar)) {
                                    // the next character is an unquoted text character
                                    // the whitespace we read is not trailing, add to buffer
                                    buffer += whitespaceBuffer + nextChar;
                                    break;
                                }
                                else {
                                    // the next character is not an unquoted text character
                                    // the whitespace we read is trailing, so we should discard it and read it as a separate token
                                    foundTrailingWhitespace = true;
                                    break;
                                }
                            }
                            // we finished reading whitespace
                            if (foundTrailingWhitespace) {
                                // if we found trailing whitespace, the entire unquoted value token is already in the buffer, exit the loop
                                break;
                            }
                        }
                        else if (this._isUnquotedTextChar(nextChar)) {
                            // the next character is a part of the unquoted string
                            buffer += nextChar;
                        }
                        else {
                            // the next character is neither whitespace nor a part of the unquoted string,
                            // the entire unquoted value token is already in the buffer, exit the loop
                            break;
                        }
                    }
                    // after we exited the loop we only care about the buffer,
                    // if the whitespace buffer is not empty, it just contains trailing whitespace, which should be a separate token
                    // consume characters that we peeked and added to the buffer (-1 because we already consumed the first character)
                    this._charReader.consume(buffer.length - 1);
                    return new UnquotedValueToken(buffer, startIndex);
                }
            }
        }
        else {
            // this should never happen
            throw new Error('Invalid lexer state: ' + this._state);
        }
    }
    /**
     * Checks whether a character is considered a whitespace character.
     * @param char The character to check.
     * @returns Whether the character is a whitespace characters.
     */
    _isWhitespace(char) {
        return char !== '' && char.trim().length === 0;
    }
    /**
     * Checks whether a character can be a part of an unquoted string.
     * @param char The character to check.
     * @returns Whether the character can be a part of an unquoted string.
     */
    _isUnquotedTextChar(char) {
        let isSpecialChar = char == ''
            || char === '('
            || char === ')'
            || char === '"'
            || char === ','
            || char === '$'
            || this._operatorSymbols.some(op => op.startsWith(char));
        return !isSpecialChar;
    }
}
//# sourceMappingURL=kodeine-lexer.js.map