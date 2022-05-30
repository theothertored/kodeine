"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthDayCount = exports.hsv2rgb = exports.rgb2hsv = exports.lerp = exports.padWithZeros = exports.daysIntoYear = exports.clamp = void 0;
/** A utility function that limits the given {@link value} between given {@link min} and {@link max}. */
function clamp(value, min, max) {
    return value < min ? min : value > max ? max : value;
}
exports.clamp = clamp;
/**
 * A utility function that calculates the day-in-year number for a given date.
 * @see https://stackoverflow.com/a/40975730/6796433
 */
function daysIntoYear(date) {
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}
exports.daysIntoYear = daysIntoYear;
/**
 * A utility function that left-pads the given number with zeroes until the target length is achieved.
 * @param source The number to be padded with zeros.
 * @param targetLength The length to pad to.
 * @returns The padded string.
 */
function padWithZeros(source, targetLength) {
    const sourceString = source.toString();
    if (sourceString.length >= targetLength)
        return sourceString;
    else
        return '0'.repeat(targetLength - sourceString.length) + sourceString;
}
exports.padWithZeros = padWithZeros;
/** A utility function that linearly interpolates between {@link a} and {@link b} by the given {@link fraction}. */
function lerp(a, b, fraction) {
    return Math.round(a + (b - a) * fraction);
}
exports.lerp = lerp;
/**
 * A utility function converting RGB colors to HSV colors.
 * @see https://www.rapidtables.com/convert/color/rgb-to-hsv.html
 */
function rgb2hsv(r, g, b) {
    const rf = r / 255;
    const gf = g / 255;
    const bf = b / 255;
    const cmax = Math.max(rf, gf, bf);
    const cmin = Math.min(rf, gf, bf);
    const delta = cmax - cmin;
    let h = 60 * (delta === 0 ? 0
        : cmax === rf ? (gf - bf) / delta % 6
            : cmax === gf ? (bf - rf) / delta + 2
                : (rf - gf) / delta + 4);
    let s = cmax === 0 ? 0 : delta / cmax;
    let v = cmax;
    return [h, s, v];
}
exports.rgb2hsv = rgb2hsv;
/**
 * A utility function converting HSV colors to RGB colors.
 * @see https://www.rapidtables.com/convert/color/hsv-to-rgb.html
 */
function hsv2rgb(h, s, v) {
    const c = v * s;
    const x = c * (1 - Math.abs(h / 60 % 2 - 1));
    const m = v - c;
    const [rf, gf, bf] = h < 60 ? [c, x, 0]
        : h < 120 ? [x, c, 0]
            : h < 180 ? [0, c, x]
                : h < 240 ? [0, x, c]
                    : h < 300 ? [x, 0, c]
                        : [c, 0, x];
    return [rf, gf, bf].map(c => Math.round((c + m) * 255));
}
exports.hsv2rgb = hsv2rgb;
/** A utility function that returns how many days are in the given month of the given year. */
function getMonthDayCount(year, month) {
    return new Date(year, month + 1, 0).getDate();
}
exports.getMonthDayCount = getMonthDayCount;
//# sourceMappingURL=utils.js.map