import { FunctionWithModes as KodeFunctionWithModes, ModeImplementationFunctionContext } from "./kode-function-with-modes.js";


export class TcFunction extends KodeFunctionWithModes {

    getName() { return 'tc'; }

    constructor() {
        super();

        this.mode(
            'cut',
            ['txt text', 'num startOrLength', 'num length?'],
            function (text: string, startOrLength: number, length?: number): string {

                if (length) {

                    if (length <= 0)
                        return '';

                    else if (startOrLength < 0)
                        return text.substring(text.length + startOrLength, text.length + startOrLength + length);

                    else
                        return text.substring(startOrLength, startOrLength + length);


                } else if (startOrLength < 0) {

                    return text.substring(text.length + startOrLength);

                } else {

                    return text.substring(0, startOrLength);

                }
            }
        );

        this.mode(
            'low',
            ['txt text'],
            function (text: string): string {
                return text.toLowerCase();
            }
        );

    }

}