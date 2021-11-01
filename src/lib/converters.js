/*
 *  ES-TinyColor : Conversion Functions
 *  ────────────────────────────────────────────────────────────────────────────
 */

import {bound01, boundAlpha, mathRound, pad2} from './utilities.js'

/**
 * Converts a decimal to a hex value
 *
 * @alias converters.convertDecimalToHex
 * @param  {number} d Decimal input value
 * @return {string}   Hexadecimal string
 */
export const convertDecimalToHex = d => mathRound(Number.parseFloat(d) * 255).toString(16)

/**
 * Converts a base-16 hex value into a base-10 integer
 *
 * @alias converters.convertHexToInt
 * @param  {string} val Hexadecimal input value
 * @return {number}     Integer value
 */
export const convertHexToInt = value => Number.parseInt(value, 16)

/**
 * Converts a hex value to a decimal
 *
 * @alias converters.convertHexToDecimal
 * @param  {string} h Hexadecimal input value
 * @return {number}   Decimal value
 */
export const convertHexToDecimal = h => convertHexToInt(h) / 255

/**
 * Replace a decimal with it's percentage value
 *
 * @alias converters.convertToPercentage
 * @param  {number} n Decimal input value
 * @return {string}   Percentage string
 */
export const convertToPercentage = n => n <= 1 ? `${n * 100}%` : n

/**
 * Handle conversion of internal precise values to exportable values. Should be
 * able to accept a tinycolour instance 'this' value.
 *
 * @alias converters.rawToRgba
 * @param  {object} raw { _r, _g, _b, _a } with _r, _g, _b in [0.0, 255.0] and _a in [0, 1]
 * @return {object}     { r, g, b } in [0, 255]
 */
export const rawToRgba = raw => {
	const [r, g, b] = [raw._r, raw._g, raw._b].map(value => mathRound(value))
	return {r, g, b, a: raw._roundA}
}

/**
 * Handle conversion of internal precise values to exportable values,
 * maintaining deep precision. Should be able to accept a tinycolour instance
 * 'this' value.
 *
 * @alias converters.rawToDeepRgba
 * @param  {object} raw { _r, _g, _b, _a } with _r, _g, _b in [0.0, 255.0] and _a in [0, 1]
 * @return {object}     { r, g, b, a } in [0.0, 255.0]
 */
export const rawToDeepRgba = raw => ({r: raw._r, g: raw._g, b: raw._b, a: raw._a})

/**
 * Handle bounds / percentage checking to conform to CSS color spec
 * @link{http://www.w3.org/TR/css3-color/|www.w3.org/TR/css3-color}
 *
 * @alias converters.conformRgba
 * @param  {object} rgba { r, g, b, a } in [0, 255] or [0, 1]
 * @return {object}      { r, g, b } in [0, 255]
 */
export const conformRgba = rgba => {
	const [r, g, b] = [rgba.r, rgba.g, rgba.b].map(n => bound01(n, 255) * 255)
	return {r, g, b, a: boundAlpha(rgba.a)}
}

export const rgbaToPercentageRgba = rgba => {
	const [r, g, b] = [rgba.r, rgba.g, rgba.b].map(n => `${mathRound(bound01(n, 255) * 100)}%`)
	return {r, g, b, a: rgba.a}
}

export const rgbaToString = rgba => (rgba.a === 1)
	? `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`
	: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`

export const rgbaToArray = rgba => (rgba.a === 1) ? [rgba.r, rgba.g, rgba.b] : [rgba.r, rgba.g, rgba.b, mathRound(rgba.a * 255)]

// `rgbaToHex`
// Converts an RGBA color plus alpha transparency to hex
// Assumes r, g, b are contained in the set [0, 255] and
// a in [0, 1]. Returns a 3, 4, 6 or 8 character rgba hex

/**
 * Convert RGBA to hexadecimal
 *
 * Converts an RGBA color plus alpha transparency to hex
 * Assumes r, g, b are contained in the set [0, 255] and
 * a in [0, 1]. Returns a 4 or 8 character rgba hex
 *
 * @alias converters.rgbaToHex
 * @param      {object}    rgba        The rgba object.
 * @param      {boolean}   allowShort  Allow short hex output
 * @return     {string}    The hex output.
 */
export const rgbaToHex = (rgba, allowShort) => {
	const hex = rgbaToArray(rgba).map(n => n.toString(16)).map(value => pad2(value))
	return allowShort && hex.every(h => h.charAt(0) === h.charAt(1)) ? hex.map(h => h.charAt(0)).join('') : hex.join('')
}

/**
 * Convert RGB to hexadecimal
 *
 * Converts an RGBA color plus alpha transparency to hex
 * Assumes r, g, b are contained in the set [0, 255]. Returns a 3 or 6 character rgba hex
 *
 * @alias converters.rgbToHex
 * @param      {object}    rgb        The rgb object.
 * @param      {boolean}   allowShort  Allow short hex output
 * @return     {string}    The hex output.
 */
export const rgbToHex = (rgba, allowShort) => rgbaToHex({...rgba, a: 1}, allowShort)
