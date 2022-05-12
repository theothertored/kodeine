import { ICharReader } from "./kodeine.js";

/** A forward only character reader using a string variable as its source of characters. */
export class StringCharReader extends ICharReader {

    /** Source string. */
    private _text: string;

    /** The current position of the reader. */
    private _position: number;

    /** 
     * Constructs a {@link StringCharReader} with a given string as a source of characters.
     * @param text The source string.
     */
    constructor(text: string) {
        super();
        this._text = text;
        this._position = 0;
    }

    getPosition(): number {
        return this._position;
    }

    peek(charCount: number, offset?: number): string {
        offset ??= 0;
        return this._text.substring(this._position + offset, this._position + offset + charCount);
    }

    consume(charCount: number): string {
        let oldPos = this._position;
        this._position += charCount;
        return this._text.substring(oldPos, oldPos + charCount)
    }

    EOF(): boolean {
        return this._position >= this._text.length;
    }

}