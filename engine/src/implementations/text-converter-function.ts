import { IKodeFunction, KodeValue } from "../base.js";
import { EvaluationError } from "../errors.js";
import { EvaluationContext } from "../evaluables/evaluation-context.js";
import { FunctionCall } from "../evaluables/function-call.js";
import { FunctionWithModes as KodeFunctionWithModes } from "./kode-function-with-modes.js";


export class TextConverterFunction extends KodeFunctionWithModes {

    getName() { return 'tc'; }

    constructor() {
        super();

        this.mode('cut', [
            {
                args: ['text', 'num length'],
                func: (text: string, length: number): string => {
                    return text.substring(0, length);
                }
            },
            {
                args: ['text', 'num start', 'num length'],
                func: (text: string, start: number, length: number): string => {
                    return text.substring(start, start + length);
                }
            }
        ]);

        this.mode('low', [
            {
                args: ['text'],
                func: (text: string): string => {
                    return text.toLowerCase();
                }
            }
        ]);

    }

}