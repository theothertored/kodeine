// TODO: extract handlers outside of the parseKustomDateString function
/** A helper for handling Kustom dates. */
export const KustomDateHelper = (() => {
    let padYear = (num) => num < 1000 ? 2000 + num : num;
    let pad2 = (num) => num < 10 ? `0${num}` : num;
    return {
        /**
         *  Converts a JS date object to a Kustom date string.
         *  @example
         *  '2022y05M10d12h04m58s'
         */
        toKustomDateString: (date) => {
            return `${padYear(date.getFullYear())}y${pad2(date.getMonth() + 1)}M${pad2(date.getDate())}d${pad2(date.getHours())}h${pad2(date.getMinutes())}m${pad2(date.getSeconds())}s`;
        },
        /** Converts a kustom date string into a JS date object. */
        parseKustomDateString: (date, kustomDateString) => {
            let getMonthDayCount = (year, month) => new Date(year, month + 1, 0).getDate();
            let handlers = {
                y: {
                    canSet: val => true,
                    set: val => date = new Date(val, date.getMonth(), Math.min(date.getDate(), getMonthDayCount(val, date.getMonth())), date.getHours(), date.getMinutes(), date.getSeconds()),
                    add: val => date = new Date(date.getFullYear() + val, date.getMonth(), Math.min(date.getDate(), getMonthDayCount(val, date.getMonth())), date.getHours(), date.getMinutes(), date.getSeconds())
                },
                M: {
                    canSet: val => val >= 1 && val <= 12,
                    set: val => date = new Date(date.getFullYear(), val - 1, Math.min(date.getDate(), getMonthDayCount(date.getFullYear(), val - 1)), date.getHours(), date.getMinutes(), date.getSeconds()),
                    add: val => date = new Date(date.getFullYear() + Math.trunc(val / 12), date.getMonth() + (val % 12), Math.min(date.getDate(), getMonthDayCount(val, date.getMonth() + (val % 12))), date.getHours(), date.getMinutes(), date.getSeconds())
                },
                d: {
                    canSet: val => val >= 1 && val <= getMonthDayCount(date.getFullYear(), date.getMonth()),
                    set: val => date = new Date(date.getFullYear(), date.getMonth(), val, date.getHours(), date.getMinutes(), date.getSeconds()),
                    add: val => date.setDate(date.getDate() + val)
                },
                h: {
                    canSet: val => val >= 0 && val < 24,
                    set: val => date.setHours(val),
                    add: val => date.setHours(date.getHours() + val)
                },
                m: {
                    canSet: val => val >= 0 && val < 60,
                    set: val => date.setMinutes(val),
                    add: val => date.setMinutes(date.getMinutes() + val)
                },
                s: {
                    canSet: val => val >= 0 && val < 60,
                    set: val => date.setSeconds(val),
                    add: val => date.setSeconds(date.getSeconds() + val)
                }
            };
            let state = null;
            let numberBuffer = 0;
            for (const char of kustomDateString) {
                let digit = '0123456789'.indexOf(char);
                if (digit >= 0) {
                    numberBuffer = (numberBuffer !== null && numberBuffer !== void 0 ? numberBuffer : 0) * 10 + digit;
                }
                else {
                    if (char === 'a' || char === 'r') {
                        state = char;
                    }
                    else if (char in handlers) {
                        if (state === null) {
                            if (handlers[char].canSet(numberBuffer))
                                handlers[char].set(numberBuffer);
                        }
                        else if (state === 'a') {
                            handlers[char].add(numberBuffer);
                        }
                        else if (state === 'r') {
                            handlers[char].add(-numberBuffer);
                        }
                    }
                    numberBuffer = 0;
                }
            }
            return date;
        }
    };
})();
//# sourceMappingURL=kustom-date-helper.js.map