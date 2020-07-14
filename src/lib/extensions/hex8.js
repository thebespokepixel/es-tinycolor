/*
 * # ES-TinyColor : HEX8 colors
 *────────────────────────────────────────────────────────────────────────────
 */
import TinyColor from '../classes/tinycolor'
import {convertHexToInt, convertHexToDecimal, rgbaToHex} from '../converters'
import {hasAlpha} from '../utilities'

const api = TinyColor.registerFormat('hex8', {
	alias: ['hex4']
})

const matchers = (function () {
	return {
		hex4: /^#?([\da-fA-F])([\da-fA-F])([\da-fA-F])([\da-fA-F])$/,
		hex8: /^#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/
	}
})()

function hexToRgba(color) {
	let match
	if ((match = matchers.hex4.exec(color))) {
		const a = convertHexToDecimal(`${match[4]}${match[4]}`)
		const [r, g, b] = match.splice(1, 3).map(h => `${h}${h}`).map(value => convertHexToInt(value))
		return {r, g, b, a}
	}

	if ((match = matchers.hex8.exec(color))) {
		const a = convertHexToDecimal(match[4])
		const [r, g, b] = match.splice(1, 3).map(value => convertHexToInt(value))
		return {r, g, b, a}
	}

	return false
}

const hexToString = (rgba, short = api.options.shortHex) => `#${api.options.upperCaseHex ?
	rgbaToHex(rgba, short).toUpperCase() :
	rgbaToHex(rgba, short)}`

api.shouldHandleInput = input => matchers.hex8.test(input) || matchers.hex4.test(input)
api.toRgb = input => hexToRgba(input)
api.toRaw = rgba => rgba
api.toString = rgba => {
	if (api.wanted === 'hex4') {
		return hexToString(rgba, true)
	}

	if (api.wanted === 'hex8') {
		return hexToString(rgba)
	}

	if (hasAlpha(rgba)) {
		return api.options.alphaFormat === 'hex' ?
			hexToString(rgba) : api.print(api.options.alphaFormat, rgba)
	}

	return hexToString(rgba)
}
