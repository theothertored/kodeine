import { FunctionWithModes as KodeFunctionWithModes } from "./kode-function-with-modes.js";
export class TextConverterFunction extends KodeFunctionWithModes {
    getName() { return 'tc'; }
    constructor() {
        super();
        this.mode('cut', [
            {
                args: ['text', 'num length'],
                func: (text, length) => {
                    return text.substring(0, length);
                }
            },
            {
                args: ['text', 'num start', 'num length'],
                func: (text, start, length) => {
                    return text.substring(start, start + length);
                }
            }
        ]);
        this.mode('low', [
            {
                args: ['text'],
                func: (text) => {
                    return text.toLowerCase();
                }
            }
        ]);
    }
}
//# sourceMappingURL=text-converter-function.js.map