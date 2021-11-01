/*
 *  ES-TinyColor : Readability Functions
 *  ────────────────────────────────────────────────────────────────────────────
 *  <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)
 */
/* eslint capitalized-comments: [0], unicorn/explicit-length-check: 0 */

import TinyColor from './classes/tinycolor.js'

/**
 * Return valid WCAG2 parameters for isReadable.
 *
 * @alias readability.validateWCAG2Parms
 * @param      {object}  parms       The parameters
 * @param      {object}  parms.level The level to test "AA" or "AAA" (default "AA")
 * @param      {object}  parms.size  The content size to test "large" or "small" (default "small")
 * @return     {object}  sanitized parameters
 */
function validateWCAG2Parms(parms) {
	let level
	let size
	parms = parms || {
		level: 'AA',
		size: 'small',
	}
	level = (parms.level || 'AA').toUpperCase()
	size = (parms.size || 'small').toLowerCase()
	if (level !== 'AA' && level !== 'AAA') {
		level = 'AA'
	}

	if (size !== 'small' && size !== 'large') {
		size = 'small'
	}

	return {level, size}
}

/**
 * Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
 *
 * @param      {TinyColor}  color1  The first color
 * @param      {TinyColor}  color2  The second color
 * @return     {number}             The color contrast defined by (WCAG Version 2)
 */
export function readability(color1, color2) {
	const c1 = new TinyColor(color1)
	const c2 = new TinyColor(color2)
	return (Math.max(c1.getLuminance(), c2.getLuminance()) + 0.05) / (Math.min(c1.getLuminance(), c2.getLuminance()) + 0.05)
}

/**
 * Ensure that foreground and background color combinations meet WCAG2 guidelines.
 *
 * @param   {TinyColor}        color1        The first color
 * @param   {TinyColor}        color2        The second color
 * @param   {object}           wcag2         The WCAG2 properties to test
 * @param   {object}           wcag2.level   The level to test "AA" or "AAA" (default "AA")
 * @param   {object}           wcag2.size    The content size to test "large" or "small" (default "small")
 * @example Tinycolor.isReadable("#000", "#111") → false
 * @example Tinycolor.isReadable("#000", "#111", {level:"AA",size:"large"}) → false
 * @return  {(boolean|number)} True if readable, False otherwise.
 */
export function isReadable(color1, color2, wcag2) {
	const readable = readability(color1, color2)
	const wcag2Parms = validateWCAG2Parms(wcag2)
	let out = false

	switch (wcag2Parms.level + wcag2Parms.size) {
		case 'AAlarge':
			out = readable >= 3
			break
		case 'AAAsmall':
			out = readable >= 7
			break
		default:
			out = readable >= 4.5
	}

	return out
}

/**
 * Given a base color and a list of possible foreground or background colors for that
 * base, returns the most readable color.
 *
 * Optionally returns Black or White if the most readable color is unreadable.
 *
 * @param   {TinyColor}    baseColor                     The base color
 * @param   {[TinyColor]}  colorList                     An array of TinyColors
 * @param   {object}       [args={}]                     The arguments
 * @param   {boolean}      args.includeFallbackColors    Include fallback colors?
 * @param   {object}       args.level                    The level to test "AA" or "AAA" (default "AA")
 * @param   {object}       args.size                     The content size to test "large" or "small" (default "small")
 * @example Tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"], {includeFallbackColors:false}).toHexString(); // "#112255"
 * @example Tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"], {includeFallbackColors:true}).toHexString();  // "#ffffff"
 * @example Tinycolor.mostReadable("#a8015a", ["#faf3f3"], {includeFallbackColors:true, level:"AAA", size:"large"}).toHexString(); // "#faf3f3"
 * @example Tinycolor.mostReadable("#a8015a", ["#faf3f3"], {includeFallbackColors:true, level:"AAA", size:"small"}).toHexString(); // "#ffffff"
 * @return  {TinyColor}    A TinyColor instance of the msot readable color.
 */
export function mostReadable(baseColor, colorList, args = {}) {
	const {includeFallbackColors, level, size} = args
	let readable
	let bestColor = null
	let bestScore = 0

	for (const color of colorList) {
		readable = readability(baseColor, color)
		if (readable > bestScore) {
			bestScore = readable
			bestColor = new TinyColor(color)
		}
	}

	if (isReadable(baseColor, bestColor, {level, size}) || !includeFallbackColors) {
		return bestColor
	}

	args.includeFallbackColors = false
	return mostReadable(baseColor, ['#fff', '#000'], args)
}
