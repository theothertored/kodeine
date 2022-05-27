"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgbColor = void 0;
const pad = (s) => s.length === 1 ? '0' + s : s;
class ArgbColor {
    constructor(a, r, g, b) {
        this.a = a;
        this.r = r;
        this.g = g;
        this.b = b;
    }
    toARGBString() {
        let p = (c) => pad(c.toString(16).toUpperCase());
        return `#${p(this.a)}${p(this.r)}${p(this.g)}${p(this.b)}`;
    }
    // https://www.rapidtables.com/convert/color/hsv-to-rgb.html
    static fromAHSV(a, h, s, v) {
        let c = v * s;
        let x = c * (1 - Math.abs(h / 60 % 2 - 1));
        let m = v - c;
        let [rp, gp, bp] = h < 60 ? [c, x, 0]
            : h < 120 ? [x, c, 0]
                : h < 180 ? [0, c, x]
                    : h < 240 ? [0, x, c]
                        : h < 300 ? [x, 0, c]
                            : [c, 0, x];
        return new ArgbColor(a, Math.round((rp + m) * 255), Math.round((gp + m) * 255), Math.round((bp + m) * 255));
    }
}
exports.ArgbColor = ArgbColor;
//# sourceMappingURL=argb-color.js.map