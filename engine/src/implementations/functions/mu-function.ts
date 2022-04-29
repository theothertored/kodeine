import { InvalidArgumentError } from "../../errors.js";
import { FunctionWithModes } from "./kode-function-with-modes.js";

/** Implementation of Kustom's mu() (math utilities) function. */
export class MuFunction extends FunctionWithModes {

    getName() { return 'mu'; }

    singleArgMode(name: string, func: ((number: number) => number)) {
        this.mode(
            name,
            ['num number'],
            func
        );
    }

    constructor() {
        super();

        this.singleArgMode('ceil', Math.ceil);

        this.singleArgMode('floor', Math.floor);

        this.singleArgMode('sqrt', Math.sqrt);

        this.mode('round',
            ['num number', 'num decimals?'],
            function (number: number, decimals?: number) {

                if (decimals === undefined) {

                    return Math.round(number);

                } else {

                    if (decimals < 0) {

                        throw new InvalidArgumentError(
                            'mu(round)', 'decimals',
                            2, this.call.args[2], decimals,
                            'The number of decimal places cannot be negative. Kustom will throw "mu: 45".'
                        )

                    } else {

                        let powerOf10 = 10 ** decimals;
                        return Math.round(number * powerOf10) / powerOf10;

                    }

                }
            }
        );

        // TODO
        // this.mode('min',
        //     ['num values...'],
        //     function (number: number, decimals?: number) {
        //         return 0;
        //     }
        // );

        // TODO
        // this.mode('max',
        //     ['num values...'],
        //     function (number: number, decimals?: number) {
        //         return 0;
        //     }
        // );

        this.singleArgMode('abs', Math.abs);

        this.singleArgMode('cos', (number: number) => Math.cos(number / 180 * Math.PI));

        this.singleArgMode('sin', (number: number) => Math.sin(number / 180 * Math.PI));

        this.singleArgMode('tan', (number: number) => Math.tan(number / 180 * Math.PI));

        this.singleArgMode('acos', (number: number) => Math.acos(number) / Math.PI * 180);

        this.singleArgMode('asin', (number: number) => Math.asin(number) / Math.PI * 180);

        this.singleArgMode('atan', (number: number) => Math.atan(number) / Math.PI * 180);

        this.singleArgMode('log', Math.log10);

        this.mode('pow',
            ['num number', 'num exponent'],
            function (number: number, exponent: number) {
                return number ** exponent;
            }
        );

        this.singleArgMode('ln', Math.log);

        this.mode('rnd',
            ['num min', 'num max'],
            function (min: number, max: number): number {
                return min + Math.floor(Math.random() * (max - min + 1));
            }
        );

        this.mode('h2d',
            ['txt hex'],
            function (hex: string): number {

                let output = Number('0x' + hex);

                if (isNaN(output)) {

                    throw new InvalidArgumentError(
                        'mu(h2d)', 'hex',
                        1, this.call.args[1], hex,
                        `Value "${hex}" could not be parsed as a hexadecimal number.`
                    );

                } else {

                    return output;

                }

            }
        );

        this.mode('d2h',
            ['num number'],
            function (number: number): string {

                return number.toString(16);

            }
        );

    }

}