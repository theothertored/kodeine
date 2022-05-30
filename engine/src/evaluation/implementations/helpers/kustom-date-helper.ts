import { AdditionOperator } from "../operators/binary-operators";
import { getMonthDayCount } from "./utils";

// TODO: extract handlers outside of the parseKustomDateString function

/** A helper for handling Kustom dates. */
export const KustomDateHelper = (() => {

    /** Local utility function for treating the year given by the user. */
    const treatYear = (num: number) => num < 1000 ? 2000 + num : num;

    /** Local utility function to pad a number to two characters. */
    const pad2 = (num: number) => num < 10 ? `0${num}` : num;

    return {

        /**
         *  Converts a JS date object to a Kustom date string.
         *  @example
         *  '2022y05M10d12h04m58s'
         */
        toKustomDateString: (date: Date): string => {
            return `${treatYear(date.getFullYear())}y${pad2(date.getMonth() + 1)}M${pad2(date.getDate())}d${pad2(date.getHours())}h${pad2(date.getMinutes())}m${pad2(date.getSeconds())}s`;
        },

        /** Converts a kustom date string into a JS date object. */
        parseKustomDateString: (date: Date, kustomDateString: string): Date => {

            /** 
             * An object containing handlers for all kustom date string tokens.
             * Tokens are single characters and should be preceded by a number (val).
             */
            let handlers: Record<string, {
                /** Whether the handler can run for the given value. */
                canSet: (val: number) => boolean,
                /** 
                 * Implements the handler's set mode.
                 * @param val The value given before the handler token.
                 */
                set: (val: number) => void,
                /**
                 * Implements the handler's add mode (when after `a` or `r`).
                 * @param val The value given before the handler token.
                 */
                add: (val: number) => void
            }> = {

                // year
                'y': {
                    canSet: val => true,
                    set: val => date = new Date(
                        val, date.getMonth(), Math.min(date.getDate(), getMonthDayCount(val, date.getMonth())),
                        date.getHours(), date.getMinutes(), date.getSeconds()
                    ),
                    add: val => date = new Date(
                        date.getFullYear() + val, date.getMonth(), Math.min(date.getDate(), getMonthDayCount(val, date.getMonth())),
                        date.getHours(), date.getMinutes(), date.getSeconds()
                    )
                },

                // month
                'M': {
                    canSet: val => val >= 1 && val <= 12,
                    set: val => date = new Date(
                        date.getFullYear(), val - 1, Math.min(date.getDate(), getMonthDayCount(date.getFullYear(), val - 1)),
                        date.getHours(), date.getMinutes(), date.getSeconds()
                    ),
                    add: val => date = new Date(
                        date.getFullYear() + Math.trunc(val / 12), date.getMonth() + (val % 12), Math.min(date.getDate(), getMonthDayCount(val, date.getMonth() + (val % 12))),
                        date.getHours(), date.getMinutes(), date.getSeconds()
                    )
                },

                // day
                'd': {
                    canSet: val => val >= 1 && val <= getMonthDayCount(date.getFullYear(), date.getMonth()),
                    set: val => date = new Date(date.getFullYear(), date.getMonth(), val, date.getHours(), date.getMinutes(), date.getSeconds()),
                    add: val => date.setDate(date.getDate() + val)
                },

                // hour
                'h': {
                    canSet: val => val >= 0 && val < 24,
                    set: val => date.setHours(val),
                    add: val => date.setHours(date.getHours() + val)
                },

                // minute
                'm': {
                    canSet: val => val >= 0 && val < 60,
                    set: val => date.setMinutes(val),
                    add: val => date.setMinutes(date.getMinutes() + val)
                },

                // second
                's': {
                    canSet: val => val >= 0 && val < 60,
                    set: val => date.setSeconds(val),
                    add: val => date.setSeconds(date.getSeconds() + val)
                }

            };

            /** 
             * Keeps track of the current mode.  
             * `null = set, a = add, r = remove`
             */
            let currentMode: null | 'a' | 'r' = null;

            /** Keeps track of the number before a handler token. */
            let numberBuffer = 0;

            // go through each character of the date string to be parsed
            for (const char of kustomDateString) {

                // check if the character is a digit
                let digit = '0123456789'.indexOf(char);

                if (digit >= 0) {

                    // the character is a digit, add it to the number buffer
                    numberBuffer = (numberBuffer ?? 0) * 10 + digit;

                } else {

                    if (char === 'a' || char === 'r') {

                        // switch the mode
                        currentMode = char;

                    } else if (char in handlers) {

                        // the character is a handler token

                        if (currentMode === null) {

                            // set if handler allows it
                            if (handlers[char].canSet(numberBuffer))
                                handlers[char].set(numberBuffer);

                        } else if (currentMode === 'a') {

                            // add
                            handlers[char].add(numberBuffer);

                        } else if (currentMode === 'r') {

                            // remove
                            handlers[char].add(-numberBuffer);

                        }

                    }

                    // reset the number buffer
                    numberBuffer = 0;

                }

            }

            // return the date after all handlers have been applied
            return date;

        }

    };

})();
