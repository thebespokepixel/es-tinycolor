import test from 'ava'
import {tinycolor} from '../esm/index.js'

test('Color equality', t => {
	t.true(tinycolor.equals('#ff0000', '#ff0000'), 'Same hex')
	t.true(tinycolor.equals('#ff0000', 'rgb(255, 0, 0)'), 'Same alphas')
	t.false(tinycolor.equals('#ff0000', 'rgba(255, 0, 0, .1)'), 'Different alphas')
	t.true(tinycolor.equals('#ff000066', 'rgba(255, 0, 0, .4)'), 'Same alphas')
	t.true(tinycolor.equals('#f009', 'rgba(255, 0, 0, .6)'), 'Same alphas')
	t.true(tinycolor.equals('#336699CC', '369C'), 'Same hex')
	t.true(tinycolor.equals('ff0000', '#ff0000'), 'Same hex')
	t.true(tinycolor.equals('#f00', '#ff0000'), 'Same hex')
	t.true(tinycolor.equals('#f00', '#ff0000'), 'Same hex')
	t.true(tinycolor.equals('f00', '#ff0000'), 'Same hex')
	t.is(tinycolor('010101').toHexString(), '#010101')
	t.false(tinycolor.equals('#ff0000', '#00ff00'), 'Different hex')
	t.true(tinycolor.equals('#ff8000', 'rgb(100%, 50%, 0%)'), 'Percentage bounds checking')
})

test('isReadable', t => {
	// '#ff0088', '#8822aa' (values used in old WCAG1 tests)
	t.true(tinycolor.isReadable('#000000', '#ffffff', {level: 'AA', size: 'small'}), 'white/black is readable')
	t.false(tinycolor.isReadable('#ff0088', '#5c1a72', {}), 'not readable - empty wcag2 object')
	t.false(tinycolor.isReadable('#ff0088', '#8822aa', {level: 'AA', size: 'small'}), 'not readable - AA small')
	t.false(tinycolor.isReadable('#ff0088', '#8822aa', {level: 'AA', size: 'large'}), 'not  readable - AA large')
	t.false(tinycolor.isReadable('#ff0088', '#8822aa', {level: 'AAA', size: 'small'}), 'not readable - AAA small')
	t.false(tinycolor.isReadable('#ff0088', '#8822aa', {level: 'AAA', size: 'large'}), 'not readable - AAA large')

	// Values derived from and validated using the calculators at http://www.dasplankton.de/ContrastA/
	// and http://webaim.org/resources/contrastchecker/

	// '#ff0088', '#5c1a72': contrast ratio 3.04
	t.false(tinycolor.isReadable('#ff0088', '#5c1a72', {level: 'AA', size: 'small'}), 'not readable - AA small')
	t.true(tinycolor.isReadable('#ff0088', '#5c1a72', {level: 'AA', size: 'large'}), 'readable - AA large')
	t.false(tinycolor.isReadable('#ff0088', '#5c1a72', {level: 'AAA', size: 'small'}), 'not readable - AAA small')
	t.false(tinycolor.isReadable('#ff0088', '#5c1a72', {level: 'AAA', size: 'large'}), 'not readable - AAA large')

	// '#ff0088', '#2e0c3a': contrast ratio 4.56
	t.true(tinycolor.isReadable('#ff0088', '#2e0c3a', {level: 'AA', size: 'small'}), 'readable - AA small')
	t.true(tinycolor.isReadable('#ff0088', '#2e0c3a', {level: 'AA', size: 'large'}), 'readable - AA large')
	t.false(tinycolor.isReadable('#ff0088', '#2e0c3a', {level: 'AAA', size: 'small'}), 'not readable - AAA small')
	t.true(tinycolor.isReadable('#ff0088', '#2e0c3a', {level: 'AAA', size: 'large'}), 'readable - AAA large')

	// '#db91b8', '#2e0c3a':  contrast ratio 7.12
	t.true(tinycolor.isReadable('#db91b8', '#2e0c3a', {level: 'AA', size: 'small'}), 'readable - AA small')
	t.true(tinycolor.isReadable('#db91b8', '#2e0c3a', {level: 'AA', size: 'large'}), 'readable - AA large')
	t.true(tinycolor.isReadable('#db91b8', '#2e0c3a', {level: 'AAA', size: 'small'}), 'readable - AAA small')
	t.true(tinycolor.isReadable('#db91b8', '#2e0c3a', {level: 'AAA', size: 'large'}), 'readable - AAA large')
})

test('readability', t => {
	// Check return values from readability function. See isReadable above for standards tests.
	t.is(tinycolor.readability('#000', '#000'), 1, 'Readability function test 0')
	t.is(tinycolor.readability('#000', '#111'), 1.112_107_832_484_054_5, 'Readability function test 1')
	t.is(tinycolor.readability('#000', '#fff'), 21, 'Readability function test 2')
})

test('mostReadable', t => {
	t.is(tinycolor.mostReadable('#000', ['#111', '#222'], {wcag2: {}}).toHexString(), '#222222', 'readable color present')
	t.is(tinycolor.mostReadable('#f00', ['#d00', '#0d0'], {wcag2: {}}).toHexString(), '#00dd00', 'readable color present')
	t.is(tinycolor.mostReadable('#fff', ['#fff', '#fff'], {wcag2: {}}).toHexString(), '#ffffff', 'no different color in list')

	// With includeFallbackColors
	t.is(tinycolor.mostReadable('#fff', ['#fff', '#fff'], {includeFallbackColors: true}).toHexString(), '#000000', 'no different color in list')
	t.is(tinycolor.mostReadable('#123', ['#124', '#125'], {includeFallbackColors: false}).toHexString(), '#112255', 'no readable color in list')
	t.is(tinycolor.mostReadable('#123', ['#000', '#fff'], {includeFallbackColors: false}).toHexString(), '#ffffff', 'verify assumption')
	t.is(tinycolor.mostReadable('#123', ['#124', '#125'], {includeFallbackColors: true}).toHexString(), '#ffffff', 'no readable color in list')

	t.is(tinycolor.mostReadable('#ff0088', ['#000', '#fff'], {includeFallbackColors: false}).toHexString(), '#000000', 'verify assumption')
	t.is(tinycolor.mostReadable('#ff0088', ['#2e0c3a'], {includeFallbackColors: true, level: 'AAA', size: 'large'}).toHexString(), '#2e0c3a', 'readable color present')
	t.is(tinycolor.mostReadable('#ff0088', ['#2e0c3a'], {includeFallbackColors: true, level: 'AAA', size: 'small'}).toHexString(), '#000000', 'no readable color in list')

	t.is(tinycolor.mostReadable('#371b2c', ['#000', '#fff'], {includeFallbackColors: false}).toHexString(), '#ffffff', 'verify assumption')
	t.is(tinycolor.mostReadable('#371b2c', ['#a9acb6'], {includeFallbackColors: true, level: 'AAA', size: 'large'}).toHexString(), '#a9acb6', 'readable color present')
	t.is(tinycolor.mostReadable('#371b2c', ['#a9acb6'], {includeFallbackColors: true, level: 'AAA', size: 'small'}).toHexString(), '#ffffff', 'no readable color in list')
})

