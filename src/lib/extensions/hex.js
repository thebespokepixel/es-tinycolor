/*
 * # ES-TinyColor : HEX colors
 *────────────────────────────────────────────────────────────────────────────
 */
import TinyColor from '../classes/tinycolor'
import {convertHexToInt, rgbToHex} from '../converters'
import {hasAlpha} from '../utilities'

const api = TinyColor.registerFormat('hex', {
	alias: ['hex3', 'hex6']
})

const matchers = (function () {
	return {
		hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
		hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
	}
})()

function hexToRgba(color) {
	let match
	if ((match = matchers.hex3.exec(color))) {
		const [r, g, b] = match.splice(1, 3).map(h => `${h}${h}`).map(convertHexToInt)
		return {r, g, b, a: 1}
	}
	if ((match = matchers.hex6.exec(color))) {
		const [r, g, b] = match.splice(1, 3).map(convertHexToInt)
		return {r, g, b, a: 1}
	}
	return false
}

const hexToString = (rgba, short = api.opts.shortHex) => `#${api.opts.upperCaseHex ?
	rgbToHex(rgba, short).toUpperCase() :
	rgbToHex(rgba, short)}`

api.shouldHandleInput = input => matchers.hex6.test(input) || matchers.hex3.test(input)
api.toRgb = input => hexToRgba(input)
api.toRaw = rgba => rgba
api.toString = rgba => {
	if (/^hex6?$/.test(api.wanted)) {
		return hexToString(rgba)
	}
	if (api.wanted === 'hex3') {
		return hexToString(rgba, true)
	}
	if (hasAlpha(rgba)) {
		return api.opts.alphaFormat === 'hex' ?
			hexToString(rgba) : api.print(api.opts.alphaFormat, rgba)
	}
	return hexToString(rgba)
}
