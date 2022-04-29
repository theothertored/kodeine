import { FunctionWithModes } from "./kode-function-with-modes.js";
export declare class MuFunction extends FunctionWithModes {
    getName(): string;
    singleArgMode(name: string, func: ((number: number) => number)): void;
    constructor();
}
