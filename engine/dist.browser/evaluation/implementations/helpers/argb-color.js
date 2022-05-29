const pad = (s) => s.length === 1 ? '0' + s : s;
const lerp = (a, b, f) => Math.round(a + (b - a) * f);
const clamp = (value, min, max) => value < min ? min : value > max ? max : value;
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
export class ArgbColor {
    constructor(a, r, g, b) {
        this.a = a;
        this.r = r;
        this.g = g;
        this.b = b;
    }
    invert() {
        return new ArgbColor(this.a, 255 - this.r, 255 - this.g, 255 - this.b);
    }
    shiftHue(amount) {
        // RGB -> HSV (https://www.rapidtables.com/convert/color/rgb-to-hsl.html)
        const [h, s, v] = rgb2hsv(this.r, this.g, this.b);
        // HSV -> RGB (https://www.rapidtables.com/convert/color/hsl-to-rgb.html)
        return new ArgbColor(this.a, ...hsv2rgb((h + amount) % 360, s, v));
    }
    setAlpha(newAlpha) {
        return new ArgbColor(clamp(newAlpha, 0, 255), this.r, this.g, this.b);
    }
    setSaturation(newSaturation) {
        const [h, s, v] = rgb2hsv(this.r, this.g, this.b);
        return new ArgbColor(this.a, ...hsv2rgb(h, clamp(newSaturation, 0, 1), v));
    }
    addSaturation(amount) {
        const [h, s, v] = rgb2hsv(this.r, this.g, this.b);
        return new ArgbColor(this.a, ...hsv2rgb(h, clamp(s + amount, 0, 1), v));
    }
    setLuminance(newLuminance) {
        const [h, s, v] = rgb2hsv(this.r, this.g, this.b);
        return new ArgbColor(this.a, ...hsv2rgb(h, s, clamp(newLuminance, 0, 1)));
    }
    addLuminance(amount) {
        const [h, s, v] = rgb2hsv(this.r, this.g, this.b);
        return new ArgbColor(this.a, ...hsv2rgb(h, s, clamp(v + amount, 0, 1)));
    }
    toARGBString() {
        let p = (c) => pad(c.toString(16).toUpperCase());
        return `#${p(this.a)}${p(this.r)}${p(this.g)}${p(this.b)}`;
    }
    static fromAHSV(a, h, s, v) {
        return new ArgbColor(a, ...hsv2rgb(h, s, v));
    }
    static parse(str) {
        const parse2 = (str) => {
            let val = parseInt(str, 16);
            if (isNaN(val))
                throw '';
            else
                return val;
        };
        try {
            str = str.replace(/ |#|[^a-zA-Z0-9]/g, '');
            if (str.length === 6) {
                let r = parse2(str.substring(0, 2));
                let g = parse2(str.substring(2, 4));
                let b = parse2(str.substring(4, 6));
                return new ArgbColor(255, r, g, b);
            }
            else if (str.length === 8) {
                let a = parse2(str.substring(0, 2));
                let r = parse2(str.substring(2, 4));
                let g = parse2(str.substring(4, 6));
                let b = parse2(str.substring(6, 8));
                return new ArgbColor(255, r, g, b);
            }
        }
        catch (_a) { }
        return ArgbColor.default();
    }
    static default() {
        return new ArgbColor(0, 0, 0, 0);
    }
    static mix(color1, color2, factor) {
        if (factor < 0) {
            return new ArgbColor(lerp(color2.a, color1.a, -factor), lerp(color2.r, color1.r, -factor), lerp(color2.g, color1.g, -factor), lerp(color2.b, color1.b, -factor));
        }
        else {
            return new ArgbColor(lerp(color1.a, color2.a, factor), lerp(color1.r, color2.r, factor), lerp(color1.g, color2.g, factor), lerp(color1.b, color2.b, factor));
        }
    }
}
//# sourceMappingURL=argb-color.js.map