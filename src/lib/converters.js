/*
 *  ES-TinyColor : Conversion Functions
 *  ────────────────────────────────────────────────────────────────────────────
 */

import {bound01, boundAlpha, mathRound, pad2} from './utilities'

/**
 * Converts a decimal to a hex value
 * @param  {Number} d Decimal input value
 * @return {String}   Hexadecimal string
 */
export const convertDecimalToHex = d => mathRound(parseFloat(d) * 255).toString(16)

/**
 * Converts a base-16 hex value into a base-10 integer
 * @param  {String} val Hexadecimal input value
 * @return {Number}     Integer value
 */
export const convertHexToInt = val => parseInt(val, 16)

/**
 * Converts a hex value to a decimal
 * @param  {String} h Hexadecimal input value
 * @return {Number}   Decimal value
 */
export const convertHexToDecimal = h => convertHexToInt(h) / 255

/**
 * Replace a decimal with it's percentage value
 * @param  {Number} n Decimal input value
 * @return {String}   Percentage string
 */
export const convertToPercentage = n => n <= 1 ? `${n * 100}%` : n

/**
 * Handle conversion of internal precise values to exportable values. Should be
 * able to accept a tinycolour instance 'this' value.
 * @param  {Object} raw { _r, _g, _b, _a } with _r, _g, _b in [0.0, 255.0] and _a in [0, 1]
 * @return {Object}     { r, g, b } in [0, 255]
 */
export const rawToRgba = raw => {
	const [r, g, b] = [raw._r, raw._g, raw._b].map(mathRound)
	return {r, g, b, a: raw._roundA}
}

/**
 * Handle conversion of internal precise values to exportable values,
 * maintaining deep precision. Should be able to accept a tinycolour instance
 * 'this' value.
 * @param  {Object} raw { _r, _g, _b, _a } with _r, _g, _b in [0.0, 255.0] and _a in [0, 1]
 * @return {Object}     { r, g, b, a } in [0.0, 255.0]
 */
export const rawToDeepRgba = raw => ({r: raw._r, g: raw._g, b: raw._b, a: raw._a})

/**
 * Handle bounds / percentage checking to conform to CSS color spec
 * @link{http://www.w3.org/TR/css3-color/|www.w3.org/TR/css3-color}
 * @param  {Object} rgba { r, g, b, a } in [0, 255] or [0, 1]
 * @return {Object}      { r, g, b } in [0, 255]
 */
export const conformRgba = rgba => {
	const [r, g, b] = [rgba.r, rgba.g, rgba.b].map(n => bound01(n, 255) * 255)
	return {r, g, b, a: boundAlpha(rgba.a)}
}

export const rgbaToPercentageRgba = rgba => {
	const [r, g, b] = [rgba.r, rgba.g, rgba.b].map(n => `${mathRound(bound01(n, 255) * 100)}%`)
	return {r, g, b, a: rgba.a}
}

export const rgbaToString = rgba => (rgba.a === 1) ?
	`rgb(${rgba.r}, ${rgba.g}, ${rgba.b})` :
	`rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`

export const rgbaToArray = rgba => (rgba.a === 1) ? [rgba.r, rgba.g, rgba.b] : [rgba.r, rgba.g, rgba.b, mathRound(rgba.a * 255)]

// `rgbaToHex`
// Converts an RGBA color plus alpha transparency to hex
// Assumes r, g, b are contained in the set [0, 255] and
// a in [0, 1]. Returns a 3, 4, 6 or 8 character rgba hex
export const rgbaToHex = (rgba, allowShort) => {
	const hex = rgbaToArray(rgba).map(n => n.toString(16)).map(pad2)
	return allowShort && hex.every(h => h.charAt(0) === h.charAt(1)) ? hex.map(h => h.charAt(0)).join('') : hex.join('')
}

// `rgbToHex`
export const rgbToHex = (rgba, allowShort) => rgbaToHex(Object.assign({}, rgba, {a: 1}), allowShort)
