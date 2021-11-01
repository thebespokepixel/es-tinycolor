/*
 *  ES-TinyColor : Caluculation Functions
 *  ────────────────────────────────────────────────────────────────────────────
 */
import TinyColor from './classes/tinycolor.js'

/**
 * Calculates the brightness.
 * http://www.w3.org/TR/AERT#color-contrast
 *
 * @alias calculations.calcBrightness
 * @param      {object}  rgb     The rgb
 * @return     {number}  The brightness.
 */
export const calcBrightness = rgb => ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000

/**
 * Calculates the luminance.
 * http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
 *
 * @alias calculations.calcLuminance
 * @param  {TinyColor} rgb The rgb color
 * @return {number}    The luminance.
 */
export function calcLuminance(rgb) {
	const RsRGB = rgb.r / 255
	const GsRGB = rgb.g / 255
	const BsRGB = rgb.b / 255

	const R = RsRGB <= 0.039_28 ? RsRGB / 12.92 : ((RsRGB + 0.055) / 1.055) ** 2.4

	const G = GsRGB <= 0.039_28 ? GsRGB / 12.92 : ((GsRGB + 0.055) / 1.055) ** 2.4

	const B = BsRGB <= 0.039_28 ? BsRGB / 12.92 : ((BsRGB + 0.055) / 1.055) ** 2.4

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
export function calcMix(color1, color2, amount) {
	amount = (amount === 0) ? 0 : (amount || 50)
	const rgb1 = new TinyColor(color1).toRgb()
	const rgb2 = new TinyColor(color2).toRgb()
	const p = amount / 100
	const rgba = {
		r: ((rgb2.r - rgb1.r) * p) + rgb1.r,
		g: ((rgb2.g - rgb1.g) * p) + rgb1.g,
		b: ((rgb2.b - rgb1.b) * p) + rgb1.b,
		a: ((rgb2.a - rgb1.a) * p) + rgb1.a,
	}
	return new TinyColor(rgba)
}

