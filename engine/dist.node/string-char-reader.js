"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringCharReader = void 0;
const kodeine_js_1 = require("./kodeine.js");
/** A forward only character reader using a string variable as its source of characters. */
class StringCharReader extends kodeine_js_1.ICharReader {
    /**
     * Constructs a {@link StringCharReader} with a given string as a source of characters.
     * @param text The source string.
     */
    constructor(text) {
        super();
        this._text = text;
        this._position = 0;
    }
    getPosition() {
        return this._position;
    }
    peek(charCount, offset) {
        offset ?? (offset = 0);
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
exports.StringCharReader = StringCharReader;
//# sourceMappingURL=string-char-reader.js.map