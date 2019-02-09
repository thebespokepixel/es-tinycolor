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
		hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
		hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
	}
})()

function hexToRgba(color) {
	let match
	if ((match = matchers.hex4.exec(color))) {
		const a = convertHexToDecimal(`${match[4]}${match[4]}`)
		const [r, g, b] = match.splice(1, 3).map(h => `${h}${h}`).map(convertHexToInt)
		return {r, g, b, a}
	}

	if ((match = matchers.hex8.exec(color))) {
		const a = convertHexToDecimal(match[4])
		const [r, g, b] = match.splice(1, 3).map(convertHexToInt)
		return {r, g, b, a}
	}

	return false
}

const hexToString = (rgba, short = api.opts.shortHex) => `#${api.opts.upperCaseHex ?
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
		return api.opts.alphaFormat === 'hex' ?
			hexToString(rgba) : api.print(api.opts.alphaFormat, rgba)
	}

	return hexToString(rgba)
}
