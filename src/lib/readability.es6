/*
 *  ES-TinyColor : Readability Functions
 *  ────────────────────────────────────────────────────────────────────────────
 *  <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)
 */
import {tinycolor} from '..'

// `validateWCAG2Parms`
// Return valid WCAG2 parms for isReadable.
// If input parms are invalid, return {"level":"AA", "size":"small"}
function validateWCAG2Parms(parms) {
	let level
	let size
	parms = parms || {
		level: 'AA',
		size: 'small'
	}
	level = (parms.level || 'AA').toUpperCase()
	size = (parms.size || 'small').toLowerCase()
	if (level !== 'AA' && level !== 'AAA') {
		level = 'AA'
	}
	if (size !== 'small' && size !== 'large') {
		size = 'small'
	}
	return {
		level,
		size
	}
}

// `readability`
// Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
export function readability(color1, color2) {
	const c1 = tinycolor(color1)
	const c2 = tinycolor(color2)
	return (Math.max(c1.getLuminance(), c2.getLuminance()) + 0.05) / (Math.min(c1.getLuminance(), c2.getLuminance()) + 0.05)
}

// `isReadable`
// Ensure that foreground and background color combinations meet WCAG2 guidelines.
// The third argument is an optional Object.
//     the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
//     the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
// If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.
//
// *Example*
//     tinycolor.isReadable("#000", "#111") => false
//     tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false
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

// `mostReadable`
// Given a base color and a list of possible foreground or background
// colors for that base, returns the most readable color.
// Optionally returns Black or White if the most readable color is unreadable.
//
// *Example*
//     tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
//     tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
//     tinycolor.mostReadable("#a8015a", ["#faf3f3"], {includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
//     tinycolor.mostReadable("#a8015a", ["#faf3f3"], {includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
export function mostReadable(baseColor, colorList, args = {}) {
	const includeFallbackColors = args.includeFallbackColors
	const level = args.level
	const size = args.size
	let readable
	let bestColor = null
	let bestScore = 0

	colorList.forEach(color => {
		readable = readability(baseColor, color)
		if (readable > bestScore) {
			bestScore = readable
			bestColor = tinycolor(color)
		}
	})

	if (isReadable(baseColor, bestColor, {level, size}) || !includeFallbackColors) {
		return bestColor
	}
	args.includeFallbackColors = false
	return mostReadable(baseColor, ['#fff', '#000'], args)
}
