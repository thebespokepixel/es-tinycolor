/*
 *  ES-TinyColor : Combination Functions
 *  ────────────────────────────────────────────────────────────────────────────
 *  Thanks to jQuery xColor for some of the ideas behind these
 *  <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>
 */
import {tinycolor} from '..'

export function combine(action, args) {
	const actions = {monochromatic, analogous, complement, splitcomplement, triad, tetrad}
	return actions[action](...args)
}

export function complement(color) {
	const hsl = tinycolor(color).toHsl()
	hsl.h = (hsl.h + 180) % 360
	return tinycolor(hsl)
}

export function triad(color) {
	const hsl = tinycolor(color).toHsl()
	const h = hsl.h
	return [
		tinycolor(color),
		tinycolor({h: (h + 120) % 360, s: hsl.s, l: hsl.l}),
		tinycolor({h: (h + 240) % 360, s: hsl.s, l: hsl.l})
	]
}

export function tetrad(color) {
	const hsl = tinycolor(color).toHsl()
	const h = hsl.h
	return [
		tinycolor(color),
		tinycolor({h: (h + 90) % 360, s: hsl.s, l: hsl.l}),
		tinycolor({h: (h + 180) % 360, s: hsl.s, l: hsl.l}),
		tinycolor({h: (h + 270) % 360, s: hsl.s, l: hsl.l})
	]
}

export function splitcomplement(color) {
	const hsl = tinycolor(color).toHsl()
	const h = hsl.h
	return [
		tinycolor(color),
		tinycolor({h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
		tinycolor({h: (h + 216) % 360, s: hsl.s, l: hsl.l})
	]
}

export function analogous(color, results, slices) {
	results = results || 6
	slices = slices || 30

	const hsl = tinycolor(color).toHsl()
	const part = 360 / slices
	const ret = [tinycolor(color)]

	for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results;) {
		hsl.h = (hsl.h + part) % 360
		ret.push(tinycolor(hsl))
	}
	return ret
}

export function monochromatic(color, results) {
	results = results || 6
	const hsv = tinycolor(color).toHsv()
	let {h, s, v} = hsv
	const ret = []
	const modification = 1 / results

	while (results--) {
		ret.push(tinycolor({h, s, v}))
		v = (v + modification) % 1
	}
	return ret
}
