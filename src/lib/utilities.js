/*
 *  ES-TinyColor : Utilities
 *  ────────────────────────────────────────────────────────────────────────────
 */
export const mathRound = Math.round
export const mathMin = Math.min
export const mathMax = Math.max
export const mathRandom = Math.random

// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
export const isOnePointZero = n => typeof n === 'string' && n.includes('.') && Number.parseFloat(n) === 1

// Check to see if string passed in is a percentage
export const isPercentage = n => typeof n === 'string' && n.includes('%')

// Don't let the range of [0,255] come back in [0,1].
// Potentially lose a little bit of precision here, but will fix issues where
// .5 gets interpreted as half of the total, instead of half of 1
// If it was supposed to be 128, this was already taken care of by `inputToRgb`
export const roundIf01 = n => n < 1 ? mathRound(n) : n

export const roundAlpha = a => mathRound(100 * a) / 100

export const boundAlpha = a => {
	a = Number.parseFloat(a)
	return (Number.isNaN(a) || a < 0 || a > 1) ? 1 : a
}

export const hasAlpha = rgba => rgba.a < 1 && rgba.a >= 0

// Force a number between 0 and 1
export const clamp01 = value => mathMin(1, mathMax(0, value))

// Force a hex value to have 2 characters
export const pad2 = c => c.length === 1 ? `0${c}` : `${c}`

// <http://www.w3.org/TR/css3-values/#integers>
export const CSS_INTEGER = '[-\\+]?\\d+%?'

// <http://www.w3.org/TR/css3-values/#number-value>
export const CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?'

// Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
export const CSS_UNIT = `(?:${CSS_NUMBER})|(?:${CSS_INTEGER})`

// `isValidCSSUnit`
// Take in a single string / number and check to see if it looks like a CSS unit
export const isValidCSSUnit = color => new RegExp(CSS_UNIT).test(color)

// `isValidCSSUnitRGB`
// Take in a rgb object check to see if it looks like a CSS unit
export const isValidCSSUnitRGB = rgb => isValidCSSUnit(rgb.r) && isValidCSSUnit(rgb.g) && isValidCSSUnit(rgb.b)

// Actual matching.
// Parentheses and commas are optional, but not required.
// Whitespace can take the place of commas or opening paren
export const PERMISSIVE_MATCH3 = `[\\s|\\(]+(${CSS_UNIT})[,|\\s]+(${CSS_UNIT})[,|\\s]+(${CSS_UNIT})\\s*\\)?`
export const PERMISSIVE_MATCH4 = `[\\s|\\(]+(${CSS_UNIT})[,|\\s]+(${CSS_UNIT})[,|\\s]+(${CSS_UNIT})[,|\\s]+(${CSS_UNIT})\\s*\\)?`

// Take input from [0, n] and return it as [0, 1]
export function bound01(n, max) {
	if (isOnePointZero(n)) {
		n = '100%'
	}

	const processPercent = isPercentage(n)
	n = mathMin(max, mathMax(0, Number.parseFloat(n)))

	// Automatically convert percentage into number
	if (processPercent) {
		n = Number.parseInt(n * max, 10) / 100
	}

	// Handle floating point rounding errors
	if ((Math.abs(n - max) < 0.000001)) {
		return 1
	}

	// Convert into [0, 1] range if it isn't already
	return (n % max) / Number.parseFloat(max)
}
