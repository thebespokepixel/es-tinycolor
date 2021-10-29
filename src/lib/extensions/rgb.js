/*
 * # ES-TinyColor : RGB colors
 * ─────────────────────────────────────────────────────────────────────────────
 */
import TinyColor from '../classes/tinycolor.js'
import {isValidCSSUnitRGB, isPercentage} from '../utilities.js'
import rgbStringToObject from '../parser.js'
import {conformRgba, rgbaToString} from '../converters.js'

const api = TinyColor.registerFormat('rgb')

api.shouldHandleInput = input =>
	(typeof input === 'object' && isValidCSSUnitRGB(input) && !isPercentage(input.r))
	|| rgbStringToObject(input)

api.toRgb = input =>
	(typeof input === 'object' && conformRgba(input))
	|| conformRgba(rgbStringToObject(input))

api.toRaw = rgba => rgba

api.toString = rgba => rgbaToString(rgba)
