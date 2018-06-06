/* eslint new-cap: 0 */
import test from 'ava'
import {tinycolor} from '../lib'

test('TinyColor initialization', t => {
	t.false(typeof tinycolor === 'undefined', 'tinycolor is initialized on the page')
	t.true(typeof tinycolor('red') === 'object', 'tinycolor is able to be instantiated')

	const r = tinycolor('red')
	t.true(tinycolor(r) === r, 'when given a tinycolor instance, tinycolor() returns it')
	t.true(new tinycolor(r) === r, 'when given a tinycolor instance, new tinycolor() returns it')
	t.is(tinycolor('red', {format: 'hex'}).toString(), '#ff0000', 'tinycolor options are being parsed')
	t.is(tinycolor.fromRatio({r: 1, g: 0, b: 0}, {format: 'hex'}).toString(), '#ff0000', 'tinycolor options are being parsed')

	const obj = {h: 180, s: 0.5, l: 0.5}
	const color = tinycolor(obj)
	t.true(obj.s === 0.5, 'when given an object, the original object is not modified…')
	t.true(color.getOriginalInput().s === 0.5, '…original object is returned from new instance.')
})

test('Original input', t => {
	const colorRgbUp = 'RGB(39, 39, 39)'
	const colorRgbLow = 'rgb(39, 39, 39)'
	const colorRgbMix = 'RgB(39, 39, 39)'
	const tinycolorObj = tinycolor(colorRgbMix)
	const inputObj = {r: 100, g: 100, b: 100}

	t.true(tinycolor(colorRgbLow).getOriginalInput() === colorRgbLow, 'original lowercase input is returned')
	t.true(tinycolor(colorRgbUp).getOriginalInput() === colorRgbUp, 'original uppercase input is returned')
	t.true(tinycolor(colorRgbMix).getOriginalInput() === colorRgbMix, 'original mixed input is returned')
	t.true(tinycolor(tinycolorObj).getOriginalInput() === colorRgbMix, 'when given a tinycolor instance, the color string is returned')
	t.true(tinycolor(inputObj).getOriginalInput() === inputObj, 'when given an object, the object is returned')
	t.true(new tinycolor('').getOriginalInput() === '', 'when given an empty string, an empty string is returned')
	t.true(new tinycolor(null).getOriginalInput() === '', 'when given a null value, an empty string is returned')
})

test('Cloning color', t => {
	const originalColor = tinycolor('red')
	const originalColorRgbString = originalColor.toRgbString()

	const clonedColor = originalColor.clone()
	t.true(clonedColor.toRgbString() === originalColor.toRgbString(), 'cloned color is identical')

	clonedColor.setAlpha(0.5)
	t.true(clonedColor.toRgbString() !== originalColor.toRgbString(), 'cloned color is changing independently from original color')
	t.true(originalColorRgbString === originalColor.toRgbString(), 'original color was not changed by cloned color change')
})
