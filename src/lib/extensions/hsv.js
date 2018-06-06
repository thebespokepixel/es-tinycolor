/*
 * # ES-TinyColor : HSV colors
 * ─────────────────────────────────────────────────────────────────────────────
 */
import TinyColor from '../classes/tinycolor'
import {bound01, mathMax, mathMin, mathRound, isValidCSSUnit, PERMISSIVE_MATCH3, PERMISSIVE_MATCH4} from '../utilities'
import {convertToPercentage} from '../converters'

const api = TinyColor.registerFormat('hsv')

const matchers = (function () {
	return {
		hsv: new RegExp(`hsv${PERMISSIVE_MATCH3}`),
		hsva: new RegExp(`hsva${PERMISSIVE_MATCH4}`)
	}
})()

const isValidCSSUnitHSV = hsv => isValidCSSUnit(hsv.h) && isValidCSSUnit(hsv.s) && isValidCSSUnit(hsv.v)

// `rgbToHsv`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

// `rgbToHsv`
// Converts an RGB color value to HSV
// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
// *Returns:* { h, s, v } in [0,1]
function rgbaToHsva(rgba) {
	const r = bound01(rgba.r, 255)
	const g = bound01(rgba.g, 255)
	const b = bound01(rgba.b, 255)
	const a = rgba.a || 1
	const max = mathMax(r, g, b)
	const min = mathMin(r, g, b)
	const d = max - min
	let h
	const s = max === 0 ? 0 : d / max
	const v = max

	if (max === min) {
		h = 0 // Achromatic
	} else {
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
	return {h, s, v, a}
}

// `hsvToRgb`
// Converts an HSV color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hsvaToRgba(hsva) {
	const h = bound01(hsva.h, 360) * 6
	const s = bound01(convertToPercentage(hsva.s), 100)
	const v = bound01(convertToPercentage(hsva.v), 100)
	const a = hsva.a || 1

	const i = Math.floor(h)
	const f = h - i
	const p = v * (1 - s)
	const q = v * (1 - (f * s))
	const t = v * (1 - ((1 - f) * s))
	const mod = i % 6
	const r = [v, q, p, p, t, v][mod]
	const g = [t, v, v, q, p, p][mod]
	const b = [p, p, t, v, v, q][mod]

	return {r: r * 255, g: g * 255, b: b * 255, a}
}

function hsvStringToObject(color) {
	// Try to match string input using regular expressions.
	// Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
	// Just return an object and let the conversion functions handle that.
	// This way the result will be the same whether the tinycolor is initialized with string or object.
	let h, s, v, a, match
	if ((match = matchers.hsv.exec(color))) {
		[h, s, v] = match.splice(1, 3)
		return {h, s, v}
	}
	if ((match = matchers.hsva.exec(color))) {
		[h, s, v, a] = match.splice(1, 4)
		return {h, s, v, a}
	}
	return false
}

function hsvaToString(hsva) {
	let {h, s, v, a} = hsva
	h = mathRound(h * 360)
	s = mathRound(s * 100)
	v = mathRound(v * 100)
	return (a === 1) ?
		`hsv(${h}, ${s}%, ${v}%)` :
		`hsva(${h}, ${s}%, ${v}%, ${a})`
}

function hsvaToRaw(hsla) {
	let {h, s, v, a} = hsla
	h *= 360
	return {h, s, v, a}
}

api.shouldHandleInput = input => (typeof input === 'object' && isValidCSSUnitHSV(input)) || hsvStringToObject(input)
api.toRgb = input => (typeof input === 'object' && hsvaToRgba(input)) || hsvaToRgba(hsvStringToObject(input))
api.toRaw = rgba => hsvaToRaw(rgbaToHsva(rgba))
api.toString = rgba => hsvaToString(rgbaToHsva(rgba))
