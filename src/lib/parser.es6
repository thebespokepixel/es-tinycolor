/*
 *  ES-TinyColor : RGB String Parsing
 *  ────────────────────────────────────────────────────────────────────────────
 */
import {PERMISSIVE_MATCH3, PERMISSIVE_MATCH4} from './utilities'

const matchers = (function () {
	return {
		rgb: new RegExp(`rgb${PERMISSIVE_MATCH3}`),
		rgba: new RegExp(`rgba${PERMISSIVE_MATCH4}`)
	}
})()

// `rgbStringToObject`
// Permissive string parsing.  Take in a number of formats, and output an object
// based on detected format.  Returns `{ r, g, b }`
export function rgbStringToObject(color) {
	// Try to match string input using regular expressions.
	// Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
	// Just return an object and let the conversion functions handle that.
	// This way the result will be the same whether the tinycolor is initialized with string or object.
	let r, g, b, a, match
	if ((match = matchers.rgb.exec(color))) {
		[r, g, b] = match.splice(1, 3)
		return {r, g, b}
	}
	if ((match = matchers.rgba.exec(color))) {
		[r, g, b, a] = match.splice(1, 4)
		return {r, g, b, a}
	}

	return false
}
