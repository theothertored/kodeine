/** Represents an 8-bit ARGB color. */
export declare class ArgbColor {
    /** Alpha component. Should be between 0 and 255. */
    a: number;
    /** Red component. Should be between 0 and 255. */
    r: number;
    /** Green component. Should be between 0 and 255. */
    g: number;
    /** Blue component. Should be between 0 and 255. */
    b: number;
    /**
     * Constructs an {@link ArgbColor} from the given components.
     * @param a Alpha component. Should be between 0 and 255.
     * @param r Red component. Should be between 0 and 255.
     * @param g Green component. Should be between 0 and 255.
     * @param b Blue component. Should be between 0 and 255.
     */
    constructor(a: number, r: number, g: number, b: number);
    /**
     * Creates a new {@link ArgbColor} with each RGB component equal to 255 minus its original value.
     * @returns A new {@link ArgbColor} with its RGB values inverted.
     */
    invertRGB(): ArgbColor;
    /**
     * Creates a new {@link ArgbColor} with its hue shifted by the given {@link amount} (in degrees).
     * Internally uses RGB -> HSV -> shifted HSV -> RGB.
     * @param amount How much (in degrees) to shift the hue by.
     * @returns A new {@link ArgbColor} with its hue shifted by the given amount.
     */
    shiftHue(amount: number): ArgbColor;
    /**
     * Creates a new {@link ArgbColor} with its alpha component set to the given value.
     * @param newAlpha The alpha component value for the new color.
     * @returns A new {@link ArgbColor} with the given alpha component and RGB values copied from the original.
     */
    setAlpha(newAlpha: number): ArgbColor;
    /**
     * Creates a new {@link ArgbColor} with its saturation set to the given value.
     * Internally uses RGB -> HSV -> changed HSV -> RGB.
     * @param newSaturation The value to set the saturation to. Should be between 0 and 1.
     * @returns A new {@link ArgbColor} with its saturation set to the given value.
     */
    setSaturation(newSaturation: number): ArgbColor;
    /**
     * Creates a new {@link ArgbColor} with its saturation increased/decreased by amount.
     * Internally uses RGB -> HSV -> changed HSV -> RGB.
     * @param amount How much to increase/decrease the saturation by.
     * @returns A new {@link ArgbColor} with its saturation increased/decreased by the given amount.
     */
    addSaturation(amount: number): ArgbColor;
    /**
     * Creates a new {@link ArgbColor} with its value set to the given value.
     * Internally uses RGB -> HSV -> changed HSV -> RGB.
     * @param newSaturation The value to set the value to. Should be between 0 and 1.
     * @returns A new {@link ArgbColor} with its value set to the given value.
     */
    setLuminance(newLuminance: number): ArgbColor;
    /**
     * Creates a new {@link ArgbColor} with its value increased/decreased by amount.
     * Internally uses RGB -> HSV -> changed HSV -> RGB.
     * @param amount How much to increase/decrease the value by.
     * @returns A new {@link ArgbColor} with its value increased/decreased by the given amount.
     */
    addLuminance(amount: number): ArgbColor;
    /** Converts this color to an ARGB hex string with a leading `#`. */
    toARGBString(): string;
    /** Creates a new {@link ArgbColor} from given AHSV component values.
     * @param a Alpha component. Should be between 0 and 255.
     * @param h Hue component. Should be between 0 and 360.
     * @param s Saturation component. Should be between 0 and 1.
     * @param v Value component. Should be between 0 and 1.
     */
    static fromAHSV(a: number, h: number, s: number, v: number): ArgbColor;
    /** Parses a given ARGB hex string into an {@link ArgbColor}. */
    static parse(hexString: string): ArgbColor;
    /** Returns the default color to be used when a color cannot be parsed (transparent black). */
    static default(): ArgbColor;
    /** Creates a new {@link ArgbColor} by component-wise linearly interpolating between two colors by the given fraction. */
    static lerp(color1: ArgbColor, color2: ArgbColor, fraction: number): ArgbColor;
}
