/*
 * # ES-TinyColor : RGB (Percentage) colors
 *────────────────────────────────────────────────────────────────────────────
 */
import TinyColor from '../classes/tinycolor'
import {isValidCSSUnitRGB, isPercentage} from '../utilities'
import rgbStringToObject from '../parser'
import {conformRgba, rgbaToPercentageRgba, rgbaToString} from '../converters'

const api = TinyColor.registerFormat('prgb')

api.shouldHandleInput = input => {
	if (typeof input === 'string') {
		const rgbCheck = rgbStringToObject(input)
		return rgbCheck && isPercentage(rgbCheck.r)
	}
	return isValidCSSUnitRGB(input) && isPercentage(input.r)
}
api.toRgb = input => typeof input === 'object' ? conformRgba(input) : conformRgba(rgbStringToObject(input))
api.toRaw = rgba => rgbaToPercentageRgba(rgba)
api.toString = rgba => rgbaToString(rgbaToPercentageRgba(rgba))

