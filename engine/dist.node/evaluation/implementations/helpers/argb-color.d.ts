export declare class ArgbColor {
    a: number;
    r: number;
    g: number;
    b: number;
    constructor(a: number, r: number, g: number, b: number);
    toARGBString(): string;
    static fromAHSV(a: number, h: number, s: number, v: number): ArgbColor;
}
