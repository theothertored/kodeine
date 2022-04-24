import { ICharReader, IFormulaToken, ILexer as IFormulaTokenLexer } from "../base.js";
/**
 * Values representing the current state of the lexer.
 * - {@link Default}: Not in an evaluable part of the formula (reading plain text)
 * - {@link Kode}: In an evaluable part of the formula (reading kode tokens)
*/
export declare enum KodeineLexerState {
    Default = 0,
    Kode = 1
}
/** The default Kodeine lexer. Reads characters from an {@link ICharReader} and combines them into {@link IFormulaToken}s. */
export declare class KodeineLexer implements IFormulaTokenLexer {
    /** The source of characters for the lexer. */
    private readonly _charReader;
    /** An array of all symbols to be considered operator symbols, ordered from longest to shrotest. */
    private readonly _operatorSymbols;
    /** The current state of the lexer. The lexer will only interpret certain characters as tokens if its in the {@link KodeineLexerState.Kode} state. */
    private _state;
    /** A queue holding tokens that were already peeked, but not consumed. */
    private _tokenQueue;
    /** Constructs a {@link KodeineLexer} with an {@link ICharReader} as a source of characters and an array of operator symbols. */
    constructor(charReader: ICharReader, operatorSymbols: string[]);
    peek(tokenCount: number, offset?: number): IFormulaToken[];
    consume(tokenCount: number): IFormulaToken[];
    EOF(): boolean;
    /**
     * Reads characters from the source until a full token is read.
     *
     * As a principle, the lexer does not throw syntax errors when reading tokens,
     * leaving it up to the parser to check if the order of tokens is valid.
     *
     * @returns The next token read from the source.
     */
    private _readNextToken;
    /**
     * Checks whether a character is considered a whitespace character.
     * @param char The character to check.
     * @returns Whether the character is a whitespace characters.
     */
    private _isWhitespace;
    /**
     * Checks whether a character can be a part of an unquoted string.
     * @param char The character to check.
     * @returns Whether the character can be a part of an unquoted string.
     */
    private _isUnquotedTextChar;
}
