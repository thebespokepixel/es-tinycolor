const mathRound = Math.round;
const mathMin = Math.min;
const mathMax = Math.max;
const isOnePointZero = n => typeof n === 'string' && n.includes('.') && Number.parseFloat(n) === 1;
const isPercentage = n => typeof n === 'string' && n.includes('%');
const roundIf01 = n => n < 1 ? mathRound(n) : n;
const roundAlpha = a => mathRound(100 * a) / 100;
const boundAlpha = a => {
	a = Number.parseFloat(a);
	return (Number.isNaN(a) || a < 0 || a > 1) ? 1 : a
};
const hasAlpha = rgba => rgba.a < 1 && rgba.a >= 0;
const clamp01 = value => mathMin(1, mathMax(0, value));
const pad2 = c => c.length === 1 ? `0${c}` : `${c}`;
const CSS_INTEGER = '[-\\+]?\\d+%?';
const CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?';
const CSS_UNIT = `(?:${CSS_NUMBER})|(?:${CSS_INTEGER})`;
const isValidCSSUnit = color => new RegExp(CSS_UNIT).test(color);
const isValidCSSUnitRGB = rgb => isValidCSSUnit(rgb.r) && isValidCSSUnit(rgb.g) && isValidCSSUnit(rgb.b);
const PERMISSIVE_MATCH3 = `[\\s|\\(]+(${CSS_UNIT})[,|\\s]+(${CSS_UNIT})[,|\\s]+(${CSS_UNIT})\\s*\\)?`;
const PERMISSIVE_MATCH4 = `[\\s|\\(]+(${CSS_UNIT})[,|\\s]+(${CSS_UNIT})[,|\\s]+(${CSS_UNIT})[,|\\s]+(${CSS_UNIT})\\s*\\)?`;
function bound01(n, max) {
	if (isOnePointZero(n)) {
		n = '100%';
	}
	const processPercent = isPercentage(n);
	n = mathMin(max, mathMax(0, Number.parseFloat(n)));
	if (processPercent) {
		n = Number.parseInt(n * max, 10) / 100;
	}
	if ((Math.abs(n - max) < 0.000_001)) {
		return 1
	}
	return (n % max) / Number.parseFloat(max)
}

/**
 * Converts a base-16 hex value into a base-10 integer
 *
 * @alias converters.convertHexToInt
 * @param  {string} val Hexadecimal input value
 * @return {number}     Integer value
 */
const convertHexToInt = value => Number.parseInt(value, 16);
/**
 * Converts a hex value to a decimal
 *
 * @alias converters.convertHexToDecimal
 * @param  {string} h Hexadecimal input value
 * @return {number}   Decimal value
 */
const convertHexToDecimal = h => convertHexToInt(h) / 255;
/**
 * Replace a decimal with it's percentage value
 *
 * @alias converters.convertToPercentage
 * @param  {number} n Decimal input value
 * @return {string}   Percentage string
 */
const convertToPercentage = n => n <= 1 ? `${n * 100}%` : n;
/**
 * Handle conversion of internal precise values to exportable values. Should be
 * able to accept a tinycolour instance 'this' value.
 *
 * @alias converters.rawToRgba
 * @param  {object} raw { _r, _g, _b, _a } with _r, _g, _b in [0.0, 255.0] and _a in [0, 1]
 * @return {object}     { r, g, b } in [0, 255]
 */
const rawToRgba = raw => {
	const [r, g, b] = [raw._r, raw._g, raw._b].map(value => mathRound(value));
	return {r, g, b, a: raw._roundA}
};
/**
 * Handle conversion of internal precise values to exportable values,
 * maintaining deep precision. Should be able to accept a tinycolour instance
 * 'this' value.
 *
 * @alias converters.rawToDeepRgba
 * @param  {object} raw { _r, _g, _b, _a } with _r, _g, _b in [0.0, 255.0] and _a in [0, 1]
 * @return {object}     { r, g, b, a } in [0.0, 255.0]
 */
const rawToDeepRgba = raw => ({r: raw._r, g: raw._g, b: raw._b, a: raw._a});
/**
 * Handle bounds / percentage checking to conform to CSS color spec
 * @link{http://www.w3.org/TR/css3-color/|www.w3.org/TR/css3-color}
 *
 * @alias converters.conformRgba
 * @param  {object} rgba { r, g, b, a } in [0, 255] or [0, 1]
 * @return {object}      { r, g, b } in [0, 255]
 */
const conformRgba = rgba => {
	const [r, g, b] = [rgba.r, rgba.g, rgba.b].map(n => bound01(n, 255) * 255);
	return {r, g, b, a: boundAlpha(rgba.a)}
};
const rgbaToPercentageRgba = rgba => {
	const [r, g, b] = [rgba.r, rgba.g, rgba.b].map(n => `${mathRound(bound01(n, 255) * 100)}%`);
	return {r, g, b, a: rgba.a}
};
const rgbaToString = rgba => (rgba.a === 1)
	? `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`
	: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
const rgbaToArray = rgba => (rgba.a === 1) ? [rgba.r, rgba.g, rgba.b] : [rgba.r, rgba.g, rgba.b, mathRound(rgba.a * 255)];
/**
 * Convert RGBA to hexadecimal
 *
 * Converts an RGBA color plus alpha transparency to hex
 * Assumes r, g, b are contained in the set [0, 255] and
 * a in [0, 1]. Returns a 4 or 8 character rgba hex
 *
 * @alias converters.rgbaToHex
 * @param      {object}    rgba        The rgba object.
 * @param      {boolean}   allowShort  Allow short hex output
 * @return     {string}    The hex output.
 */
const rgbaToHex = (rgba, allowShort) => {
	const hex = rgbaToArray(rgba).map(n => n.toString(16)).map(value => pad2(value));
	return allowShort && hex.every(h => h.charAt(0) === h.charAt(1)) ? hex.map(h => h.charAt(0)).join('') : hex.join('')
};
/**
 * Convert RGB to hexadecimal
 *
 * Converts an RGBA color plus alpha transparency to hex
 * Assumes r, g, b are contained in the set [0, 255]. Returns a 3 or 6 character rgba hex
 *
 * @alias converters.rgbToHex
 * @param      {object}    rgb        The rgb object.
 * @param      {boolean}   allowShort  Allow short hex output
 * @return     {string}    The hex output.
 */
const rgbToHex = (rgba, allowShort) => rgbaToHex({...rgba, a: 1}, allowShort);

/**
 * Calculates the brightness.
 * http://www.w3.org/TR/AERT#color-contrast
 *
 * @alias calculations.calcBrightness
 * @param      {object}  rgb     The rgb
 * @return     {number}  The brightness.
 */
const calcBrightness = rgb => ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
/**
 * Calculates the luminance.
 * http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
 *
 * @alias calculations.calcLuminance
 * @param  {TinyColor} rgb The rgb color
 * @return {number}    The luminance.
 */
function calcLuminance(rgb) {
	const RsRGB = rgb.r / 255;
	const GsRGB = rgb.g / 255;
	const BsRGB = rgb.b / 255;
	const R = RsRGB <= 0.039_28 ? RsRGB / 12.92 : ((RsRGB + 0.055) / 1.055) ** 2.4;
	const G = GsRGB <= 0.039_28 ? GsRGB / 12.92 : ((GsRGB + 0.055) / 1.055) ** 2.4;
	const B = BsRGB <= 0.039_28 ? BsRGB / 12.92 : ((BsRGB + 0.055) / 1.055) ** 2.4;
	return (0.2126 * R) + (0.7152 * G) + (0.0722 * B)
}
/**
 * Calculates the mix of two colors.
 *
 * @alias calculations.calcMix
 * @param      {TinyColor}  color1  The first color
 * @param      {TinyColor}  color2  The second color
 * @param      {number}     amount  The amount to mix
 * @return     {TinyColor}  The mixed color.
 */
function calcMix(color1, color2, amount) {
	amount = (amount === 0) ? 0 : (amount || 50);
	const rgb1 = new TinyColor(color1).toRgb();
	const rgb2 = new TinyColor(color2).toRgb();
	const p = amount / 100;
	const rgba = {
		r: ((rgb2.r - rgb1.r) * p) + rgb1.r,
		g: ((rgb2.g - rgb1.g) * p) + rgb1.g,
		b: ((rgb2.b - rgb1.b) * p) + rgb1.b,
		a: ((rgb2.a - rgb1.a) * p) + rgb1.a,
	};
	return new TinyColor(rgba)
}

/**
 * Return valid WCAG2 parameters for isReadable.
 *
 * @alias readability.validateWCAG2Parms
 * @param      {object}  parms       The parameters
 * @param      {object}  parms.level The level to test "AA" or "AAA" (default "AA")
 * @param      {object}  parms.size  The content size to test "large" or "small" (default "small")
 * @return     {object}  sanitized parameters
 */
function validateWCAG2Parms(parms) {
	let level;
	let size;
	parms = parms || {
		level: 'AA',
		size: 'small',
	};
	level = (parms.level || 'AA').toUpperCase();
	size = (parms.size || 'small').toLowerCase();
	if (level !== 'AA' && level !== 'AAA') {
		level = 'AA';
	}
	if (size !== 'small' && size !== 'large') {
		size = 'small';
	}
	return {level, size}
}
/**
 * Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
 *
 * @param      {TinyColor}  color1  The first color
 * @param      {TinyColor}  color2  The second color
 * @return     {number}             The color contrast defined by (WCAG Version 2)
 */
function readability(color1, color2) {
	const c1 = new TinyColor(color1);
	const c2 = new TinyColor(color2);
	return (Math.max(c1.getLuminance(), c2.getLuminance()) + 0.05) / (Math.min(c1.getLuminance(), c2.getLuminance()) + 0.05)
}
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
function isReadable(color1, color2, wcag2) {
	const readable = readability(color1, color2);
	const wcag2Parms = validateWCAG2Parms(wcag2);
	let out = false;
	switch (wcag2Parms.level + wcag2Parms.size) {
		case 'AAlarge':
			out = readable >= 3;
			break
		case 'AAAsmall':
			out = readable >= 7;
			break
		default:
			out = readable >= 4.5;
	}
	return out
}
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
function mostReadable(baseColor, colorList, args = {}) {
	const {includeFallbackColors, level, size} = args;
	let readable;
	let bestColor = null;
	let bestScore = 0;
	for (const color of colorList) {
		readable = readability(baseColor, color);
		if (readable > bestScore) {
			bestScore = readable;
			bestColor = new TinyColor(color);
		}
	}
	if (isReadable(baseColor, bestColor, {level, size}) || !includeFallbackColors) {
		return bestColor
	}
	args.includeFallbackColors = false;
	return mostReadable(baseColor, ['#fff', '#000'], args)
}

function combine(action, args) {
	const actions = {monochromatic, analogous, complement, splitcomplement, triad, tetrad};
	return actions[action](...args)
}
/**
 * Find the complementary color.
 *
 * @param      {TinyColor}     color   The color
 * @return     {TinyColor}  The new complementary Tinycolor.
 */
function complement(color) {
	const hsl = new TinyColor(color).toHsl();
	hsl.h = (hsl.h + 180) % 360;
	return new TinyColor(hsl)
}
/**
 * Find the color triad colors.
 *
 * @param      {TinyColor}    color   The color
 * @return     {[TinyColor]}  An array of 3 triad TinyColors.
 */
function triad(color) {
	const hsl = new TinyColor(color).toHsl();
	const {h} = hsl;
	return [
		new TinyColor(color),
		new TinyColor({h: (h + 120) % 360, s: hsl.s, l: hsl.l}),
		new TinyColor({h: (h + 240) % 360, s: hsl.s, l: hsl.l}),
	]
}
/**
 * Find the color tetrad colors.
 *
 * @param      {TinyColor}   color   The color
 * @return     {[TinyColor]} An array of 4 tetrad TinyColors.
 */
function tetrad(color) {
	const hsl = new TinyColor(color).toHsl();
	const {h} = hsl;
	return [
		new TinyColor(color),
		new TinyColor({h: (h + 90) % 360, s: hsl.s, l: hsl.l}),
		new TinyColor({h: (h + 180) % 360, s: hsl.s, l: hsl.l}),
		new TinyColor({h: (h + 270) % 360, s: hsl.s, l: hsl.l}),
	]
}
/**
 * Find the split complementary colors.
 *
 * @param      {TinyColor}    color   The color
 * @return     {[TinyColor]}  An array of 3 split complementary TinyColors.
 */
function splitcomplement(color) {
	const hsl = new TinyColor(color).toHsl();
	const {h} = hsl;
	return [
		new TinyColor(color),
		new TinyColor({h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
		new TinyColor({h: (h + 216) % 360, s: hsl.s, l: hsl.l}),
	]
}
/**
 * Find the analogous colors.
 *
 * @param      {TinyColor}    color   The color
 * @return     {[TinyColor]}  The new analogous Tinycolors.
 */
function analogous(color, results = 6, slices = 30) {
	const hsl = new TinyColor(color).toHsl();
	const part = 360 / slices;
	const returnValue = [new TinyColor(color)];
	for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results;) {
		hsl.h = (hsl.h + part) % 360;
		returnValue.push(new TinyColor(hsl));
	}
	return returnValue
}
/**
 * Find the monochromatic color.
 *
 * @param      {TinyColor}    color   The color
 * @return     {TinyColor}  The new monochromatic Tinycolor.
 */
function monochromatic(color, results = 6) {
	const hsv = new TinyColor(color).toHsv();
	let {h, s, v} = hsv;
	const returnValue = [];
	const modification = 1 / results;
	while (results--) {
		returnValue.push(new TinyColor({h, s, v}));
		v = (v + modification) % 1;
	}
	return returnValue
}

/**
 * Apply a modification conditionally
 * @param  {Function}  action The modification function to apply
 * @param  {arguments} args   Arguments passed to specified function
 * @return {TinyColor}        The modified color
 */
function modify(action, args) {
	const actions = {invert, desaturate, saturate, greyscale, lighten, brighten, darken, spin};
	const color = actions[action](...args);
	const [source] = args;
	source._r = color._r;
	source._g = color._g;
	source._b = color._b;
	source.setAlpha(color._a);
	return source
}
/**
 * Invert Color
 * @param  {TinyColor} color  The color to invert
 * @return {TinyColor}        The inverted color
 */
function invert(color) {
	const rgb = new TinyColor(color).toRgb();
	rgb.r = mathMax(0, mathMin(255, 255 - rgb.r));
	rgb.g = mathMax(0, mathMin(255, 255 - rgb.g));
	rgb.b = mathMax(0, mathMin(255, 255 - rgb.b));
	return new TinyColor(rgb)
}
/**
 * Desaturate Color
 * @param  {TinyColor} color  The color to modify
 * @param  {Number}    amount The amount to desaturate <= 100
 * @return {TinyColor}        The modified color
 */
function desaturate(color, amount) {
	amount = (amount === 0) ? 0 : (amount || 10);
	const hsl = new TinyColor(color).toHsl();
	hsl.s -= amount / 100;
	hsl.s = clamp01(hsl.s);
	return new TinyColor(hsl)
}
/**
 * Saturate color
 * @param  {TinyColor} color  The color to modify
 * @param  {Number}    amount The amount to saturate <= 100
 * @return {TinyColor}        The modified color
 */
function saturate(color, amount) {
	amount = (amount === 0) ? 0 : (amount || 10);
	const hsl = new TinyColor(color).toHsl();
	hsl.s += amount / 100;
	hsl.s = clamp01(hsl.s);
	return new TinyColor(hsl)
}
/**
 * Remove all chroma, leaving luminence
 * @param  {TinyColor} color The color to modify
 * @return {TinyColor}       The modified color
 */
function greyscale(color) {
	return new TinyColor(color).desaturate(100)
}
/**
 * Lighten a color
 * @param  {TinyColor} color  The color to modify
 * @param  {Number}    amount The amount to ligten by <= 100
 * @return {TinyColor}        The modified color
 */
function lighten(color, amount) {
	amount = (amount === 0) ? 0 : (amount || 10);
	const hsl = new TinyColor(color).toHsl();
	hsl.l += amount / 100;
	hsl.l = clamp01(hsl.l);
	return new TinyColor(hsl)
}
/**
 * Brighten a color
 * @param  {TinyColor} color  The color to modify
 * @param  {Number}    amount The amount to brighten by <= 100
 * @return {TinyColor}        The modified color
 */
function brighten(color, amount) {
	amount = (amount === 0) ? 0 : (amount || 10);
	const rgb = new TinyColor(color).toRgb();
	rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * -(amount / 100))));
	rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * -(amount / 100))));
	rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * -(amount / 100))));
	return new TinyColor(rgb)
}
/**
 * Darken a color
 * @param  {TinyColor} color  The color to modify
 * @param  {Number}    amount The amount to brighten by <= 100
 * @return {TinyColor}        The modified color
 */
function darken(color, amount) {
	amount = (amount === 0) ? 0 : (amount || 10);
	const hsl = new TinyColor(color).toHsl();
	hsl.l -= amount / 100;
	hsl.l = clamp01(hsl.l);
	return new TinyColor(hsl)
}
/**
 * Spin takes a positive or negative amount within [-360, 360] indicating the
 * change of hue. Values outside of this range will be wrapped into this range.
 * @param  {TinyColor} color  The color to modify
 * @param  {Number}    amount Degrees to rotate hue by
 * @return {TinyColor}        The modified color
 */
function spin(color, amount) {
	const hsl = new TinyColor(color).toHsl();
	const hue = (hsl.h + amount) % 360;
	hsl.h = hue < 0 ? 360 + hue : hue;
	return new TinyColor(hsl)
}

class TinyColorExtension {
	constructor(api, id, options = {}) {
		this.api = api;
		this.id = id;
		this.options = options;
	}
	use(specified) {
		this.wanted = specified;
		return this
	}
	parse(input) {
		const result = this.api.findColor(input);
		return {
			as: format => Object.assign(result, {format}),
			rgba: {
				r: result.r,
				g: result.g,
				b: result.b,
				a: result.a,
			},
			valueOf: () => result,
		}
	}
	print(id, rgba) {
		return this.api.print(rgba, id)
	}
	complete(rgba) {
		const output = this.toString(rgba);
		delete this.wanted;
		return output
	}
}

const _template = {
	format: false,
	ok: false,
	r: 0,
	g: 0,
	b: 0,
	a: 1,
};
class TinyColorExtensionAPI {
	constructor() {
		this.colorspaces = {};
		this.options = {
			alphaFormat: 'rgb',
			shortHex: false,
			upperCaseHex: false,
		};
	}
	set(options) {
		Object.assign(this.options, options);
		for (const id in this.colorspaces) {
			if (Object.prototype.hasOwnProperty.call(this.colorspaces, id)) {
				Object.assign(this.colorspaces[id].options, options);
			}
		}
	}
	add(id, options) {
		this.colorspaces[id] = new TinyColorExtension(this, id, {...this.options, ...options});
		if (options.alias) {
			for (const id_ of options.alias) {
				this.colorspaces[id_] = this.colorspaces[id];
			}
		}
		return this.colorspaces[id]
	}
	findColor(input) {
		const color = {..._template};
		input = typeof input === 'string' ? input.trim().toLowerCase() : input;
		if (input) {
			for (const id in this.colorspaces) {
				if (this.colorspaces[id].shouldHandleInput(input)) {
					Object.assign(color, this.colorspaces[id].toRgb(input));
					color.format = color.format || id;
					color.ok = true;
					break
				}
			}
		}
		return color
	}
	raw(rgba, format) {
		if (format in this.colorspaces) {
			return this.colorspaces[format].toRaw(rgba)
		}
		return {r: rgba.r / 255, g: rgba.g / 255, b: rgba.b / 255, a: rgba.a}
	}
	print(rgba, original, format) {
		const specified = format;
		format = format || original;
		if (format in this.colorspaces) {
			return this.colorspaces[format].use(specified).complete(rgba)
		}
		return `[${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a * 255}]`
	}
}

let tinyCounter = 0;
const extensionApi = new TinyColorExtensionAPI();
class TinyColor {
	/**
	 * Create a new TinyColor instance
	 * @param  {string|array|object} color Notation describing a color
	 * @param  {object} options            Options object (see below)
	 * @return {TinyColor}                 An instance representing the color
	 */
	constructor(color, options = {}) {
		color = color || '';
		if (color instanceof TinyColor) {
			return color
		}
		const rgba = extensionApi.findColor(color);
		this._originalInput = color;
		this._r = roundIf01(rgba.r);
		this._g = roundIf01(rgba.g);
		this._b = roundIf01(rgba.b);
		this._a = rgba.a;
		this._roundA = roundAlpha(this._a);
		this._format = options.format || rgba.format;
		this._gradientType = options.gradientType;
		this._ok = rgba.ok;
		this._tc_id = TinyColor.newId();
		extensionApi.set(options);
	}
	/**
	 * Create a new ID
	 *
	 * @return     {number}  Incremented ID counter
	 */
	static newId() {
		return tinyCounter++
	}
	/**
	 * Register a TinyColor extension
	 * @param   {string}  id                   The plugin identifier
	 * @param   {object}  [options={}]         Plugin options
	 * @param   {string}  options.alphaFormat  rgb|hex
	 * @param   {boolean} options.shortHex     Short hex codes #ABC, if possible
	 * @param   {boolean} options.upperCaseHex User UPPER case hex
	 * @return  {TinyColorExtension}           The TinyColor extension
	 */
	static registerFormat(id, options = {}) {
		return extensionApi.add(id, options)
	}
	/**
	 * Are two TinyColor colours equivalent?
	 *
	 * @param      {TinyColor}  color1  The first color
	 * @param      {TinyColor}  color2  The second color
	 * @return     {boolean}  Equivalent or not?
	 */
	static equals(color1, color2) {
		if (!color1 || !color2) {
			return false
		}
		return new TinyColor(color1).toRgbString() === new TinyColor(color2).toRgbString()
	}
	/**
	 * Create a new TinyColor from values from 0..1
	 *
	 * @param      {object}     color    The color
	 * @param      {object}     options  The options
	 * @return     {TinyColor}  The tiny color.
	 */
	static fromRatio(color, options) {
		if (typeof color === 'object') {
			const newColor = {};
			for (const i in color) {
				if (Object.prototype.hasOwnProperty.call(color, i)) {
					if (i === 'a') {
						newColor[i] = color[i];
					} else {
						newColor[i] = convertToPercentage(color[i]);
					}
				}
			}
			color = newColor;
		}
		return new TinyColor(color, options)
	}
	/**
	 * Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
	 *
	 * @param      {TinyColor}  color1  The first color
	 * @param      {TinyColor}  color2  The second color
	 * @return     {number}             The color contrast defined by (WCAG Version 2)
	 */
	static readability(color1, color2) {
		return readability(color1, color2)
	}
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
	static isReadable(color1, color2, wcag2) {
		return isReadable(color1, color2, wcag2)
	}
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
	static mostReadable(baseColor, colorList, args) {
		return mostReadable(baseColor, colorList, args)
	}
	/**
	 * Mix a second colour into the first
	 *
	 * @param  {TinyColor}  color1  The first color
	 * @param  {TinyColor}  color2  The second color
	 * @param  {number}     amount  The mix amount of the second color
	 * @return {TinyColor}			   A new, mixed TinyColor instance
	 */
	static mix(color1, color2, amount) {
		return calcMix(color1, color2, amount)
	}
	/**
	 * Determines if dark.
	 *
	 * @return     {boolean}  True if dark, False otherwise.
	 */
	isDark() {
		return this.getBrightness() < 128
	}
	/**
	 * Determines if light.
	 *
	 * @return     {boolean}  True if light, False otherwise.
	 */
	isLight() {
		return !this.isDark()
	}
	/**
	 * Determines if valid.
	 *
	 * @return     {boolean}  True if valid, False otherwise.
	 */
	isValid() {
		return this._ok
	}
	/**
	 * Gets the original input.
	 *
	 * @return     {string|object}  The original input.
	 */
	getOriginalInput() {
		return this._originalInput
	}
	/**
	 * Gets the format.
	 *
	 * @return     {string}  The format.
	 */
	getFormat() {
		return this._format
	}
	/**
	 * Gets the alpha.
	 *
	 * @return     {number}  The alpha.
	 */
	getAlpha() {
		return this._a
	}
	/**
	 * Gets the brightness.
	 *
	 * @return     {number}  The brightness.
	 */
	getBrightness() {
		return calcBrightness(this.toRgb())
	}
	/**
	 * Gets the luminance.
	 *
	 * @return     {number}  The luminance.
	 */
	getLuminance() {
		return calcLuminance(rawToDeepRgba(this))
	}
	/**
	 * Return the current color as a string.
	 *
	 * @param      {string}  format  The color format
	 * @return     {string}  The current color, as a string.
	 */
	toString(format) {
		return extensionApi.print(rawToRgba(this), this._format, format)
	}
	/**
	 * Returns a name representation of the object.
	 *
	 * @return     {string}  The name of the colour.
	 */
	toName() {
		return extensionApi.print(rawToRgba(this), 'name', 'toName')
	}
	/**
	 * Returns a rgb representation of the object.
	 *
	 * @return     {object}  Rgb representation of the object.
	 */
	toRgb() {
		return rawToDeepRgba(this)
	}
	/**
	 * Returns a rgb string representation of the object.
	 *
	 * @return     {string}  Rgb string representation of the object.
	 */
	toRgbString() {
		return rgbaToString(rawToRgba(this))
	}
	/**
	 * Returns a rgb array representation of the object.
	 *
	 * @return     {[number]}  Rgb array representation of the object.
	 */
	toRgbArray() {
		return rgbaToArray(rawToRgba(this))
	}
	/**
	 * Returns a percentage rgb representation of the object.
	 *
	 * @return     {object}  Percentage rgb representation of the object.
	 */
	toPercentageRgb() {
		return rgbaToPercentageRgba(rawToDeepRgba(this))
	}
	/**
	 * Returns a percentage rgb string representation of the object.
	 *
	 * @return     {string}  Percentage rgb string representation of the object.
	 */
	toPercentageRgbString() {
		return rgbaToString(rgbaToPercentageRgba(rawToRgba(this)))
	}
	/**
	 * Return the hex string of a color, as pure hexadecimal.
	 *
	 * @param      {boolean}  allow3Char  Allow 3 digit RGB strings
	 * @return     {string}  The Hex string of the color.
	 */
	toHex(allow3Char) {
		return rgbToHex(rawToRgba(this), allow3Char)
	}
	/**
	 * Return the hex string of a color, with a leading #
	 *
	 * @param      {boolean}  allow3Char  Allow 3 digit RGB strings
	 * @return     {string}  The Hex string of the color.
	 */
	toHexString(allow3Char) {
		return `#${this.toHex(allow3Char)}`
	}
	/**
	 * Return the hex string of a color with aplha, as pure hexadecimal.
	 *
	 * @param      {boolean}  allow4Char  Allow 4 digit RGBA strings
	 * @return     {string}  The Hex string of the color.
	 */
	toHex8(allow4Char) {
		return rgbaToHex(rawToRgba(this), allow4Char)
	}
	/**
	 * Return the hex string of a color with aplha, with a leading #
	 *
	 * @param      {boolean}  allow3Char  Allow 4 digit RGBA strings
	 * @return     {string}  The Hex string of the color.
	 */
	toHex8String(allow4Char) {
		return `#${this.toHex8(allow4Char)}`
	}
	/**
	 * Returns a HSV object representation of the object.
	 *
	 * @return     {object}  HSV(A) representation of the color.
	 */
	toHsv() {
		return extensionApi.raw(rawToDeepRgba(this), 'hsv')
	}
	/**
	 * Returns a HSV string representation of the object.
	 *
	 * @return     {string}  hsv(h, s, v[, a]) representation of the color.
	 */
	toHsvString() {
		return extensionApi.print(rawToDeepRgba(this), this._format, 'hsv')
	}
	/**
	 * Returns a HSL object representation of the object.
	 *
	 * @return     {object}  HSL(A) representation of the color.
	 */
	toHsl() {
		return extensionApi.raw(rawToDeepRgba(this), 'hsl')
	}
	/**
	 * Returns a HSL string representation of the object.
	 *
	 * @return     {string}  hsl(h, s, l[, a]) representation of the color.
	 */
	toHslString() {
		return extensionApi.print(rawToDeepRgba(this), this._format, 'hsl')
	}
	/**
	 * Sets the alpha.
	 *
	 * @param      {number}  value   The alpha value (0 - 1.0)
	 * @return     {TinyColor}  The current colour with the set alpha.
	 */
	setAlpha(value) {
		this._a = boundAlpha(value);
		this._roundA = mathRound(100 * this._a) / 100;
		return this
	}
	/**
	 * Creates a new instance of the object with same properties than original.
	 *
	 * @return     {TinyColor}  Copy of this object.
	 */
	clone() {
		return new TinyColor(this.toString())
	}
	lighten(...args) {
		return modify('lighten', [this, ...args])
	}
	brighten(...args) {
		return modify('brighten', [this, ...args])
	}
	darken(...args) {
		return modify('darken', [this, ...args])
	}
	desaturate(...args) {
		return modify('desaturate', [this, ...args])
	}
	saturate(...args) {
		return modify('saturate', [this, ...args])
	}
	greyscale(...args) {
		return modify('greyscale', [this, ...args])
	}
	invert(...args) {
		return modify('invert', [this, ...args])
	}
	spin(...args) {
		return modify('spin', [this, ...args])
	}
	analogous(...args) {
		return combine('analogous', [this, ...args])
	}
	complement(...args) {
		return combine('complement', [this, ...args])
	}
	monochromatic(...args) {
		return combine('monochromatic', [this, ...args])
	}
	splitcomplement(...args) {
		return combine('splitcomplement', [this, ...args])
	}
	triad(...args) {
		return combine('triad', [this, ...args])
	}
	tetrad(...args) {
		return combine('tetrad', [this, ...args])
	}
}

const matchers$4 = (function () {
	return {
		rgb: new RegExp(`rgb${PERMISSIVE_MATCH3}`),
		rgba: new RegExp(`rgba${PERMISSIVE_MATCH4}`),
	}
})();
/**
 * Permissive string parsing.  Take in a number of formats, and output an object
 * based on detected format.
 *
 * Try to match string input using regular expressions. Keep most of the number
 * bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
 * Just return an object and let the conversion functions handle that.
 * This way the result will be the same whether the tinycolor is initialized
 * with string or object.
 *
 * @param      {string}  color   The color
 * @return     {object}  Returns `{ r, g, b }` or `{ r, g, b, a }`
 */
function rgbStringToObject(color) {
	let r, g, b, a, match;
	if ((match = matchers$4.rgb.exec(color))) {
		[r, g, b] = match.splice(1, 3);
		return {r, g, b}
	}
	if ((match = matchers$4.rgba.exec(color))) {
		[r, g, b, a] = match.splice(1, 4);
		return {r, g, b, a}
	}
	return false
}

const api$6 = TinyColor.registerFormat('rgb');
api$6.shouldHandleInput = input =>
	(typeof input === 'object' && isValidCSSUnitRGB(input) && !isPercentage(input.r))
	|| rgbStringToObject(input);
api$6.toRgb = input =>
	(typeof input === 'object' && conformRgba(input))
	|| conformRgba(rgbStringToObject(input));
api$6.toRaw = rgba => rgba;
api$6.toString = rgba => rgbaToString(rgba);

const api$5 = TinyColor.registerFormat('prgb');
api$5.shouldHandleInput = input => {
	if (typeof input === 'string') {
		const rgbCheck = rgbStringToObject(input);
		return rgbCheck && isPercentage(rgbCheck.r)
	}
	return isValidCSSUnitRGB(input) && isPercentage(input.r)
};
api$5.toRgb = input => typeof input === 'object' ? conformRgba(input) : conformRgba(rgbStringToObject(input));
api$5.toRaw = rgba => rgbaToPercentageRgba(rgba);
api$5.toString = rgba => rgbaToString(rgbaToPercentageRgba(rgba));

const api$4 = TinyColor.registerFormat('hex', {
	alias: ['hex3', 'hex6'],
});
const matchers$3 = (function () {
	return {
		hex3: /^#?([\da-fA-F])([\da-fA-F])([\da-fA-F])$/,
		hex6: /^#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/,
	}
})();
function hexToRgba$1(color) {
	let match;
	if ((match = matchers$3.hex3.exec(color))) {
		const [r, g, b] = match.splice(1, 3).map(h => `${h}${h}`).map(value => convertHexToInt(value));
		return {r, g, b, a: 1}
	}
	if ((match = matchers$3.hex6.exec(color))) {
		const [r, g, b] = match.splice(1, 3).map(value => convertHexToInt(value));
		return {r, g, b, a: 1}
	}
	return false
}
const hexToString$1 = (rgba, short = api$4.options.shortHex) => `#${api$4.options.upperCaseHex
	? rgbToHex(rgba, short).toUpperCase()
	: rgbToHex(rgba, short)}`;
api$4.shouldHandleInput = input => matchers$3.hex6.test(input) || matchers$3.hex3.test(input);
api$4.toRgb = input => hexToRgba$1(input);
api$4.toRaw = rgba => rgba;
api$4.toString = rgba => {
	if (/^hex6?$/.test(api$4.wanted)) {
		return hexToString$1(rgba)
	}
	if (api$4.wanted === 'hex3') {
		return hexToString$1(rgba, true)
	}
	if (hasAlpha(rgba)) {
		return api$4.options.alphaFormat === 'hex'
			? hexToString$1(rgba) : api$4.print(api$4.options.alphaFormat, rgba)
	}
	return hexToString$1(rgba)
};

const api$3 = TinyColor.registerFormat('hex8', {
	alias: ['hex4'],
});
const matchers$2 = (function () {
	return {
		hex4: /^#?([\da-fA-F])([\da-fA-F])([\da-fA-F])([\da-fA-F])$/,
		hex8: /^#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/,
	}
})();
function hexToRgba(color) {
	let match;
	if ((match = matchers$2.hex4.exec(color))) {
		const a = convertHexToDecimal(`${match[4]}${match[4]}`);
		const [r, g, b] = match.splice(1, 3).map(h => `${h}${h}`).map(value => convertHexToInt(value));
		return {r, g, b, a}
	}
	if ((match = matchers$2.hex8.exec(color))) {
		const a = convertHexToDecimal(match[4]);
		const [r, g, b] = match.splice(1, 3).map(value => convertHexToInt(value));
		return {r, g, b, a}
	}
	return false
}
const hexToString = (rgba, short = api$3.options.shortHex) => `#${api$3.options.upperCaseHex
	? rgbaToHex(rgba, short).toUpperCase()
	: rgbaToHex(rgba, short)}`;
api$3.shouldHandleInput = input => matchers$2.hex8.test(input) || matchers$2.hex4.test(input);
api$3.toRgb = input => hexToRgba(input);
api$3.toRaw = rgba => rgba;
api$3.toString = rgba => {
	if (api$3.wanted === 'hex4') {
		return hexToString(rgba, true)
	}
	if (api$3.wanted === 'hex8') {
		return hexToString(rgba)
	}
	if (hasAlpha(rgba)) {
		return api$3.options.alphaFormat === 'hex'
			? hexToString(rgba) : api$3.print(api$3.options.alphaFormat, rgba)
	}
	return hexToString(rgba)
};

const api$2 = TinyColor.registerFormat('hsl');
const matchers$1 = (function () {
	return {
		hsl: new RegExp(`hsl${PERMISSIVE_MATCH3}`),
		hsla: new RegExp(`hsla${PERMISSIVE_MATCH4}`),
	}
})();
const isValidCSSUnitHSL = hsl => isValidCSSUnit(hsl.h) && isValidCSSUnit(hsl.s) && isValidCSSUnit(hsl.l);
function rgbaToHsla(rgba) {
	const r = bound01(rgba.r, 255);
	const g = bound01(rgba.g, 255);
	const b = bound01(rgba.b, 255);
	const a = rgba.a || 1;
	const max = mathMax(r, g, b);
	const min = mathMin(r, g, b);
	let h, s;
	const l = (max + min) / 2;
	if (max === min) {
		h = 0;
		s = 0;
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = ((g - b) / d) + (g < b ? 6 : 0);
				break
			case g:
				h = ((b - r) / d) + 2;
				break
			default:
				h = ((r - g) / d) + 4;
				break
		}
		h /= 6;
	}
	return {h, s, l, a}
}
function hslaToRgba(hsla) {
	const h = bound01(hsla.h, 360);
	const s = bound01(convertToPercentage(hsla.s), 100);
	const l = bound01(convertToPercentage(hsla.l), 100);
	const a = hsla.a || 1;
	let r, g, b;
	function hue2rgb(p, q, t) {
		t = (t < 0) ? t + 1 : t;
		t = (t > 1) ? t - 1 : t;
		if (t < 1 / 6) {
			return p + ((q - p) * 6 * t)
		}
		if (t < 1 / 2) {
			return q
		}
		if (t < 2 / 3) {
			return p + ((q - p) * ((2 / 3) - t) * 6)
		}
		return p
	}
	if (s === 0) {
		r = l;
		g = l;
		b = l;
	} else {
		const q = l < 0.5 ? l * (1 + s) : l + s - (l * s);
		const p = (2 * l) - q;
		r = hue2rgb(p, q, h + (1 / 3));
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - (1 / 3));
	}
	return {r: r * 255, g: g * 255, b: b * 255, a}
}
function hslStringToObject(color) {
	let h, s, l, a, match;
	if ((match = matchers$1.hsl.exec(color))) {
		[h, s, l] = match.splice(1, 3);
		return {h, s, l}
	}
	if ((match = matchers$1.hsla.exec(color))) {
		[h, s, l, a] = match.splice(1, 4);
		return {h, s, l, a}
	}
	return false
}
function hslaToString(hsla) {
	let {h, s, l, a} = hsla;
	h = mathRound(h * 360);
	s = mathRound(s * 100);
	l = mathRound(l * 100);
	return (a === 1)
		? `hsl(${h}, ${s}%, ${l}%)`
		: `hsla(${h}, ${s}%, ${l}%, ${a})`
}
function hslaToRaw(hsla) {
	let {h, s, l, a} = hsla;
	h *= 360;
	return {h, s, l, a}
}
api$2.shouldHandleInput = input => (typeof input === 'object' && isValidCSSUnitHSL(input)) || hslStringToObject(input);
api$2.toRgb = input => (typeof input === 'object' && hslaToRgba(input)) || hslaToRgba(hslStringToObject(input));
api$2.toRaw = rgba => hslaToRaw(rgbaToHsla(rgba));
api$2.toString = rgba => hslaToString(rgbaToHsla(rgba));

const api$1 = TinyColor.registerFormat('hsv');
const matchers = (function () {
	return {
		hsv: new RegExp(`hsv${PERMISSIVE_MATCH3}`),
		hsva: new RegExp(`hsva${PERMISSIVE_MATCH4}`),
	}
})();
const isValidCSSUnitHSV = hsv => isValidCSSUnit(hsv.h) && isValidCSSUnit(hsv.s) && isValidCSSUnit(hsv.v);
function rgbaToHsva(rgba) {
	const r = bound01(rgba.r, 255);
	const g = bound01(rgba.g, 255);
	const b = bound01(rgba.b, 255);
	const a = rgba.a || 1;
	const max = mathMax(r, g, b);
	const min = mathMin(r, g, b);
	const d = max - min;
	let h;
	const s = max === 0 ? 0 : d / max;
	const v = max;
	if (max === min) {
		h = 0;
	} else {
		switch (max) {
			case r:
				h = ((g - b) / d) + (g < b ? 6 : 0);
				break
			case g:
				h = ((b - r) / d) + 2;
				break
			default:
				h = ((r - g) / d) + 4;
				break
		}
		h /= 6;
	}
	return {h, s, v, a}
}
function hsvaToRgba(hsva) {
	const h = bound01(hsva.h, 360) * 6;
	const s = bound01(convertToPercentage(hsva.s), 100);
	const v = bound01(convertToPercentage(hsva.v), 100);
	const a = hsva.a || 1;
	const i = Math.floor(h);
	const f = h - i;
	const p = v * (1 - s);
	const q = v * (1 - (f * s));
	const t = v * (1 - ((1 - f) * s));
	const mod = i % 6;
	const r = [v, q, p, p, t, v][mod];
	const g = [t, v, v, q, p, p][mod];
	const b = [p, p, t, v, v, q][mod];
	return {r: r * 255, g: g * 255, b: b * 255, a}
}
function hsvStringToObject(color) {
	let h, s, v, a, match;
	if ((match = matchers.hsv.exec(color))) {
		[h, s, v] = match.splice(1, 3);
		return {h, s, v}
	}
	if ((match = matchers.hsva.exec(color))) {
		[h, s, v, a] = match.splice(1, 4);
		return {h, s, v, a}
	}
	return false
}
function hsvaToString(hsva) {
	let {h, s, v, a} = hsva;
	h = mathRound(h * 360);
	s = mathRound(s * 100);
	v = mathRound(v * 100);
	return (a === 1)
		? `hsv(${h}, ${s}%, ${v}%)`
		: `hsva(${h}, ${s}%, ${v}%, ${a})`
}
function hsvaToRaw(hsla) {
	let {h, s, v, a} = hsla;
	h *= 360;
	return {h, s, v, a}
}
api$1.shouldHandleInput = input => (typeof input === 'object' && isValidCSSUnitHSV(input)) || hsvStringToObject(input);
api$1.toRgb = input => (typeof input === 'object' && hsvaToRgba(input)) || hsvaToRgba(hsvStringToObject(input));
api$1.toRaw = rgba => hsvaToRaw(rgbaToHsva(rgba));
api$1.toString = rgba => hsvaToString(rgbaToHsva(rgba));

const api = TinyColor.registerFormat('name', {
	alias: ['toName'],
});
function flip(o) {
	const flipped = {};
	for (const i in o) {
		if (Object.prototype.hasOwnProperty.call(o, i)) {
			flipped[o[i]] = i;
		}
	}
	return flipped
}
const names = {
	aliceblue: 'f0f8ff',
	antiquewhite: 'faebd7',
	aqua: '0ff',
	aquamarine: '7fffd4',
	azure: 'f0ffff',
	beige: 'f5f5dc',
	bisque: 'ffe4c4',
	black: '000',
	blanchedalmond: 'ffebcd',
	blue: '00f',
	blueviolet: '8a2be2',
	brown: 'a52a2a',
	burlywood: 'deb887',
	burntsienna: 'ea7e5d',
	cadetblue: '5f9ea0',
	chartreuse: '7fff00',
	chocolate: 'd2691e',
	coral: 'ff7f50',
	cornflowerblue: '6495ed',
	cornsilk: 'fff8dc',
	crimson: 'dc143c',
	cyan: '0ff',
	darkblue: '00008b',
	darkcyan: '008b8b',
	darkgoldenrod: 'b8860b',
	darkgray: 'a9a9a9',
	darkgreen: '006400',
	darkgrey: 'a9a9a9',
	darkkhaki: 'bdb76b',
	darkmagenta: '8b008b',
	darkolivegreen: '556b2f',
	darkorange: 'ff8c00',
	darkorchid: '9932cc',
	darkred: '8b0000',
	darksalmon: 'e9967a',
	darkseagreen: '8fbc8f',
	darkslateblue: '483d8b',
	darkslategray: '2f4f4f',
	darkslategrey: '2f4f4f',
	darkturquoise: '00ced1',
	darkviolet: '9400d3',
	deeppink: 'ff1493',
	deepskyblue: '00bfff',
	dimgray: '696969',
	dimgrey: '696969',
	dodgerblue: '1e90ff',
	firebrick: 'b22222',
	floralwhite: 'fffaf0',
	forestgreen: '228b22',
	fuchsia: 'f0f',
	gainsboro: 'dcdcdc',
	ghostwhite: 'f8f8ff',
	gold: 'ffd700',
	goldenrod: 'daa520',
	gray: '808080',
	green: '008000',
	greenyellow: 'adff2f',
	grey: '808080',
	honeydew: 'f0fff0',
	hotpink: 'ff69b4',
	indianred: 'cd5c5c',
	indigo: '4b0082',
	ivory: 'fffff0',
	khaki: 'f0e68c',
	lavender: 'e6e6fa',
	lavenderblush: 'fff0f5',
	lawngreen: '7cfc00',
	lemonchiffon: 'fffacd',
	lightblue: 'add8e6',
	lightcoral: 'f08080',
	lightcyan: 'e0ffff',
	lightgoldenrodyellow: 'fafad2',
	lightgray: 'd3d3d3',
	lightgreen: '90ee90',
	lightgrey: 'd3d3d3',
	lightpink: 'ffb6c1',
	lightsalmon: 'ffa07a',
	lightseagreen: '20b2aa',
	lightskyblue: '87cefa',
	lightslategray: '789',
	lightslategrey: '789',
	lightsteelblue: 'b0c4de',
	lightyellow: 'ffffe0',
	lime: '0f0',
	limegreen: '32cd32',
	linen: 'faf0e6',
	magenta: 'f0f',
	maroon: '800000',
	mediumaquamarine: '66cdaa',
	mediumblue: '0000cd',
	mediumorchid: 'ba55d3',
	mediumpurple: '9370db',
	mediumseagreen: '3cb371',
	mediumslateblue: '7b68ee',
	mediumspringgreen: '00fa9a',
	mediumturquoise: '48d1cc',
	mediumvioletred: 'c71585',
	midnightblue: '191970',
	mintcream: 'f5fffa',
	mistyrose: 'ffe4e1',
	moccasin: 'ffe4b5',
	navajowhite: 'ffdead',
	navy: '000080',
	oldlace: 'fdf5e6',
	olive: '808000',
	olivedrab: '6b8e23',
	orange: 'ffa500',
	orangered: 'ff4500',
	orchid: 'da70d6',
	palegoldenrod: 'eee8aa',
	palegreen: '98fb98',
	paleturquoise: 'afeeee',
	palevioletred: 'db7093',
	papayawhip: 'ffefd5',
	peachpuff: 'ffdab9',
	peru: 'cd853f',
	pink: 'ffc0cb',
	plum: 'dda0dd',
	powderblue: 'b0e0e6',
	purple: '800080',
	rebeccapurple: '639',
	red: 'f00',
	rosybrown: 'bc8f8f',
	royalblue: '4169e1',
	saddlebrown: '8b4513',
	salmon: 'fa8072',
	sandybrown: 'f4a460',
	seagreen: '2e8b57',
	seashell: 'fff5ee',
	sienna: 'a0522d',
	silver: 'c0c0c0',
	skyblue: '87ceeb',
	slateblue: '6a5acd',
	slategray: '708090',
	slategrey: '708090',
	snow: 'fffafa',
	springgreen: '00ff7f',
	steelblue: '4682b4',
	tan: 'd2b48c',
	teal: '008080',
	thistle: 'd8bfd8',
	tomato: 'ff6347',
	turquoise: '40e0d0',
	violet: 'ee82ee',
	wheat: 'f5deb3',
	white: 'fff',
	whitesmoke: 'f5f5f5',
	yellow: 'ff0',
	yellowgreen: '9acd32',
};
names.transparent = '00000000';
const hexNames = flip(names);
api.shouldHandleInput = input => names[input];
api.toRgb = input => api.parse(names[input]).rgba;
api.toRaw = rgba => rgba;
api.toString = rgba => {
	if (rgba.a === 0) {
		return 'transparent'
	}
	if (hasAlpha(rgba) && api.wanted === 'toName') {
		return false
	}
	if (hasAlpha(rgba) && api.wanted === 'name') {
		return `#${rgbToHex(rgba)}`
	}
	if (hasAlpha(rgba)) {
		return api.print(api.options.alphaFormat, rgba)
	}
	return hexNames[rgbToHex(rgba, true)] || false
};

function tinycolor(color, options) {
	return new TinyColor(color, options)
}
/**
 * Are two TinyColor colours equivalent?
 *
 * @alias  tinycolor.equals
 * @param  {TinyColor}  color1  The first color
 * @param  {TinyColor}  color2  The second color
 * @return {boolean}    Equivalent or not?
 */
tinycolor.equals = (color1, color2) => TinyColor.equals(color1, color2);
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
tinycolor.registerFormat = (id, options = {}) => TinyColor.registerFormat(id, options);
/**
 * Create a new TinyColor from values from 0..1
 *
 * @alias  tinycolor.fromRatio
 * @param  {object}    color    The color values
 * @param  {object}    options  Options to pass to TinyColor constructor
 * @return {TinyColor}          A TinyColor instance
 */
tinycolor.fromRatio = (color, options) => TinyColor.fromRatio(color, options);
/**
 * Mix a second colour into the first
 *
 * @alias  tinycolor.mix
 * @param  {TinyColor}  color1  The first color
 * @param  {TinyColor}  color2  The second color
 * @param  {number}     amount  The mix amount of the second color
 * @return {TinyColor}			   A new, mixed TinyColor instance
 */
tinycolor.mix = (color1, color2, amount) => TinyColor.mix(color1, color2, amount);
/**
 * How readable is the first color over the second color
 *
 * @alias  tinycolor.readability
 * @param  {TinyColor}  color1  The first color
 * @param  {TinyColor}  color2  The second color
 * @return {number}             The color contrast defined by (WCAG Version 2)
 */
tinycolor.readability = (color1, color2) => TinyColor.readability(color1, color2);
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
tinycolor.isReadable = (color1, color2, wcag2) => TinyColor.isReadable(color1, color2, wcag2);
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
tinycolor.mostReadable = (baseColor, colorList, args) => TinyColor.mostReadable(baseColor, colorList, args);
/**
 * Named Colours (as per CSS color names)
 */
tinycolor.names = names;

export { TinyColor, names, tinycolor };
