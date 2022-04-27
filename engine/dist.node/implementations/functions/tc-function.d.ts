import { FunctionWithModes as KodeFunctionWithModes } from "./kode-function-with-modes.js";
/** Implementation of Kustom's tc() (text converter) function. */
export declare class TcFunction extends KodeFunctionWithModes {
    getName(): string;
    /** Shared part of implementation for tc(cut) and tc(ell). */
    private _cut;
    constructor();
}
