import { KodeFunctionWithModes } from "../../kodeine.js";
/** Implementation of Kustom's tc() (text converter) function. */
export declare class TcFunction extends KodeFunctionWithModes {
    getName(): string;
    /** Shared part of implementation for tc(cut) and tc(ell). */
    private static _cut;
    constructor();
}
