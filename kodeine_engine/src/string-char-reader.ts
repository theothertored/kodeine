import { ICharReader } from "./base.js";

export class StringCharReader extends ICharReader {

    private _text: string;
    private _position: number;

    constructor(text: string) {
        super();
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