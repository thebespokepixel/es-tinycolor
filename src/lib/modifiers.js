/*
 *  ES-TinyColor : Modification Functions
 *  ────────────────────────────────────────────────────────────────────────────
 *  Thanks to less.js for some of the basics here
 *  <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>
 */
import TinyColor from './classes/tinycolor.js'
import {mathRound, clamp01, mathMax, mathMin} from './utilities.js'

/**
 * Apply a modification conditionally
 * @param  {Function}  action The modification function to apply
 * @param  {arguments} args   Arguments passed to specified function
 * @return {TinyColor}        The modified color
 */
export function modify(action, args) {
	const actions = {invert, desaturate, saturate, greyscale, lighten, brighten, darken, spin}
	const color = actions[action](...args)
	const [source] = args
	source._r = color._r
	source._g = color._g
	source._b = color._b
	source.setAlpha(color._a)
	return source
}

/**
 * Invert Color
 * @param  {TinyColor} color  The color to invert
 * @return {TinyColor}        The inverted color
 */
export function invert(color) {
	const rgb = new TinyColor(color).toRgb()
	rgb.r = mathMax(0, mathMin(255, 255 - rgb.r))
	rgb.g = mathMax(0, mathMin(255, 255 - rgb.g))
	rgb.b = mathMax(0, mathMin(255, 255 - rgb.b))
	return new TinyColor(rgb)
}

/**
 * Desaturate Color
 * @param  {TinyColor} color  The color to modify
 * @param  {Number}    amount The amount to desaturate <= 100
 * @return {TinyColor}        The modified color
 */
export function desaturate(color, amount) {
	amount = (amount === 0) ? 0 : (amount || 10)
	const hsl = new TinyColor(color).toHsl()
	hsl.s -= amount / 100
	hsl.s = clamp01(hsl.s)
	return new TinyColor(hsl)
}

/**
 * Saturate color
 * @param  {TinyColor} color  The color to modify
 * @param  {Number}    amount The amount to saturate <= 100
 * @return {TinyColor}        The modified color
 */
export function saturate(color, amount) {
	amount = (amount === 0) ? 0 : (amount || 10)
	const hsl = new TinyColor(color).toHsl()
	hsl.s += amount / 100
	hsl.s = clamp01(hsl.s)
	return new TinyColor(hsl)
}

/**
 * Remove all chroma, leaving luminence
 * @param  {TinyColor} color The color to modify
 * @return {TinyColor}       The modified color
 */
export function greyscale(color) {
	return new TinyColor(color).desaturate(100)
}

/**
 * Lighten a color
 * @param  {TinyColor} color  The color to modify
 * @param  {Number}    amount The amount to ligten by <= 100
 * @return {TinyColor}        The modified color
 */
export function lighten(color, amount) {
	amount = (amount === 0) ? 0 : (amount || 10)
	const hsl = new TinyColor(color).toHsl()
	hsl.l += amount / 100
	hsl.l = clamp01(hsl.l)
	return new TinyColor(hsl)
}

/**
 * Brighten a color
 * @param  {TinyColor} color  The color to modify
 * @param  {Number}    amount The amount to brighten by <= 100
 * @return {TinyColor}        The modified color
 */
export function brighten(color, amount) {
	amount = (amount === 0) ? 0 : (amount || 10)
	const rgb = new TinyColor(color).toRgb()
	rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * -(amount / 100))))
	rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * -(amount / 100))))
	rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * -(amount / 100))))
	return new TinyColor(rgb)
}

/**
 * Darken a color
 * @param  {TinyColor} color  The color to modify
 * @param  {Number}    amount The amount to brighten by <= 100
 * @return {TinyColor}        The modified color
 */
export function darken(color, amount) {
	amount = (amount === 0) ? 0 : (amount || 10)
	const hsl = new TinyColor(color).toHsl()
	hsl.l -= amount / 100
	hsl.l = clamp01(hsl.l)
	return new TinyColor(hsl)
}

/**
 * Spin takes a positive or negative amount within [-360, 360] indicating the
 * change of hue. Values outside of this range will be wrapped into this range.
 * @param  {TinyColor} color  The color to modify
 * @param  {Number}    amount Degrees to rotate hue by
 * @return {TinyColor}        The modified color
 */
export function spin(color, amount) {
	const hsl = new TinyColor(color).toHsl()
	const hue = (hsl.h + amount) % 360
	hsl.h = hue < 0 ? 360 + hue : hue
	return new TinyColor(hsl)
}
