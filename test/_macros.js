const util = require('util')
const {tinycolor} = require('..')

function pretty(obj) {
	return util.inspect(obj, {depth: 1, colors: true})
}

function colorValid(t, tiny) {
	t.true(tiny.isValid(), 'Color is not valid.')
}
colorValid.title = (title, tiny) => `${title}: ${tiny.toRgbString()} ${tiny.toPercentageRgbString()} ${tiny.toHsvString()} ${tiny.toHslString()} ${tiny.toHexString()}`

function colorObjectMatch(t, tiny, color) {
	t.is(tiny.toHexString(), tinycolor(color).toHexString(), 'Objects do not match.')
}
colorObjectMatch.title = (title, tiny, color) => `${title}: ${tiny.toHexString()} = ${tinycolor(color).toHexString()}'s identity`

function colorStringLimitDiff(t, tiny, target, max) {
	const input = tiny.toRgbArray()
	const output = tinycolor(target).toRgbArray()

	t.plan(3)
	t.true(Math.abs(input[0] - output[0]) <= max, `red value difference <= ${max}`)
	t.true(Math.abs(input[1] - output[1]) <= max, `green value difference <= ${max}`)
	t.true(Math.abs(input[2] - output[2]) <= max, `blue value difference <= ${max})`)
}
colorStringLimitDiff.title = (title, tiny, target, max) => `${title}: Set |${pretty(tiny.toRgbArray())} - ${pretty(tinycolor(target).toRgbArray())}| < ${max * 3}`

function colorEquals(t, colorA, colorB) {
	t.true(tinycolor.equals(colorA, colorB), `Colors are not equal.`)
}
colorEquals.title = (title, colorA, colorB) => `${title}: (${pretty(colorA)} = ${pretty(colorB)})`

function colorStringMatch(t, color, string) {
	t.is(tinycolor(color).toRgbString(), string, `Input.toRGBString and string do not match.`)
}
colorStringMatch.title = (title, color, string) => `${title}: (${tinycolor(color).toRgbString()} = ${string})`

module.exports = {colorValid, colorEquals, colorObjectMatch, colorStringLimitDiff, colorStringMatch}
