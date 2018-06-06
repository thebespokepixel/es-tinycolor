
import test from 'ava'
import {tinycolor} from '../lib'

test('Invalid alpha should normalize to 1', t => {
	t.is(tinycolor({r: 255, g: 20, b: 10, a: -1}).toRgbString(), 'rgb(255, 20, 10)', 'Negative value')
	t.is(tinycolor({r: 255, g: 20, b: 10, a: -0}).toRgbString(), 'rgba(255, 20, 10, 0)', 'Negative 0')
	t.is(tinycolor({r: 255, g: 20, b: 10, a: 0}).toRgbString(), 'rgba(255, 20, 10, 0)', '0')
	t.is(tinycolor({r: 255, g: 20, b: 10, a: 0.5}).toRgbString(), 'rgba(255, 20, 10, 0.5)', '.5')
	t.is(tinycolor({r: 255, g: 20, b: 10, a: 1}).toRgbString(), 'rgb(255, 20, 10)', '1')
	t.is(tinycolor({r: 255, g: 20, b: 10, a: 100}).toRgbString(), 'rgb(255, 20, 10)', 'Greater than 1')
	t.is(tinycolor({r: 255, g: 20, b: 10, a: 'asdfasd'}).toRgbString(), 'rgb(255, 20, 10)', 'Non Numeric')

	t.is(tinycolor('#fff').toRgbString(), 'rgb(255, 255, 255)', 'Hex should be 1')
	t.is(tinycolor('rgba 255 0 0 100').toRgbString(), 'rgb(255, 0, 0)', 'Greater than 1 in string parsing')
})

test('toString() with alpha set', t => {
	const redNamed = tinycolor.fromRatio({r: 255, g: 0, b: 0, a: 0.6}, {format: 'name'})
	const transparentNamed = tinycolor.fromRatio({r: 255, g: 0, b: 0, a: 0}, {format: 'name'})
	const redHex = tinycolor.fromRatio({r: 255, g: 0, b: 0, a: 0.4}, {format: 'hex'})

	t.is(redNamed.getFormat(), 'name', 'getFormat() is correct')
	t.is(redHex.getFormat(), 'hex', 'getFormat() is correct')

	t.is(redNamed.toString(), 'rgba(255, 0, 0, 0.6)', 'Names should default to rgba if alpha is < 1')
	t.is(redHex.toString(), 'rgba(255, 0, 0, 0.4)', 'Hex should default to rgba if alpha is < 1')

	t.is(redNamed.toString('hex'), '#ff0000', 'Names should not be returned as rgba if format is specified')
	t.is(redNamed.toString('hex6'), '#ff0000', 'Names should not be returned as rgba if format is specified')
	t.is(redNamed.toString('hex3'), '#f00', 'Names should not be returned as rgba if format is specified')
	t.is(redNamed.toString('hex8'), '#ff000099', 'Names should not be returned as rgba if format is specified')
	t.is(redNamed.toString('hex4'), '#f009', 'Names should not be returned as rgba if format is specified')
	t.is(redNamed.toString('name'), '#ff0000', 'Semi transparent names should return hex in toString() if name format is specified')

	t.is(redNamed.toName(), false, 'Semi transparent names should be false in toName()')

	t.is(redHex.toString(), 'rgba(255, 0, 0, 0.4)', 'Hex should default to rgba if alpha is < 1')
	t.is(transparentNamed.toString(), 'transparent', 'Named color should equal transparent if alpha == 0')

	redHex.setAlpha(0)
	t.is(redHex.toString(), 'rgba(255, 0, 0, 0)', 'Hex should default to rgba if alpha is = 0')
})

test('setting alpha', t => {
	const hexSetter = tinycolor('rgba(255, 0, 0, 1)')
	t.is(hexSetter.getAlpha(), 1, 'Alpha should start as 1')
	const returnedFromSetAlpha = hexSetter.setAlpha(0.9)
	t.is(returnedFromSetAlpha, hexSetter, 'setAlpha return value should be the color.')
	t.is(hexSetter.getAlpha(), 0.9, 'setAlpha should change alpha value')
	hexSetter.setAlpha(0.5)
	t.is(hexSetter.getAlpha(), 0.5, 'setAlpha should change alpha value')
	hexSetter.setAlpha(0)
	t.is(hexSetter.getAlpha(), 0, 'setAlpha should change alpha value')
	hexSetter.setAlpha(-1)
	t.is(hexSetter.getAlpha(), 1, 'setAlpha with value < 0 should be bound to 1')
	hexSetter.setAlpha(2)
	t.is(hexSetter.getAlpha(), 1, 'setAlpha with value > 1 should be bound to 1')
	hexSetter.setAlpha()
	t.is(hexSetter.getAlpha(), 1, 'setAlpha with invalid value should be bound to 1')
	hexSetter.setAlpha(null)
	t.is(hexSetter.getAlpha(), 1, 'setAlpha with invalid value should be bound to 1')
	hexSetter.setAlpha('test')
	t.is(hexSetter.getAlpha(), 1, 'setAlpha with invalid value should be bound to 1')
})

test('Alpha = 0 should act differently on toName()', t => {
	t.is(tinycolor({r: 255, g: 20, b: 10, a: 0}).toName(), 'transparent', '0')
	t.is(tinycolor('transparent').toString(), 'transparent', 'toString when passed')
	t.is(tinycolor('transparent').toHex(), '000000', 'toHex')
})

