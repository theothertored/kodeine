export declare class ArgbColor {
    a: number;
    r: number;
    g: number;
    b: number;
    constructor(a: number, r: number, g: number, b: number);
    invert(): ArgbColor;
    shiftHue(amount: number): ArgbColor;
    setAlpha(newAlpha: number): ArgbColor;
    setSaturation(newSaturation: number): ArgbColor;
    addSaturation(amount: number): ArgbColor;
    setLuminance(newLuminance: number): ArgbColor;
    addLuminance(amount: number): ArgbColor;
    toARGBString(): string;
    static fromAHSV(a: number, h: number, s: number, v: number): ArgbColor;
    static parse(str: string): ArgbColor;
    static default(): ArgbColor;
    static mix(color1: ArgbColor, color2: ArgbColor, factor: number): ArgbColor;
}
