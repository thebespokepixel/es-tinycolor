/*
 * # ES-TinyColor : HEX colors
 *────────────────────────────────────────────────────────────────────────────
 */
import TinyColor from '../classes/tinycolor.js'
import {convertHexToInt, rgbToHex} from '../converters.js'
import {hasAlpha} from '../utilities.js'

const api = TinyColor.registerFormat('hex', {
	alias: ['hex3', 'hex6'],
})

const matchers = (function () {
	return {
		hex3: /^#?([\da-fA-F])([\da-fA-F])([\da-fA-F])$/,
		hex6: /^#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/,
	}
})()

function hexToRgba(color) {
	let match
	if ((match = matchers.hex3.exec(color))) {
		const [r, g, b] = match.splice(1, 3).map(h => `${h}${h}`).map(value => convertHexToInt(value))
		return {r, g, b, a: 1}
	}

	if ((match = matchers.hex6.exec(color))) {
		const [r, g, b] = match.splice(1, 3).map(value => convertHexToInt(value))
		return {r, g, b, a: 1}
	}

	return false
}

const hexToString = (rgba, short = api.options.shortHex) => `#${api.options.upperCaseHex
	? rgbToHex(rgba, short).toUpperCase()
	: rgbToHex(rgba, short)}`

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
		return api.options.alphaFormat === 'hex'
			? hexToString(rgba) : api.print(api.options.alphaFormat, rgba)
	}

	return hexToString(rgba)
}
