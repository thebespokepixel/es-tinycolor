
import test from 'ava'
import {tinycolor} from '../lib'

test('With Ratio', t => {
	t.is(tinycolor.fromRatio({r: 1, g: 1, b: 1}).toHexString(), '#ffffff', 'white')
	t.is(tinycolor.fromRatio({r: 1, g: 0, b: 0, a: 0.5}).toRgbString(), 'rgba(255, 0, 0, 0.5)', 'alpha works when ratio is parsed')
	t.is(tinycolor.fromRatio({r: 1, g: 0, b: 0, a: 1}).toRgbString(), 'rgb(255, 0, 0)', 'alpha = 1 works when ratio is parsed')
	t.is(tinycolor.fromRatio({r: 1, g: 0, b: 0, a: 10}).toRgbString(), 'rgb(255, 0, 0)', 'alpha > 1 works when ratio is parsed')
	t.is(tinycolor.fromRatio({r: 1, g: 0, b: 0, a: -1}).toRgbString(), 'rgb(255, 0, 0)', 'alpha < 1 works when ratio is parsed')
})

test('Without Ratio', t => {
	t.is(tinycolor({r: 1, g: 1, b: 1}).toHexString(), '#010101', '010101')
	t.is(tinycolor({r: 0.1, g: 0.1, b: 0.1}).toHexString(), '#000000', '000000')
	t.is(tinycolor('rgb 0.1 0.1 0.1').toHexString(), '#000000', '000000')
})
