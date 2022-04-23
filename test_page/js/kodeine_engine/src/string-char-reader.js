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
    peek(charCount, offset) {
        offset !== null && offset !== void 0 ? offset : (offset = 0);
        return this._text.substring(this._position + offset, this._position + offset + charCount);
    }
    consume(charCount) {
        let oldPos = this._position;
        this._position += charCount;
        return this._text.substring(oldPos, oldPos + charCount);
    }
    EOF() {
        return this._position >= this._text.length;
    }
}
//# sourceMappingURL=string-char-reader.js.map