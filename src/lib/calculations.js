/*
 *  ES-TinyColor : Caluculation Functions
 *  ────────────────────────────────────────────────────────────────────────────
 */
import {tinycolor} from '..'

// http://www.w3.org/TR/AERT#color-contrast
export const calcBrightness = rgb => ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000

export function calcLuminance(rgb, deepRgb) {
	// http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
	let R
	let G
	let B
	const RsRGB = deepRgb.r / 255
	const GsRGB = deepRgb.g / 255
	const BsRGB = deepRgb.b / 255

	if (RsRGB <= 0.03928) {
		R = RsRGB / 12.92
	} else {
		R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4)
	}
	if (GsRGB <= 0.03928) {
		G = GsRGB / 12.92
	} else {
		G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4)
	}
	if (BsRGB <= 0.03928) {
		B = BsRGB / 12.92
	} else {
		B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4)
	}
	return (0.2126 * R) + (0.7152 * G) + (0.0722 * B)
}

export function calcMix(color1, color2, amount) {
	amount = (amount === 0) ? 0 : (amount || 50)
	const rgb1 = tinycolor(color1).toRgb()
	const rgb2 = tinycolor(color2).toRgb()
	const p = amount / 100
	const rgba = {
		r: ((rgb2.r - rgb1.r) * p) + rgb1.r,
		g: ((rgb2.g - rgb1.g) * p) + rgb1.g,
		b: ((rgb2.b - rgb1.b) * p) + rgb1.b,
		a: ((rgb2.a - rgb1.a) * p) + rgb1.a
	}
	return tinycolor(rgba)
}

