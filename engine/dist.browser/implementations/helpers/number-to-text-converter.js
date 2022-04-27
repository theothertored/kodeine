export const NumberToTextConverter = (() => {
    const maxConvertible = Math.pow(2, 31) - 1;
    const million = 1000000;
    const billion = 1000000000;
    const zeroToNineteen = [
        'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
        'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
    ];
    const tens = ['zero', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    // converts numbers between 0 and 19
    const _convertUnder20 = (n) => {
        return zeroToNineteen[n];
    };
    // converts numbers between 0 and 100
    const _convertUnderHundred = (n) => {
        if (n < 20) {
            return _convertUnder20(n);
        }
        else {
            let tenCount = Math.floor(n / 10);
            let output = tens[tenCount];
            let rest = n % 10;
            if (rest > 0) {
                return `${output} ${_convertUnder20(rest)}`;
            }
            else {
                return output;
            }
        }
    };
    // converts numbers between 0 and 999
    const _convertUnderThousand = (n) => {
        if (n < 100) {
            return _convertUnderHundred(n);
        }
        else {
            let hundredCount = Math.floor(n / 100);
            let output = _convertUnder20(hundredCount);
            let rest = n % 100;
            if (rest > 0)
                return `${output} hundred ${_convertUnderHundred(rest)}`;
            else
                return output;
        }
    };
    // converts numbers between 0 and 999,999
    const _convertUnderMillion = (n) => {
        if (n < 1000) {
            return _convertUnderThousand(n);
        }
        else {
            let thousandCount = Math.floor(n / 1000);
            let output = _convertUnderThousand(thousandCount);
            let rest = n % 1000;
            if (rest > 0)
                return `${output} thousand ${_convertUnderThousand(rest)}`;
            else
                return output;
        }
    };
    // converts numbers between 0 and 999,999,999
    const _convertUnderBillion = (n) => {
        if (n < million) {
            return _convertUnderMillion(n);
        }
        else {
            let millionCount = Math.floor(n / million);
            let output = _convertUnderThousand(millionCount);
            let rest = n % million;
            if (rest > 0)
                return `${output} million ${_convertUnderMillion(rest)}`;
            else
                return `${output} million`;
        }
    };
    // converts numbers between 0 and 2,147,483,647
    return {
        max: maxConvertible,
        convert: (n) => {
            if (n < 0)
                throw new Error(`Can only convert positive numbers.`);
            else if (n > maxConvertible)
                throw new Error(`Number ${n} is too big for conversion. Max is ${maxConvertible}.`);
            if (n < billion) {
                return _convertUnderBillion(n);
            }
            else {
                let billionCount = Math.floor(n / billion);
                // billion count can be at most 2
                let output = _convertUnder20(billionCount);
                let rest = n % billion;
                if (rest > 0)
                    return `${output} billion ${_convertUnderBillion(rest)}`;
                else
                    return `${output} billion`;
            }
        }
    };
})();
//# sourceMappingURL=number-to-text-converter.js.map