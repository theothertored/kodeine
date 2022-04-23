import { ICharReader } from "./base.js";
export class StringCharReader extends ICharReader {
    constructor(text) {
        super();
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
//# sourceMappingURL=string-char-reader.js.map