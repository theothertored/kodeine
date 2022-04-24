import { ICharReader } from "./base.js";
/** A forward only character reader using a string variable as its source of characters. */
export declare class StringCharReader extends ICharReader {
    /** Source string. */
    private _text;
    /** The current position of the reader. */
    private _position;
    /**
     * Constructs a {@link StringCharReader} with a given string as a source of characters.
     * @param text The source string.
     */
    constructor(text: string);
    getPosition(): number;
    peek(charCount: number, offset?: number): string;
    consume(charCount: number): string;
    EOF(): boolean;
}
