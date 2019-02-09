/*
 * # ES-TinyColor : HSL colors
 * ─────────────────────────────────────────────────────────────────────────────
 */
import TinyColor from '../classes/tinycolor'
import {bound01, mathMax, mathMin, mathRound, isValidCSSUnit, PERMISSIVE_MATCH3, PERMISSIVE_MATCH4} from '../utilities'
import {convertToPercentage} from '../converters'

const api = TinyColor.registerFormat('hsl')

const matchers = (function () {
	return {
		hsl: new RegExp(`hsl${PERMISSIVE_MATCH3}`),
		hsla: new RegExp(`hsla${PERMISSIVE_MATCH4}`)
	}
})()

const isValidCSSUnitHSL = hsl => isValidCSSUnit(hsl.h) && isValidCSSUnit(hsl.s) && isValidCSSUnit(hsl.l)

// `rgbToHsl`, `hslToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

// `rgbToHsl`
// Converts an RGB color value to HSL.
// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
// *Returns:* { h, s, l, a } in [0,1]
function rgbaToHsla(rgba) {
	const r = bound01(rgba.r, 255)
	const g = bound01(rgba.g, 255)
	const b = bound01(rgba.b, 255)
	const a = rgba.a || 1
	const max = mathMax(r, g, b)
	const min = mathMin(r, g, b)
	let h, s
	const l = (max + min) / 2

	if (max === min) {
		h = 0
		s = 0 // Achromatic
	} else {
		const d = max - min
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
		switch (max) {
			case r:
				h = ((g - b) / d) + (g < b ? 6 : 0)
				break
			case g:
				h = ((b - r) / d) + 2
				break
			default:
				h = ((r - g) / d) + 4
				break
		}

		h /= 6
	}

	return {h, s, l, a}
}

// `hslToRgb`
// Converts an HSL color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
// *Returns:* { r, g, b, a } with r, g, b in the set [0, 255], a in [0, 1]
function hslaToRgba(hsla) {
	const h = bound01(hsla.h, 360)
	const s = bound01(convertToPercentage(hsla.s), 100)
	const l = bound01(convertToPercentage(hsla.l), 100)
	const a = hsla.a || 1
	let r, g, b

	function hue2rgb(p, q, t) {
		t = (t < 0) ? t + 1 : t
		t = (t > 1) ? t - 1 : t
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
		r = l
		g = l
		b = l // Achromatic
	} else {
		const q = l < 0.5 ? l * (1 + s) : l + s - (l * s)
		const p = (2 * l) - q
		r = hue2rgb(p, q, h + (1 / 3))
		g = hue2rgb(p, q, h)
		b = hue2rgb(p, q, h - (1 / 3))
	}

	return {r: r * 255, g: g * 255, b: b * 255, a}
}

function hslStringToObject(color) {
	// Try to match string input using regular expressions.
	// Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
	// Just return an object and let the conversion functions handle that.
	// This way the result will be the same whether the tinycolor is initialized with string or object.
	let h, s, l, a, match
	if ((match = matchers.hsl.exec(color))) {
		[h, s, l] = match.splice(1, 3)
		return {h, s, l}
	}

	if ((match = matchers.hsla.exec(color))) {
		[h, s, l, a] = match.splice(1, 4)
		return {h, s, l, a}
	}

	return false
}

function hslaToString(hsla) {
	let {h, s, l, a} = hsla
	h = mathRound(h * 360)
	s = mathRound(s * 100)
	l = mathRound(l * 100)
	return (a === 1) ?
		`hsl(${h}, ${s}%, ${l}%)` :
		`hsla(${h}, ${s}%, ${l}%, ${a})`
}

function hslaToRaw(hsla) {
	let {h, s, l, a} = hsla
	h *= 360
	return {h, s, l, a}
}

api.shouldHandleInput = input => (typeof input === 'object' && isValidCSSUnitHSL(input)) || hslStringToObject(input)
api.toRgb = input => (typeof input === 'object' && hslaToRgba(input)) || hslaToRgba(hslStringToObject(input))
api.toRaw = rgba => hslaToRaw(rgbaToHsla(rgba))
api.toString = rgba => hslaToString(rgbaToHsla(rgba))
