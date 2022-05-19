export declare class TimeSpan {
    totalSeconds: number;
    get totalMinutes(): number;
    get totalHours(): number;
    get totalDays(): number;
    constructor(totalSeconds: number);
    format(format: string): string;
    prettyPrintAbsolute(): string;
    prettyPrintRelative(): string;
}
