import { FunctionWithModes } from "./kode-function-with-modes.js";
/** Implementation of Kustom's mu() (math utilities) function. */
export declare class MuFunction extends FunctionWithModes {
    getName(): string;
    singleArgMode(name: string, func: ((number: number) => number)): void;
    constructor();
}
