import { KodeFunctionWithModes } from "../../../kodeine.js";
/** Implementation of Kustom's `mu()` (math utilities) function. */
export declare class MuFunction extends KodeFunctionWithModes {
    getName(): string;
    singleArgMode(name: string, func: ((number: number) => number)): void;
    constructor();
}
