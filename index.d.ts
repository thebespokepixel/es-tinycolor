export class TinyColor {
    /**
     * Create a new ID
     *
     * @return     {number}  Incremented ID counter
     */
    static newId(): number;
    /**
     * Register a TinyColor extension
     * @param   {string}  id                   The plugin identifier
     * @param   {object}  [options={}]         Plugin options
     * @param   {string}  options.alphaFormat  rgb|hex
     * @param   {boolean} options.shortHex     Short hex codes #ABC, if possible
     * @param   {boolean} options.upperCaseHex User UPPER case hex
     * @return  {TinyColorExtension}           The TinyColor extension
     */
    static registerFormat(id: string, options?: {
        alphaFormat: string;
        shortHex: boolean;
        upperCaseHex: boolean;
    }): TinyColorExtension;
    /**
     * Are two TinyColor colours equivalent?
     *
     * @param      {TinyColor}  color1  The first color
     * @param      {TinyColor}  color2  The second color
     * @return     {boolean}  Equivalent or not?
     */
    static equals(color1: TinyColor, color2: TinyColor): boolean;
    /**
     * Create a new TinyColor from values from 0..1
     *
     * @param      {Object}     color    The color
     * @param      {<type>}     options  The options
     * @return     {TinyColor}  The tiny color.
     */
    static fromRatio(color: any, options: <type>() => any): TinyColor;
    /**
     * Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
     *
     * @param      {TinyColor}  color1  The first color
     * @param      {TinyColor}  color2  The second color
     * @return     {number}             The color contrast defined by (WCAG Version 2)
     */
    static readability(color1: TinyColor, color2: TinyColor): number;
    /**
     * Ensure that foreground and background color combinations meet WCAG2 guidelines.
     *
     * @param   {TinyColor}        color1        The first color
     * @param   {TinyColor}        color2        The second color
     * @param   {object}           wcag2         The WCAG2 properties to test
     * @param   {object}           wcag2.level   The level to test "AA" or "AAA" (default "AA")
     * @param   {object}           wcag2.size    The content size to test "large" or "small" (default "small")
     * @example Tinycolor.isReadable("#000", "#111") → false
     * @example Tinycolor.isReadable("#000", "#111", {level:"AA",size:"large"}) → false
     * @return  {(boolean|number)} True if readable, False otherwise.
     */
    static isReadable(color1: TinyColor, color2: TinyColor, wcag2: {
        level: object;
        size: object;
    }): (boolean | number);
    /**
     * Given a base color and a list of possible foreground or background colors for that
     * base, returns the most readable color.
     *
     * Optionally returns Black or White if the most readable color is unreadable.
     *
     * @param   {TinyColor}    baseColor                     The base color
     * @param   {[TinyColor]}  colorList                     An array of TinyColors
     * @param   {object}       [args={}]                     The arguments
     * @param   {boolean}      args.includeFallbackColors    Include fallback colors?
     * @param   {object}       args.level                    The level to test "AA" or "AAA" (default "AA")
     * @param   {object}       args.size                     The content size to test "large" or "small" (default "small")
     * @example Tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"], {includeFallbackColors:false}).toHexString(); // "#112255"
     * @example Tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"], {includeFallbackColors:true}).toHexString();  // "#ffffff"
     * @example Tinycolor.mostReadable("#a8015a", ["#faf3f3"], {includeFallbackColors:true, level:"AAA", size:"large"}).toHexString(); // "#faf3f3"
     * @example Tinycolor.mostReadable("#a8015a", ["#faf3f3"], {includeFallbackColors:true, level:"AAA", size:"small"}).toHexString(); // "#ffffff"
     * @return  {TinyColor}    A TinyColor instance of the msot readable color.
     */
    static mostReadable(baseColor: TinyColor, colorList: [TinyColor], args?: {
        includeFallbackColors: boolean;
        level: object;
        size: object;
    }): TinyColor;
    /**
     * Mix a second colour into the first
     *
     * @param  {TinyColor}  color1  The first color
     * @param  {TinyColor}  color2  The second color
     * @param  {number}     amount  The mix amount of the second color
     * @return {TinyColor}			   A new, mixed TinyColor instance
     */
    static mix(color1: TinyColor, color2: TinyColor, amount: number): TinyColor;
    /**
     * Create a new TinyColor instance
     * @param  {string|array|object} color Notation describing a color
     * @param  {object} options            Options object (see below)
     * @return {TinyColor}                 An instance representing the color
     */
    constructor(color: string | any[] | object, options?: object);
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
    /**
     * Determines if dark.
     *
     * @return     {boolean}  True if dark, False otherwise.
     */
    isDark(): boolean;
    /**
     * Determines if light.
     *
     * @return     {boolean}  True if light, False otherwise.
     */
    isLight(): boolean;
    /**
     * Determines if valid.
     *
     * @return     {boolean}  True if valid, False otherwise.
     */
    isValid(): boolean;
    /**
     * Gets the original input.
     *
     * @return     {string|object}  The original input.
     */
    getOriginalInput(): string | object;
    /**
     * Gets the format.
     *
     * @return     {string}  The format.
     */
    getFormat(): string;
    /**
     * Gets the alpha.
     *
     * @return     {<number>}  The alpha.
     */
    getAlpha(): <number>() => any;
    /**
     * Gets the brightness.
     *
     * @return     {number}  The brightness.
     */
    getBrightness(): number;
    /**
     * Gets the luminance.
     *
     * @return     {number}  The luminance.
     */
    getLuminance(): number;
    /**
     * Return the current color as a string.
     *
     * @param      {string}  format  The color format
     * @return     {string}  The current color, as a string.
     */
    toString(format: string): string;
    /**
     * Returns a name representation of the object.
     *
     * @return     {string}  The name of the colour.
     */
    toName(): string;
    /**
     * Returns a rgb representation of the object.
     *
     * @return     {object}  Rgb representation of the object.
     */
    toRgb(): object;
    /**
     * Returns a rgb string representation of the object.
     *
     * @return     {string}  Rgb string representation of the object.
     */
    toRgbString(): string;
    /**
     * Returns a rgb array representation of the object.
     *
     * @return     {[number]}  Rgb array representation of the object.
     */
    toRgbArray(): [number];
    /**
     * Returns a percentage rgb representation of the object.
     *
     * @return     {object}  Percentage rgb representation of the object.
     */
    toPercentageRgb(): object;
    /**
     * Returns a percentage rgb string representation of the object.
     *
     * @return     {string}  Percentage rgb string representation of the object.
     */
    toPercentageRgbString(): string;
    /**
     * Return the hex string of a color, as pure hexadecimal.
     *
     * @param      {boolean}  allow3Char  Allow 3 digit RGB strings
     * @return     {string}  The Hex string of the color.
     */
    toHex(allow3Char: boolean): string;
    /**
     * Return the hex string of a color, with a leading #
     *
     * @param      {boolean}  allow3Char  Allow 3 digit RGB strings
     * @return     {string}  The Hex string of the color.
     */
    toHexString(allow3Char: boolean): string;
    /**
     * Return the hex string of a color with aplha, as pure hexadecimal.
     *
     * @param      {boolean}  allow4Char  Allow 4 digit RGBA strings
     * @return     {string}  The Hex string of the color.
     */
    toHex8(allow4Char: boolean): string;
    /**
     * Return the hex string of a color with aplha, with a leading #
     *
     * @param      {boolean}  allow3Char  Allow 4 digit RGBA strings
     * @return     {string}  The Hex string of the color.
     */
    toHex8String(allow4Char: any): string;
    /**
     * Returns a HSV object representation of the object.
     *
     * @return     {object}  HSV(A) representation of the color.
     */
    toHsv(): object;
    /**
     * Returns a HSV string representation of the object.
     *
     * @return     {string}  hsv(h, s, v[, a]) representation of the color.
     */
    toHsvString(): string;
    /**
     * Returns a HSL object representation of the object.
     *
     * @return     {object}  HSL(A) representation of the color.
     */
    toHsl(): object;
    /**
     * Returns a HSL string representation of the object.
     *
     * @return     {string}  hsl(h, s, l[, a]) representation of the color.
     */
    toHslString(): string;
    /**
     * Sets the alpha.
     *
     * @param      {number}  value   The alpha value (0 - 1.0)
     * @return     {TinyColor}  The current colour with the set alpha.
     */
    setAlpha(value: number): TinyColor;
    /**
     * Creates a new instance of the object with same properties than original.
     *
     * @return     {TinyColor}  Copy of this object.
     */
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
    /**
     * Are two TinyColor colours equivalent?
     *
     * @alias  tinycolor.equals
     * @param  {TinyColor}  color1  The first color
     * @param  {TinyColor}  color2  The second color
     * @return {boolean}    Equivalent or not?
     */
    export function equals(color1: TinyColor, color2: TinyColor): boolean;
    /**
     * Register a TinyColor extension
     *
     * @alias  tinycolor.registerFormat
     * @param  {string}  id                   The plugin identifier
     * @param  {object}  [options={}]         Plugin options
     * @param  {string}  options.alphaFormat  rgb|hex
     * @param  {boolean} options.shortHex     Short hex codes #ABC, if possible
     * @param  {boolean} options.upperCaseHex User UPPER case hex
     * @return {TinyColorExtension}           The TinyColor extension
     */
    export function registerFormat(id: string, options?: {
        alphaFormat: string;
        shortHex: boolean;
        upperCaseHex: boolean;
    }): TinyColorExtension;
    /**
     * Create a new TinyColor from values from 0..1
     *
     * @alias  tinycolor.fromRatio
     * @param  {object}    color    The color values
     * @param  {object}    options  Options to pass to TinyColor constructor
     * @return {TinyColor}          A TinyColor instance
     */
    export function fromRatio(color: any, options: any): TinyColor;
    /**
     * Mix a second colour into the first
     *
     * @alias  tinycolor.mix
     * @param  {TinyColor}  color1  The first color
     * @param  {TinyColor}  color2  The second color
     * @param  {number}     amount  The mix amount of the second color
     * @return {TinyColor}			   A new, mixed TinyColor instance
     */
    export function mix(color1: TinyColor, color2: TinyColor, amount: number): TinyColor;
    /**
     * How readable is the first color over the second color
     *
     * @alias  tinycolor.readability
     * @param  {TinyColor}  color1  The first color
     * @param  {TinyColor}  color2  The second color
     * @return {number}             The color contrast defined by (WCAG Version 2)
     */
    export function readability(color1: TinyColor, color2: TinyColor): number;
    /**
     * Ensure that foreground and background color combinations meet WCAG2 guidelines.
     *
     * @alias  tinycolor.isReadable
     * @param   {TinyColor}        color1        The first color
     * @param   {TinyColor}        color2        The second color
     * @param   {object}           wcag2         The WCAG2 properties to test
     * @param   {object}           wcag2.level   The level to test "AA" or "AAA" (default "AA")
     * @param   {object}           wcag2.size    The content size to test "large" or "small" (default "small")
     * @example                                  tinycolor.isReadable("#000", "#111") → false
     * @example                                  tinycolor.isReadable("#000", "#111", {level:"AA",size:"large"}) → false
     * @return  {(boolean|number)} True if readable, False otherwise.
     */
    export function isReadable(color1: TinyColor, color2: TinyColor, wcag2: {
        level: any;
        size: any;
    }): number | boolean;
    /**
     * Given a base color and a list of possible foreground or background colors for that
     * base, returns the most readable color.
     *
     * Optionally returns Black or White if the most readable color is unreadable.
     *
     * @alias  tinycolor.mostReadable
     * @param   {TinyColor}    baseColor                     The base color
     * @param   {[TinyColor]}  colorList                     An array of TinyColors
     * @param   {object}       [args={}]                     The arguments
     * @param   {boolean}      args.includeFallbackColors    Include fallback colors?
     * @param   {object}       args.level                    The level to test "AA" or "AAA" (default "AA")
     * @param   {object}       args.size                     The content size to test "large" or "small" (default "small")
     * @example tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
     * @example tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
     * @example tinycolor.mostReadable("#a8015a", ["#faf3f3"], {includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
     * @example tinycolor.mostReadable("#a8015a", ["#faf3f3"], {includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
     * @return  {TinyColor}    A TinyColor instance of the msot readable color.
     */
    export function mostReadable(baseColor: TinyColor, colorList: [TinyColor], args?: {
        includeFallbackColors: boolean;
        level: any;
        size: any;
    }): TinyColor;
    export { names };
}
declare class TinyColorExtension {
    constructor(api: any, id: any, options?: {});
    api: any;
    id: any;
    options: {};
    use(specified: any): TinyColorExtension;
    wanted: any;
    parse(input: any): {
        as: (format: any) => any;
        rgba: {
            r: any;
            g: any;
            b: any;
            a: any;
        };
        valueOf: () => any;
    };
    print(id: any, rgba: any): any;
    complete(rgba: any): string;
}
export {};
