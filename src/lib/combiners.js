/*
 *  ES-TinyColor : Combination Functions
 *  ────────────────────────────────────────────────────────────────────────────
 *  Thanks to jQuery xColor for some of the ideas behind these
 *  <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>
 */

import TinyColor from './classes/tinycolor'

export function combine(action, args) {
	const actions = {monochromatic, analogous, complement, splitcomplement, triad, tetrad}
	return actions[action](...args)
}

export function complement(color) {
	const hsl = new TinyColor(color).toHsl()
	hsl.h = (hsl.h + 180) % 360
	return new TinyColor(hsl)
}

export function triad(color) {
	const hsl = new TinyColor(color).toHsl()
	const {h} = hsl
	return [
		new TinyColor(color),
		new TinyColor({h: (h + 120) % 360, s: hsl.s, l: hsl.l}),
		new TinyColor({h: (h + 240) % 360, s: hsl.s, l: hsl.l})
	]
}

export function tetrad(color) {
	const hsl = new TinyColor(color).toHsl()
	const {h} = hsl
	return [
		new TinyColor(color),
		new TinyColor({h: (h + 90) % 360, s: hsl.s, l: hsl.l}),
		new TinyColor({h: (h + 180) % 360, s: hsl.s, l: hsl.l}),
		new TinyColor({h: (h + 270) % 360, s: hsl.s, l: hsl.l})
	]
}

export function splitcomplement(color) {
	const hsl = new TinyColor(color).toHsl()
	const {h} = hsl
	return [
		new TinyColor(color),
		new TinyColor({h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
		new TinyColor({h: (h + 216) % 360, s: hsl.s, l: hsl.l})
	]
}

export function analogous(color, results, slices) {
	results = results || 6
	slices = slices || 30

	const hsl = new TinyColor(color).toHsl()
	const part = 360 / slices
	const ret = [new TinyColor(color)]

	for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results;) {
		hsl.h = (hsl.h + part) % 360
		ret.push(new TinyColor(hsl))
	}

	return ret
}

export function monochromatic(color, results) {
	results = results || 6
	const hsv = new TinyColor(color).toHsv()
	let {h, s, v} = hsv
	const ret = []
	const modification = 1 / results

	while (results--) {
		ret.push(new TinyColor({h, s, v}))
		v = (v + modification) % 1
	}

	return ret
}
