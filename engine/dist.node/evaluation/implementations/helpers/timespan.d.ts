/** Represents a time segment with its duration accurate to a second. */
export declare class TimeSpan {
    /** The duration of this timespan in seconds. */
    totalSeconds: number;
    /** The duration of this timespan in minutes.  */
    get totalMinutes(): number;
    /** The duration of this timespan in hours.  */
    get totalHours(): number;
    /** The duration of this timespan in days.  */
    get totalDays(): number;
    /** Constructs a new timespan with a given duration. */
    constructor(totalSeconds: number);
    /**
     * Prints this timespan according to the given format.
     * *Note - mostly copy pasted from the `df()` `parse()` function.*
    */
    format(format: string): string;
    /** Prints this timespan as a human-readable string like "5 minutes" or "6 days". */
    prettyPrintAbsolute(): string;
    /** Prints this timespan as a human-readable string like "5 minutes ago" or "6 days from now". */
    prettyPrintRelative(): string;
}
