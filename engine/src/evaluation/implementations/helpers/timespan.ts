
/** A local helper function that floors a given number and then left-pads it with zeros to the given length. */
function floorAndPad(source: number, targetLength: number) {
    const sourceString = Math.floor(source).toString();
    if (sourceString.length >= targetLength)
        return sourceString;
    else
        return '0'.repeat(targetLength - sourceString.length) + sourceString;
}

/** An object containing all possible format tokens for `tf()` and functions returning values they should be replaced with. */
const formatTokens: Record<string, (timespan: TimeSpan, match: string) => string | number> = {
    'D': (timespan, match) => floorAndPad(timespan.totalDays, match.length),
    'H': (timespan, match) => floorAndPad(timespan.totalHours, match.length),
    'M': (timespan, match) => floorAndPad(timespan.totalMinutes, match.length),
    'S': (timespan, match) => floorAndPad(timespan.totalSeconds, match.length),
    'h': (timespan, match) => floorAndPad(timespan.totalHours % 24, match.length),
    'm': (timespan, match) => floorAndPad(timespan.totalMinutes % 60, match.length),
    's': (timespan, match) => floorAndPad(timespan.totalSeconds % 60, match.length)
};

/** 
 * An array of thresholds at which each time unit starts, with that units name.
 * `second` is missing on purpose, as it is also missing in Kustom.
 */
const unitBoundaries: [number, string][] = [
    [60, 'minute'],
    [60 * 60, 'hour'],
    [60 * 60 * 24, 'day'],
    [60 * 60 * 24 * 29, 'month'],
    [60 * 60 * 24 * 365, 'year'],
    [60 * 60 * 24 * 365 * 10, 'decade']
];

/** Represents a time segment with its duration accurate to a second. */
export class TimeSpan {

    /** The duration of this timespan in seconds. */
    public totalSeconds: number;

    /** The duration of this timespan in minutes.  */
    get totalMinutes(): number {
        return this.totalSeconds / 60;
    }

    /** The duration of this timespan in hours.  */
    get totalHours(): number {
        return this.totalMinutes / 60;
    }

    /** The duration of this timespan in days.  */
    get totalDays(): number {
        return this.totalHours / 24;
    }

    /** Constructs a new timespan with a given duration. */
    constructor(totalSeconds: number) {
        this.totalSeconds = totalSeconds;
    }

    /** 
     * Prints this timespan according to the given format.  
     * *Note - mostly copy pasted from the `df()` `parse()` function.*
    */
    format(format: string): string {

        let output = '';

        // a simple local string reader implementation
        let i = 0;
        let consume = () => format[i++];
        let peek = () => format[i];
        let eof = () => i >= format.length;

        // go until the entire format string is consumed
        while (!eof()) {

            // consume a character
            let char = consume();

            if (char === '\'') {

                // everything insde singlequotes is taken literally (without token replacement)

                if (eof()) {

                    // singlequote at the end of the string, we're done - exit loop
                    break;

                } else {

                    // there is at least one character after the singlequote
                    let nextChar = consume();

                    if (nextChar === '\'') {

                        // two singlequotes one after another, treat as escaped singlequote, add to output
                        output += '\'';

                    } else {

                        // next char is not an singlequote
                        output += nextChar;

                        // read chars until an singlequote is encountered or the format string ends
                        while (!eof() && peek() !== '\'') {
                            output += consume(); // read char into output
                        }

                        if (!eof()) {
                            // consume ending '
                            consume();
                        }

                    }

                }

            } else {

                // check if current character is a token (all tf() tokens are multitokens, see df-function.ts for more info on multitokens)
                let mutliFunc = formatTokens[char];

                if (mutliFunc) {

                    // current character is a multitoken, read all identical character into the buffer
                    let buffer = char;

                    while (!eof() && peek() === char) {
                        buffer += consume();
                    }

                    // we have the entire multitoken block, add multitoken result to output
                    output += mutliFunc(this, buffer);

                } else {

                    // character is not a token, add it to output as plain text
                    output += char;
                    
                }

            }

        }

        return output;

    }

    /** Prints this timespan as a human-readable string like "5 minutes" or "6 days". */
    prettyPrintAbsolute(): string {

        /** The maximum duration that can be printed (in seconds). */
        const max = 8 * 10 * 356 * 24 * 60 * 60; // max is 7 decades for some reason

        // use absolute value and limit it to the maximum value
        let dur = Math.min(Math.abs(this.totalSeconds), max);

        /** Index of the last unit boundary lesser than dur. */
        let boundaryI = 0;

        // go through unit boundaries
        for (let i = 0; i < unitBoundaries.length; i++) {

            const boundary = unitBoundaries[i];

            if (dur >= boundary[0]) {
                // dur is greater than or equal to this boundary
                boundaryI = i;
            } else {
                // found a boundary greater than dur, exit loop
                break;
            }

        }

        // found last boundary lesser than dur
        const unitBoundary = unitBoundaries[boundaryI];

        // calculate how many full units of the boundary dur contains
        const unitCount = Math.floor(dur / unitBoundary[0]);

        // print the number of units followed by the unit name, append 's' if not 1 unit
        return `${unitCount} ${unitBoundary[1]}${unitCount === 1 ? '' : 's'}`;

    }

    /** Prints this timespan as a human-readable string like "5 minutes ago" or "6 days from now". */
    prettyPrintRelative(): string {

        /** The maximum duration that can be printed (in seconds). */
        const max = 8 * 10 * 356 * 24 * 60 * 60; // max is 7 decades for some reason

        // use absolute value and limit it to the maximum value
        let dur = Math.min(Math.abs(this.totalSeconds), max);

        if (dur <= 60) {

            // kustom represents values below and including 1 minute as "moments ago/from now"
            return `moments ${this.totalSeconds > 0 ? 'from now' : 'ago'}`;

        } else {

            /** Index of the last unit boundary lesser than dur. */
            let boundaryI = 0;

            // go through unit boundaries
            for (let i = 0; i < unitBoundaries.length; i++) {
                let boundary = unitBoundaries[i];

                // note the lack of "equal to" - it is on purpose!
                if (dur > boundary[0]) {

                    // dur is greater than this boundary
                    boundaryI = i;

                } else {
                    // found a boundary greater than or equal to dur, exit loop
                    break;
                }
            }

            // found last boundary lesser than dur
            let boundary = unitBoundaries[boundaryI];

            // calculate how many full units of the boundary dur contains
            let boundaryCount = Math.floor(dur / boundary[0]);

            // print the number of units followed by the unit name, append 's' if not 1 unit, append from now or ago depending on sign
            return `${boundaryCount} ${boundary[1]}${boundaryCount === 1 ? '' : 's'} ${this.totalSeconds > 0 ? 'from now' : 'ago'}`;

        }

    }

}