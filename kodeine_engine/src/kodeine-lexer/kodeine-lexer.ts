import { ICharReader, IFormulaToken, ILexer } from "../base.js";
import { ClosingParenthesisToken, CommaToken, DollarSignToken, EscapedDollarSignToken, OpeningParenthesisToken, OperatorToken, PlainTextToken, QuotedValueToken, UnclosedQuotedValueToken, UnquotedValueToken, WhitespaceToken } from "./formula-tokens.js";

export enum KodeineLexerState {
    Default, Kode
}

export class KodeineLexer implements ILexer {

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
        return this._charReader.EOF() && this._tokenQueue.length === 0;
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