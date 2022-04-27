"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberToRomanConverter = void 0;
/** A helper converting a number to a roman numeral representation. */
exports.NumberToRomanConverter = (() => {
    const maxConvertible = 1000 * 1000; // allow a thousand thousands at max (will print around a thousand Ms)
    const ones = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    const tens = ['', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'];
    const hundreds = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM'];
    return {
        /** The absolute maximum value that this converter can handle. */
        max: maxConvertible,
        /** Converts the given number to its roman numeral representation. */
        convert: (n) => {
            if (n < 0)
                throw new Error(`Can only convert positive numbers.`);
            else if (n > maxConvertible)
                throw new Error(`Number ${n} is too big for conversion. Max is ${maxConvertible}.`);
            // implementation idea from wikipedia:
            // https://en.wikipedia.org/wiki/Roman_numerals#Standard_form
            const thousandsCount = Math.floor(n / 1000);
            const hundredsCount = Math.floor(n % 1000 / 100);
            const tensCount = Math.floor(n % 100 / 10);
            const onesCount = Math.floor(n % 10);
            return 'M'.repeat(thousandsCount)
                + hundreds[hundredsCount]
                + tens[tensCount]
                + ones[onesCount];
        }
    };
})();
//# sourceMappingURL=number-to-roman-converter.js.map