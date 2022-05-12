
/** A helper returning an ordinal suffix (st, nd, rd) for a given number. */
export const OrdinalSuffixHelper = (() => {

    const suffixForDigit = (digit: number) => {

        if (digit === 1)
            return 'st';

        else if (digit === 2)
            return 'nd';

        else if (digit === 3)
            return 'rd';

        else
            return 'th';

    }

    return {
        /** Returns an ordinal suffix (st, nd, rd, th), for the given number. */
        getSuffix: (number: number) => {

            // we don't care about the sign
            number = Math.abs(number);

            if (number <= 9)
                return suffixForDigit(number);

            else if (number < 20)
                return 'th'

            else
                return suffixForDigit(number % 10);
        }
    };

})();