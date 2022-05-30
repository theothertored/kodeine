/** A utility function that limits the given {@link value} between given {@link min} and {@link max}. */
export declare function clamp(value: number, min: number, max: number): number;
/**
 * A utility function that calculates the day-in-year number for a given date.
 * @see https://stackoverflow.com/a/40975730/6796433
 */
export declare function daysIntoYear(date: Date): number;
/**
 * A utility function that left-pads the given number with zeroes until the target length is achieved.
 * @param source The number to be padded with zeros.
 * @param targetLength The length to pad to.
 * @returns The padded string.
 */
export declare function padWithZeros(source: number, targetLength: number): string;
/** A utility function that linearly interpolates between {@link a} and {@link b} by the given {@link fraction}. */
export declare function lerp(a: number, b: number, fraction: number): number;
/**
 * A utility function converting RGB colors to HSV colors.
 * @see https://www.rapidtables.com/convert/color/rgb-to-hsv.html
 */
export declare function rgb2hsv(r: number, g: number, b: number): [number, number, number];
/**
 * A utility function converting HSV colors to RGB colors.
 * @see https://www.rapidtables.com/convert/color/hsv-to-rgb.html
 */
export declare function hsv2rgb(h: number, s: number, v: number): [number, number, number];
/** A utility function that returns how many days are in the given month of the given year. */
export declare function getMonthDayCount(year: number, month: number): number;
