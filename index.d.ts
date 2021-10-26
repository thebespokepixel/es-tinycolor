export class TinyColor {
    static newId(): number;
    static registerFormat(id: any, options?: {}): any;
    static equals(color1: any, color2: any): boolean;
    static fromRatio(color: any, options: any): TinyColor;
    static readability(color1: any, color2: any): number;
    static isReadable(color1: any, color2: any, wcag2: any): boolean;
    static mostReadable(baseColor: any, colorList: any, args: any): any;
    static mix(color1: any, color2: any, amount: any): TinyColor;
    /**
     * Create a new TinyColor instance
     * @param  {String|Array|Object} color Notation describing a color
     * @param  {Object} options            Options object (see below)
     * @return {TinyColor}                 An instance representing the color
     */
    constructor(color: string | any[] | any, options?: any);
    _originalInput: any;
    _r: any;
    _g: any;
    _b: any;
    _a: number;
    _roundA: number;
    _format: any;
    _gradientType: any;
    _ok: boolean;
    _tc_id: number;
    isDark(): boolean;
    isLight(): boolean;
    isValid(): boolean;
    getOriginalInput(): any;
    getFormat(): any;
    getAlpha(): number;
    getBrightness(): number;
    getLuminance(): number;
    toString(format: any): any;
    toName(): any;
    toRgb(): any;
    toRgbString(): string;
    toRgbArray(): any[];
    toPercentageRgb(): {
        r: string;
        g: string;
        b: string;
        a: any;
    };
    toPercentageRgbString(): string;
    toHex(allow3Char: any): string;
    toHexString(allow3Char: any): string;
    toHex8(allow4Char: any): string;
    toHex8String(allow4Char: any): string;
    toHsv(): any;
    toHsvString(): any;
    toHsl(): any;
    toHslString(): any;
    setAlpha(value: any): TinyColor;
    clone(): TinyColor;
    lighten(...args: any[]): TinyColor;
    brighten(...args: any[]): TinyColor;
    darken(...args: any[]): TinyColor;
    desaturate(...args: any[]): TinyColor;
    saturate(...args: any[]): TinyColor;
    greyscale(...args: any[]): TinyColor;
    invert(...args: any[]): TinyColor;
    spin(...args: any[]): TinyColor;
    analogous(...args: any[]): any;
    complement(...args: any[]): any;
    monochromatic(...args: any[]): any;
    splitcomplement(...args: any[]): any;
    triad(...args: any[]): any;
    tetrad(...args: any[]): any;
}
export namespace names {
    const transparent: string;
}
export function tinycolor(color: any, options: any): TinyColor;
export namespace tinycolor {
    import equals = TinyColor.equals;
    export { equals };
    import registerFormat = TinyColor.registerFormat;
    export { registerFormat };
    import fromRatio = TinyColor.fromRatio;
    export { fromRatio };
    import mix = TinyColor.mix;
    export { mix };
    import readability = TinyColor.readability;
    export { readability };
    import isReadable = TinyColor.isReadable;
    export { isReadable };
    import mostReadable = TinyColor.mostReadable;
    export { mostReadable };
    export { names };
}
