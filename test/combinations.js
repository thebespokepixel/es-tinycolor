
import test from 'ava'
import {tinycolor} from '../lib'

// The combination tests need to be expanded further
function colorsToHexString(colors) {
	return colors.map(c => c.toHex()).join(',')
}

test('complement', t => {
	const complementDoesntModifyInstance = tinycolor('red')
	t.is(complementDoesntModifyInstance.complement().toHex(), '00ffff', 'Complement works')
	t.is(complementDoesntModifyInstance.toHex(), 'ff0000', 'Complement did not modify this color')
})

test('analogous', t => {
	const combination = tinycolor('red').analogous()
	t.is(colorsToHexString(combination), 'ff0000,ff0066,ff0033,ff0000,ff3300,ff6600', 'Correct Combination')
})

test('monochromatic', t => {
	const combination = tinycolor('red').monochromatic()
	t.is(colorsToHexString(combination), 'ff0000,2a0000,550000,800000,aa0000,d40000', 'Correct Combination')
})

test('splitcomplement', t => {
	const combination = tinycolor('red').splitcomplement()
	t.is(colorsToHexString(combination), 'ff0000,ccff00,0066ff', 'Correct Combination')
})

test('triad', t => {
	const combination = tinycolor('red').triad()
	t.is(colorsToHexString(combination), 'ff0000,00ff00,0000ff', 'Correct Combination')
})

test('tetrad', t => {
	const combination = tinycolor('red').tetrad()
	t.is(colorsToHexString(combination), 'ff0000,80ff00,00ffff,7f00ff', 'Correct Combination')
})
