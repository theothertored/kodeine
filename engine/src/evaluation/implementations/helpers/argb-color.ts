import { clamp, hsv2rgb, lerp, rgb2hsv } from "./utils.js";

/** A local helper function that left-pads a given string with zeros to 2 characters. */
const pad2 = (s: string) => s.length === 1 ? '0' + s : s;

/** 
 * Internal helper function that parses the given string as a hex number
 * and throws empty string if it cannot be parsed.
 */
const parseHexOrThrow = (hexString: string): number => {
    let val = parseInt(hexString, 16);
    if (isNaN(val))
        throw '';
    else
        return val;
};

/** Represents an 8-bit ARGB color. */
export class ArgbColor {

    /** Alpha component. Should be between 0 and 255. */
    public a: number;
    /** Red component. Should be between 0 and 255. */
    public r: number;
    /** Green component. Should be between 0 and 255. */
    public g: number;
    /** Blue component. Should be between 0 and 255. */
    public b: number;

    /**
     * Constructs an {@link ArgbColor} from the given components.
     * @param a Alpha component. Should be between 0 and 255.
     * @param r Red component. Should be between 0 and 255.
     * @param g Green component. Should be between 0 and 255.
     * @param b Blue component. Should be between 0 and 255.
     */
    constructor(a: number, r: number, g: number, b: number) {
        this.a = a;
        this.r = r;
        this.g = g;
        this.b = b;
    }

    /**
     * Creates a new {@link ArgbColor} with each RGB component equal to 255 minus its original value.
     * @returns A new {@link ArgbColor} with its RGB values inverted.
     */
    invertRGB(): ArgbColor {
        return new ArgbColor(
            this.a,
            255 - this.r,
            255 - this.g,
            255 - this.b
        );
    }

    /** 
     * Creates a new {@link ArgbColor} with its hue shifted by the given {@link amount} (in degrees).  
     * Internally uses RGB -> HSV -> shifted HSV -> RGB.
     * @param amount How much (in degrees) to shift the hue by.
     * @returns A new {@link ArgbColor} with its hue shifted by the given amount.
     */
    shiftHue(amount: number): ArgbColor {

        const [h, s, v] = rgb2hsv(this.r, this.g, this.b);

        return new ArgbColor(
            this.a, // keep alpha the same
            ...hsv2rgb((h + amount) % 360, s, v)
        );

    }

    /**
     * Creates a new {@link ArgbColor} with its alpha component set to the given value.
     * @param newAlpha The alpha component value for the new color.
     * @returns A new {@link ArgbColor} with the given alpha component and RGB values copied from the original.
     */
    setAlpha(newAlpha: number): ArgbColor {
        return new ArgbColor(
            clamp(newAlpha, 0, 255),
            this.r, this.g, this.b
        );
    }

    /**
     * Creates a new {@link ArgbColor} with its saturation set to the given value.
     * Internally uses RGB -> HSV -> changed HSV -> RGB.
     * @param newSaturation The value to set the saturation to. Should be between 0 and 1.
     * @returns A new {@link ArgbColor} with its saturation set to the given value.
     */
    setSaturation(newSaturation: number): ArgbColor {

        const [h, s, v] = rgb2hsv(this.r, this.g, this.b);

        return new ArgbColor(
            this.a,
            ...hsv2rgb(h, clamp(newSaturation, 0, 1), v)
        );

    }

    /**
     * Creates a new {@link ArgbColor} with its saturation increased/decreased by amount.
     * Internally uses RGB -> HSV -> changed HSV -> RGB.
     * @param amount How much to increase/decrease the saturation by.
     * @returns A new {@link ArgbColor} with its saturation increased/decreased by the given amount.
     */
    addSaturation(amount: number): ArgbColor {

        const [h, s, v] = rgb2hsv(this.r, this.g, this.b);

        return new ArgbColor(
            this.a,
            ...hsv2rgb(h, clamp(s + amount, 0, 1), v)
        );

    }

    /**
     * Creates a new {@link ArgbColor} with its value set to the given value.
     * Internally uses RGB -> HSV -> changed HSV -> RGB.
     * @param newSaturation The value to set the value to. Should be between 0 and 1.
     * @returns A new {@link ArgbColor} with its value set to the given value.
     */
    setLuminance(newLuminance: number): ArgbColor {

        const [h, s, v] = rgb2hsv(this.r, this.g, this.b);

        return new ArgbColor(
            this.a,
            ...hsv2rgb(h, s, clamp(newLuminance, 0, 1))
        );

    }

    /**
     * Creates a new {@link ArgbColor} with its value increased/decreased by amount.
     * Internally uses RGB -> HSV -> changed HSV -> RGB.
     * @param amount How much to increase/decrease the value by.
     * @returns A new {@link ArgbColor} with its value increased/decreased by the given amount.
     */
    addLuminance(amount: number): ArgbColor {

        const [h, s, v] = rgb2hsv(this.r, this.g, this.b);

        return new ArgbColor(
            this.a,
            ...hsv2rgb(h, s, clamp(v + amount, 0, 1))
        );

    }

    /** Converts this color to an ARGB hex string with a leading `#`. */
    toARGBString(): string {
        let p = (c: number) => pad2(c.toString(16).toUpperCase());
        return `#${p(this.a)}${p(this.r)}${p(this.g)}${p(this.b)}`;
    }

    /** Creates a new {@link ArgbColor} from given AHSV component values. 
     * @param a Alpha component. Should be between 0 and 255.
     * @param h Hue component. Should be between 0 and 360.
     * @param s Saturation component. Should be between 0 and 1.
     * @param v Value component. Should be between 0 and 1.
     */
    static fromAHSV(a: number, h: number, s: number, v: number): ArgbColor {

        return new ArgbColor(a, ...hsv2rgb(h, s, v));

    }

    /** Parses a given ARGB hex string into an {@link ArgbColor}. */
    static parse(hexString: string): ArgbColor {

            // Remove # and spaces from the hex string.
            let treatedHexString = hexString.replace(/ |#/g, '');

            if (treatedHexString.length === 6) {

                // RRGGBB
                let r = parseHexOrThrow(treatedHexString.substring(0, 2));
                let g = parseHexOrThrow(treatedHexString.substring(2, 4));
                let b = parseHexOrThrow(treatedHexString.substring(4, 6));
                return new ArgbColor(255, r, g, b);

            } else if (treatedHexString.length === 8) {

                // AARRGGBB
                let a = parseHexOrThrow(treatedHexString.substring(0, 2));
                let r = parseHexOrThrow(treatedHexString.substring(2, 4));
                let g = parseHexOrThrow(treatedHexString.substring(4, 6));
                let b = parseHexOrThrow(treatedHexString.substring(6, 8));
                return new ArgbColor(255, r, g, b);

            } else {
                // invalid format
                throw new Error(`Value ${hexString} could not be parsed as a color.`);
            }

    }

    /** Returns the default color to be used when a color cannot be parsed (transparent black). */
    static default() {
        return new ArgbColor(0, 0, 0, 0);
    }

    /** Creates a new {@link ArgbColor} by component-wise linearly interpolating between two colors by the given fraction. */
    static lerp(color1: ArgbColor, color2: ArgbColor, fraction: number): ArgbColor {

        if (fraction < 0) {
            return new ArgbColor(
                lerp(color2.a, color1.a, -fraction),
                lerp(color2.r, color1.r, -fraction),
                lerp(color2.g, color1.g, -fraction),
                lerp(color2.b, color1.b, -fraction)
            );
        } else {

            return new ArgbColor(
                lerp(color1.a, color2.a, fraction),
                lerp(color1.r, color2.r, fraction),
                lerp(color1.g, color2.g, fraction),
                lerp(color1.b, color2.b, fraction)
            );
        }
    }
}
