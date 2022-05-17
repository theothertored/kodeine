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
        /** Converts a kustom */
        parseKustomDateString: (now, kustomDateString) => {
            let getMonthDayCount = (year, month) => new Date(year, month + 1, 0).getDate();
            let handlers = {
                y: {
                    canSet: val => true,
                    set: val => now = new Date(val, now.getMonth(), Math.min(now.getDate(), getMonthDayCount(val, now.getMonth())), now.getHours(), now.getMinutes(), now.getSeconds()),
                    add: val => now = new Date(now.getFullYear() + val, now.getMonth(), Math.min(now.getDate(), getMonthDayCount(val, now.getMonth())), now.getHours(), now.getMinutes(), now.getSeconds())
                },
                M: {
                    canSet: val => val >= 1 && val <= 12,
                    set: val => now = new Date(now.getFullYear(), val - 1, Math.min(now.getDate(), getMonthDayCount(now.getFullYear(), val - 1)), now.getHours(), now.getMinutes(), now.getSeconds()),
                    add: val => now = new Date(now.getFullYear() + Math.trunc(val / 12), now.getMonth() + (val % 12), Math.min(now.getDate(), getMonthDayCount(val, now.getMonth() + (val % 12))), now.getHours(), now.getMinutes(), now.getSeconds())
                },
                d: {
                    canSet: val => val >= 1 && val <= getMonthDayCount(now.getFullYear(), now.getMonth()),
                    set: val => now = new Date(now.getFullYear(), now.getMonth(), val, now.getHours(), now.getMinutes(), now.getSeconds()),
                    add: val => now.setDate(now.getDate() + val)
                },
                h: {
                    canSet: val => val >= 0 && val < 24,
                    set: val => now.setHours(val),
                    add: val => now.setHours(now.getHours() + val)
                },
                m: {
                    canSet: val => val >= 0 && val < 60,
                    set: val => now.setMinutes(val),
                    add: val => now.setMinutes(now.getMinutes() + val)
                },
                s: {
                    canSet: val => val >= 0 && val < 60,
                    set: val => now.setSeconds(val),
                    add: val => now.setSeconds(now.getSeconds() + val)
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
            return now;
        }
    };
})();
//# sourceMappingURL=kustom-date-helper.js.map