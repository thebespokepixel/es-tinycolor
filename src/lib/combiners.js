/*
 *  ES-TinyColor : Combination Functions
 *  ────────────────────────────────────────────────────────────────────────────
 *  Thanks to jQuery xColor for some of the ideas behind these
 *  <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>
 */
/* eslint no-bitwise: 0 */

import TinyColor from './classes/tinycolor.js'

export function combine(action, args) {
	const actions = {monochromatic, analogous, complement, splitcomplement, triad, tetrad}
	return actions[action](...args)
}

/**
 * Find the complementary color.
 *
 * @param      {TinyColor}     color   The color
 * @return     {TinyColor}  The new complementary Tinycolor.
 */
export function complement(color) {
	const hsl = new TinyColor(color).toHsl()
	hsl.h = (hsl.h + 180) % 360
	return new TinyColor(hsl)
}

/**
 * Find the color triad colors.
 *
 * @param      {TinyColor}    color   The color
 * @return     {[TinyColor]}  An array of 3 triad TinyColors.
 */
export function triad(color) {
	const hsl = new TinyColor(color).toHsl()
	const {h} = hsl
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
export function tetrad(color) {
	const hsl = new TinyColor(color).toHsl()
	const {h} = hsl
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
export function splitcomplement(color) {
	const hsl = new TinyColor(color).toHsl()
	const {h} = hsl
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
export function analogous(color, results = 6, slices = 30) {
	const hsl = new TinyColor(color).toHsl()
	const part = 360 / slices
	const returnValue = [new TinyColor(color)]

	for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results;) {
		hsl.h = (hsl.h + part) % 360
		returnValue.push(new TinyColor(hsl))
	}

	return returnValue
}

/**
 * Find the monochromatic color.
 *
 * @param      {TinyColor}    color   The color
 * @return     {TinyColor}  The new monochromatic Tinycolor.
 */
export function monochromatic(color, results = 6) {
	const hsv = new TinyColor(color).toHsv()
	let {h, s, v} = hsv
	const returnValue = []
	const modification = 1 / results

	while (results--) {
		returnValue.push(new TinyColor({h, s, v}))
		v = (v + modification) % 1
	}

	return returnValue
}
