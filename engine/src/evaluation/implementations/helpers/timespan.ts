
function floorAndPad(source: number, targetLength: number) {
    const sourceString = Math.floor(source).toString();
    if (sourceString.length >= targetLength)
        return sourceString;
    else
        return '0'.repeat(targetLength - sourceString.length) + sourceString;
}

const formatTokens: Record<string, (timespan: TimeSpan, match: string) => string | number> = {
    'D': (timespan, match) => floorAndPad(timespan.totalDays, match.length),
    'H': (timespan, match) => floorAndPad(timespan.totalHours, match.length),
    'M': (timespan, match) => floorAndPad(timespan.totalMinutes, match.length),
    'S': (timespan, match) => floorAndPad(timespan.totalSeconds, match.length),
    'h': (timespan, match) => floorAndPad(timespan.totalHours % 24, match.length),
    'm': (timespan, match) => floorAndPad(timespan.totalMinutes % 60, match.length),
    's': (timespan, match) => floorAndPad(timespan.totalSeconds % 60, match.length)
};

const unitBoundaries: [number, string][] = [
    [60, 'minute'],
    [60 * 60, 'hour'],
    [60 * 60 * 24, 'day'],
    [60 * 60 * 24 * 29, 'month'],
    [60 * 60 * 24 * 365, 'year'],
    [60 * 60 * 24 * 365 * 10, 'decade']
];

export class TimeSpan {

    public totalSeconds: number;

    get totalMinutes(): number {
        return this.totalSeconds / 60;
    }

    get totalHours(): number {
        return this.totalMinutes / 60;
    }

    get totalDays(): number {
        return this.totalHours / 24;
    }

    constructor(totalSeconds: number) {
        this.totalSeconds = totalSeconds;
    }

    format(format: string): string {

        let output = '';

        let i = 0;

        let consume = () => format[i++];
        let peek = () => format[i];
        let eof = () => i >= format.length;

        while (!eof()) {

            let char = consume();

            if (char === '\'') {

                if (eof()) {

                    break;

                } else {

                    let nextChar = consume();

                    if (nextChar === '\'') {

                        output += '\'';

                    } else {

                        output += nextChar;

                        while (!eof() && peek() !== '\'') {
                            output += consume();
                        }

                        // consume ending '
                        if (!eof()) {
                            consume();
                        }

                    }

                }

            } else {

                let mutliFunc = formatTokens[char];

                if (mutliFunc) {

                    let buffer = char;

                    while (!eof() && peek() === char) {
                        buffer += consume();
                    }

                    output += mutliFunc(this, buffer);

                } else {
                    output += char;
                }

            }

        }

        return output;

    }

    prettyPrintAbsolute(): string {

        const max = 8 * 10 * 356 * 24 * 60 * 60; // max is 7 decades for some reason
        let dur = Math.min(Math.abs(this.totalSeconds), max);

        let boundaryI = 0;
        for (let i = 0; i < unitBoundaries.length; i++) {
            let boundary = unitBoundaries[i];
            if (dur >= boundary[0]) {
                boundaryI = i;
            } else {
                break;
            }
        }

        let boundary = unitBoundaries[boundaryI];
        let boundaryCount = Math.floor(dur / boundary[0]);
        return `${boundaryCount} ${boundary[1]}${boundaryCount === 1 ? '' : 's'}`;

    }

    prettyPrintRelative(): string {

        const max = 8 * 10 * 356 * 24 * 60 * 60; // max is 7 decades for some reason
        let dur = Math.min(Math.abs(this.totalSeconds), max);

        if (dur <= 60) {

            return `moments ${this.totalSeconds > 0 ? 'from now' : 'ago'}`;

        } else {

            let boundaryI = 0;
            for (let i = 0; i < unitBoundaries.length; i++) {
                let boundary = unitBoundaries[i];
                if (dur > boundary[0]) {
                    boundaryI = i;
                } else {
                    break;
                }
            }

            let boundary = unitBoundaries[boundaryI];
            let boundaryCount = Math.floor(dur / boundary[0]);
            return `${boundaryCount} ${boundary[1]}${boundaryCount === 1 ? '' : 's'} ${this.totalSeconds > 0 ? 'from now' : 'ago'}`;

        }

    }

}