/*
 * # ES-TinyColor : RGB colors
 * ─────────────────────────────────────────────────────────────────────────────
 */
import TinyColor from '../classes/tinycolor'
import {isValidCSSUnitRGB, isPercentage} from '../utilities'
import {rgbStringToObject} from '../parser'
import {conformRgba, rgbaToString} from '../converters'

const api = TinyColor.registerFormat('rgb')

api.shouldHandleInput = input =>
	(typeof input === 'object' && isValidCSSUnitRGB(input) && !isPercentage(input.r)) ||
	rgbStringToObject(input)

api.toRgb = input =>
	(typeof input === 'object' && conformRgba(input)) ||
	conformRgba(rgbStringToObject(input))

api.toRaw = rgba => rgba

api.toString = rgba => rgbaToString(rgba)
