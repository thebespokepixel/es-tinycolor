/*
 *  ES-TinyColor : Utilities
 *  ────────────────────────────────────────────────────────────────────────────
 */
const mathRound = Math.round;
const mathMin = Math.min;
const mathMax = Math.max;

// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
const isOnePointZero = n => typeof n === 'string' && n.includes('.') && Number.parseFloat(n) === 1;

// Check to see if string passed in is a percentage
const isPercentage = n => typeof n === 'string' && n.includes('%');

// Don't let the range of [0,255] come back in [0,1].
// Potentially lose a little bit of precision here, but will fix issues where
// .5 gets interpreted as half of the total, instead of half of 1
// If it was supposed to be 128, this was already taken care of by `inputToRgb`
const roundIf01 = n => n < 1 ? mathRound(n) : n;

const roundAlpha = a => mathRound(100 * a) / 100;

const boundAlpha = a => {
	a = Number.parseFloat(a);
	return (Number.isNaN(a) || a < 0 || a > 1) ? 1 : a
};

const hasAlpha = rgba => rgba.a < 1 && rgba.a >= 0;

// Force a number between 0 and 1
const clamp01 = value => mathMin(1, mathMax(0, value));

// Force a hex value to have 2 characters
const pad2 = c => c.length === 1 ? `0${c}` : `${c}`;

// <http://www.w3.org/TR/css3-values/#integers>
const CSS_INTEGER = '[-\\+]?\\d+%?';

// <http://www.w3.org/TR/css3-values/#number-value>
const CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?';

// Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
const CSS_UNIT = `(?:${CSS_NUMBER})|(?:${CSS_INTEGER})`;

// `isValidCSSUnit`
// Take in a single string / number and check to see if it looks like a CSS unit
const isValidCSSUnit = color => new RegExp(CSS_UNIT).test(color);

// `isValidCSSUnitRGB`
// Take in a rgb object check to see if it looks like a CSS unit
const isValidCSSUnitRGB = rgb => isValidCSSUnit(rgb.r) && isValidCSSUnit(rgb.g) && isValidCSSUnit(rgb.b);

// Actual matching.
// Parentheses and commas are optional, but not required.
// Whitespace can take the place of commas or opening paren
const PERMISSIVE_MATCH3 = `[\\s|\\(]+(${CSS_UNIT})[,|\\s]+(${CSS_UNIT})[,|\\s]+(${CSS_UNIT})\\s*\\)?`;
const PERMISSIVE_MATCH4 = `[\\s|\\(]+(${CSS_UNIT})[,|\\s]+(${CSS_UNIT})[,|\\s]+(${CSS_UNIT})[,|\\s]+(${CSS_UNIT})\\s*\\)?`;

// Take input from [0, n] and return it as [0, 1]
function bound01(n, max) {
	if (isOnePointZero(n)) {
		n = '100%';
	}

	const processPercent = isPercentage(n);
	n = mathMin(max, mathMax(0, Number.parseFloat(n)));

	// Automatically convert percentage into number
	if (processPercent) {
		n = Number.parseInt(n * max, 10) / 100;
	}

	// Handle floating point rounding errors
	if ((Math.abs(n - max) < 0.000_001)) {
		return 1
	}

	// Convert into [0, 1] range if it isn't already
	return (n % max) / Number.parseFloat(max)
}

/*
 *  ES-TinyColor : Conversion Functions
 *  ────────────────────────────────────────────────────────────────────────────
 */

/**
 * Converts a base-16 hex value into a base-10 integer
 * @param  {String} val Hexadecimal input value
 * @return {Number}     Integer value
 */
const convertHexToInt = value => Number.parseInt(value, 16);

/**
 * Converts a hex value to a decimal
 * @param  {String} h Hexadecimal input value
 * @return {Number}   Decimal value
 */
const convertHexToDecimal = h => convertHexToInt(h) / 255;

/**
 * Replace a decimal with it's percentage value
 * @param  {Number} n Decimal input value
 * @return {String}   Percentage string
 */
const convertToPercentage = n => n <= 1 ? `${n * 100}%` : n;

/**
 * Handle conversion of internal precise values to exportable values. Should be
 * able to accept a tinycolour instance 'this' value.
 * @param  {Object} raw { _r, _g, _b, _a } with _r, _g, _b in [0.0, 255.0] and _a in [0, 1]
 * @return {Object}     { r, g, b } in [0, 255]
 */
const rawToRgba = raw => {
	const [r, g, b] = [raw._r, raw._g, raw._b].map(value => mathRound(value));
	return {r, g, b, a: raw._roundA}
};

/**
 * Handle conversion of internal precise values to exportable values,
 * maintaining deep precision. Should be able to accept a tinycolour instance
 * 'this' value.
 * @param  {Object} raw { _r, _g, _b, _a } with _r, _g, _b in [0.0, 255.0] and _a in [0, 1]
 * @return {Object}     { r, g, b, a } in [0.0, 255.0]
 */
const rawToDeepRgba = raw => ({r: raw._r, g: raw._g, b: raw._b, a: raw._a});

/**
 * Handle bounds / percentage checking to conform to CSS color spec
 * @link{http://www.w3.org/TR/css3-color/|www.w3.org/TR/css3-color}
 * @param  {Object} rgba { r, g, b, a } in [0, 255] or [0, 1]
 * @return {Object}      { r, g, b } in [0, 255]
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

// `rgbaToHex`
// Converts an RGBA color plus alpha transparency to hex
// Assumes r, g, b are contained in the set [0, 255] and
// a in [0, 1]. Returns a 3, 4, 6 or 8 character rgba hex
const rgbaToHex = (rgba, allowShort) => {
	const hex = rgbaToArray(rgba).map(n => n.toString(16)).map(value => pad2(value));
	return allowShort && hex.every(h => h.charAt(0) === h.charAt(1)) ? hex.map(h => h.charAt(0)).join('') : hex.join('')
};

// `rgbToHex`
const rgbToHex = (rgba, allowShort) => rgbaToHex({...rgba, a: 1}, allowShort);

/*
 *  ES-TinyColor : Caluculation Functions
 *  ────────────────────────────────────────────────────────────────────────────
 */

// http://www.w3.org/TR/AERT#color-contrast
const calcBrightness = rgb => ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;

function calcLuminance(rgb, deepRgb) {
	// http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef

	const RsRGB = deepRgb.r / 255;
	const GsRGB = deepRgb.g / 255;
	const BsRGB = deepRgb.b / 255;

	const R = RsRGB <= 0.039_28 ? RsRGB / 12.92 : ((RsRGB + 0.055) / 1.055) ** 2.4;

	const G = GsRGB <= 0.039_28 ? GsRGB / 12.92 : ((GsRGB + 0.055) / 1.055) ** 2.4;

	const B = BsRGB <= 0.039_28 ? BsRGB / 12.92 : ((BsRGB + 0.055) / 1.055) ** 2.4;

	return (0.2126 * R) + (0.7152 * G) + (0.0722 * B)
}

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

/*
 *  ES-TinyColor : Readability Functions
 *  ────────────────────────────────────────────────────────────────────────────
 *  <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)
 */

// `validateWCAG2Parms`
// Return valid WCAG2 parms for isReadable.
// If input parms are invalid, return {"level":"AA", "size":"small"}
/* eslint unicorn/explicit-length-check: 0 */
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

// `readability`
// Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
function readability(color1, color2) {
	const c1 = new TinyColor(color1);
	const c2 = new TinyColor(color2);
	return (Math.max(c1.getLuminance(), c2.getLuminance()) + 0.05) / (Math.min(c1.getLuminance(), c2.getLuminance()) + 0.05)
}

// `isReadable`
// Ensure that foreground and background color combinations meet WCAG2 guidelines.
// The third argument is an optional Object.
//     the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
//     the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
// If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.
//
// *Example*
//     tinycolor.isReadable("#000", "#111") => false
//     tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false
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

// `mostReadable`
// Given a base color and a list of possible foreground or background
// colors for that base, returns the most readable color.
// Optionally returns Black or White if the most readable color is unreadable.
//
// *Example*
//     tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
//     tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
//     tinycolor.mostReadable("#a8015a", ["#faf3f3"], {includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
//     tinycolor.mostReadable("#a8015a", ["#faf3f3"], {includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
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

/*
 *  ES-TinyColor : Combination Functions
 *  ────────────────────────────────────────────────────────────────────────────
 *  Thanks to jQuery xColor for some of the ideas behind these
 *  <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>
 */

function combine(action, args) {
	const actions = {monochromatic, analogous, complement, splitcomplement, triad, tetrad};
	return actions[action](...args)
}

function complement(color) {
	const hsl = new TinyColor(color).toHsl();
	hsl.h = (hsl.h + 180) % 360;
	return new TinyColor(hsl)
}

function triad(color) {
	const hsl = new TinyColor(color).toHsl();
	const {h} = hsl;
	return [
		new TinyColor(color),
		new TinyColor({h: (h + 120) % 360, s: hsl.s, l: hsl.l}),
		new TinyColor({h: (h + 240) % 360, s: hsl.s, l: hsl.l}),
	]
}

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

function splitcomplement(color) {
	const hsl = new TinyColor(color).toHsl();
	const {h} = hsl;
	return [
		new TinyColor(color),
		new TinyColor({h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
		new TinyColor({h: (h + 216) % 360, s: hsl.s, l: hsl.l}),
	]
}

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

/*
 *  ES-TinyColor : Modification Functions
 *  ────────────────────────────────────────────────────────────────────────────
 *  Thanks to less.js for some of the basics here
 *  <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>
 */

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

/*
 *  ES-TinyColor : Color Extension Class
 * ────────────────────────────────────────────────────────────────────────────
 */

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

/*
 *  ES-TinyColor : Color Extension API Class
 *  ────────────────────────────────────────────────────────────────────────────
 */

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

/* eslint no-constructor-return:0 */

let tinyCounter = 0;
const extensionApi = new TinyColorExtensionAPI();

class TinyColor {
	/**
	 * Create a new TinyColor instance
	 * @param  {String|Array|Object} color Notation describing a color
	 * @param  {Object} options            Options object (see below)
	 * @return {TinyColor}                 An instance representing the color
	 */
	constructor(color, options = {}) {
		color = color || '';
		// If input is already a tinycolor, return itself
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

	static newId() {
		return tinyCounter++
	}

	static registerFormat(id, options = {}) {
		return extensionApi.add(id, options)
	}

	static equals(color1, color2) {
		if (!color1 || !color2) {
			return false
		}

		return new TinyColor(color1).toRgbString() === new TinyColor(color2).toRgbString()
	}

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

	static readability(color1, color2) {
		return readability(color1, color2)
	}

	static isReadable(color1, color2, wcag2) {
		return isReadable(color1, color2, wcag2)
	}

	static mostReadable(baseColor, colorList, args) {
		return mostReadable(baseColor, colorList, args)
	}

	static mix(color1, color2, amount) {
		return calcMix(color1, color2, amount)
	}

	isDark() {
		return this.getBrightness() < 128
	}

	isLight() {
		return !this.isDark()
	}

	isValid() {
		return this._ok
	}

	getOriginalInput() {
		return this._originalInput
	}

	getFormat() {
		return this._format
	}

	getAlpha() {
		return this._a
	}

	getBrightness() {
		return calcBrightness(this.toRgb())
	}

	getLuminance() {
		return calcLuminance(this.toRgb(), rawToDeepRgba(this))
	}

	toString(format) {
		return extensionApi.print(rawToRgba(this), this._format, format)
	}

	toName() {
		return extensionApi.print(rawToRgba(this), 'name', 'toName')
	}

	toRgb() {
		return rawToDeepRgba(this)
	}

	toRgbString() {
		return rgbaToString(rawToRgba(this))
	}

	toRgbArray() {
		return rgbaToArray(rawToRgba(this))
	}

	toPercentageRgb() {
		return rgbaToPercentageRgba(rawToDeepRgba(this))
	}

	toPercentageRgbString() {
		return rgbaToString(rgbaToPercentageRgba(rawToRgba(this)))
	}

	toHex(allow3Char) {
		return rgbToHex(rawToRgba(this), allow3Char)
	}

	toHexString(allow3Char) {
		return `#${this.toHex(allow3Char)}`
	}

	toHex8(allow4Char) {
		return rgbaToHex(rawToRgba(this), allow4Char)
	}

	toHex8String(allow4Char) {
		return `#${this.toHex8(allow4Char)}`
	}

	toHsv() {
		return extensionApi.raw(rawToDeepRgba(this), 'hsv')
	}

	toHsvString() {
		return extensionApi.print(rawToDeepRgba(this), this._format, 'hsv')
	}

	toHsl() {
		return extensionApi.raw(rawToDeepRgba(this), 'hsl')
	}

	toHslString() {
		return extensionApi.print(rawToDeepRgba(this), this._format, 'hsl')
	}

	setAlpha(value) {
		this._a = boundAlpha(value);
		this._roundA = mathRound(100 * this._a) / 100;
		return this
	}

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

/*
 *  ES-TinyColor : RGB String Parsing
 *  ────────────────────────────────────────────────────────────────────────────
 */

const matchers$4 = (function () {
	return {
		rgb: new RegExp(`rgb${PERMISSIVE_MATCH3}`),
		rgba: new RegExp(`rgba${PERMISSIVE_MATCH4}`),
	}
})();

// `rgbStringToObject`
// Permissive string parsing.  Take in a number of formats, and output an object
// based on detected format.  Returns `{ r, g, b }`
function rgbStringToObject(color) {
	// Try to match string input using regular expressions.
	// Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
	// Just return an object and let the conversion functions handle that.
	// This way the result will be the same whether the tinycolor is initialized with string or object.
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

/*
 * # ES-TinyColor : RGB colors
 * ─────────────────────────────────────────────────────────────────────────────
 */

const api$6 = TinyColor.registerFormat('rgb');

api$6.shouldHandleInput = input =>
	(typeof input === 'object' && isValidCSSUnitRGB(input) && !isPercentage(input.r))
	|| rgbStringToObject(input);

api$6.toRgb = input =>
	(typeof input === 'object' && conformRgba(input))
	|| conformRgba(rgbStringToObject(input));

api$6.toRaw = rgba => rgba;

api$6.toString = rgba => rgbaToString(rgba);

/*
 * # ES-TinyColor : RGB (Percentage) colors
 *────────────────────────────────────────────────────────────────────────────
 */

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

/*
 * # ES-TinyColor : HEX colors
 *────────────────────────────────────────────────────────────────────────────
 */

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

/*
 * # ES-TinyColor : HEX8 colors
 *────────────────────────────────────────────────────────────────────────────
 */

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

/*
 * # ES-TinyColor : HSL colors
 * ─────────────────────────────────────────────────────────────────────────────
 */

const api$2 = TinyColor.registerFormat('hsl');

const matchers$1 = (function () {
	return {
		hsl: new RegExp(`hsl${PERMISSIVE_MATCH3}`),
		hsla: new RegExp(`hsla${PERMISSIVE_MATCH4}`),
	}
})();

const isValidCSSUnitHSL = hsl => isValidCSSUnit(hsl.h) && isValidCSSUnit(hsl.s) && isValidCSSUnit(hsl.l);

// `rgbToHsl`, `hslToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

// `rgbToHsl`
// Converts an RGB color value to HSL.
// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
// *Returns:* { h, s, l, a } in [0,1]
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
		s = 0; // Achromatic
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

// `hslToRgb`
// Converts an HSL color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
// *Returns:* { r, g, b, a } with r, g, b in the set [0, 255], a in [0, 1]
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
		b = l; // Achromatic
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
	// Try to match string input using regular expressions.
	// Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
	// Just return an object and let the conversion functions handle that.
	// This way the result will be the same whether the tinycolor is initialized with string or object.
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

/*
 * # ES-TinyColor : HSV colors
 * ─────────────────────────────────────────────────────────────────────────────
 */

const api$1 = TinyColor.registerFormat('hsv');

const matchers = (function () {
	return {
		hsv: new RegExp(`hsv${PERMISSIVE_MATCH3}`),
		hsva: new RegExp(`hsva${PERMISSIVE_MATCH4}`),
	}
})();

const isValidCSSUnitHSV = hsv => isValidCSSUnit(hsv.h) && isValidCSSUnit(hsv.s) && isValidCSSUnit(hsv.v);

// `rgbToHsv`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

// `rgbToHsv`
// Converts an RGB color value to HSV
// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
// *Returns:* { h, s, v } in [0,1]
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
		h = 0; // Achromatic
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

// `hsvToRgb`
// Converts an HSV color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
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
	// Try to match string input using regular expressions.
	// Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
	// Just return an object and let the conversion functions handle that.
	// This way the result will be the same whether the tinycolor is initialized with string or object.
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

/*
 * # ES-TinyColor : CSS named colors
 *────────────────────────────────────────────────────────────────────────────
 */

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

// <http://www.w3.org/TR/css3-color/#svg-color>
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

/*
 *  ES-TinyColor v0.4.1
 *  ────────────────────────────────────────────────────────────────────────────
 *  © 2016 Mark Griffiths @ The Bespoke Pixel (MIT licensed)
 *  Based on TinyColor © Brian Grinstead
 */

function tinycolor(color, options) {
	return new TinyColor(color, options)
}

// Expose static methods if called from function.
tinycolor.equals = TinyColor.equals;
tinycolor.registerFormat = TinyColor.registerFormat;
tinycolor.fromRatio = TinyColor.fromRatio;
tinycolor.mix = TinyColor.mix;
tinycolor.readability = TinyColor.readability;
tinycolor.isReadable = TinyColor.isReadable;
tinycolor.mostReadable = TinyColor.mostReadable;
tinycolor.names = names;

export { TinyColor, names, tinycolor };
