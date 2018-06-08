import test from 'ava'
import {tinycolor} from '..'

test('getBrightness', t => {
	t.is(tinycolor('#000').getBrightness(), 0, 'returns 0 for #000')
	t.is(tinycolor('#fff').getBrightness(), 255, 'returns 255 for #fff')
})

test('getLuminance', t => {
	t.is(tinycolor('#000').getLuminance(), 0, 'returns 0 for #000')
	t.is(tinycolor('#fff').getLuminance(), 1, 'returns 1 for #fff')
})

test('isDark returns true/false for dark/light colors', t => {
	t.true(tinycolor('#000').isDark(), '#000 is dark')
	t.true(tinycolor('#111').isDark(), '#111 is dark')
	t.true(tinycolor('#222').isDark(), '#222 is dark')
	t.true(tinycolor('#333').isDark(), '#333 is dark')
	t.true(tinycolor('#444').isDark(), '#444 is dark')
	t.true(tinycolor('#555').isDark(), '#555 is dark')
	t.true(tinycolor('#666').isDark(), '#666 is dark')
	t.true(tinycolor('#777').isDark(), '#777 is dark')
	t.false(tinycolor('#888').isDark(), '#888 is not dark')
	t.false(tinycolor('#999').isDark(), '#999 is not dark')
	t.false(tinycolor('#aaa').isDark(), '#aaa is not dark')
	t.false(tinycolor('#bbb').isDark(), '#bbb is not dark')
	t.false(tinycolor('#ccc').isDark(), '#ccc is not dark')
	t.false(tinycolor('#ddd').isDark(), '#ddd is not dark')
	t.false(tinycolor('#eee').isDark(), '#eee is not dark')
	t.false(tinycolor('#fff').isDark(), '#fff is not dark')
})

test('isLight returns true/false for light/dark colors', t => {
	t.false(tinycolor('#000').isLight(), '#000 is not light')
	t.false(tinycolor('#111').isLight(), '#111 is not light')
	t.false(tinycolor('#222').isLight(), '#222 is not light')
	t.false(tinycolor('#333').isLight(), '#333 is not light')
	t.false(tinycolor('#444').isLight(), '#444 is not light')
	t.false(tinycolor('#555').isLight(), '#555 is not light')
	t.false(tinycolor('#666').isLight(), '#666 is not light')
	t.false(tinycolor('#777').isLight(), '#777 is not light')
	t.true(tinycolor('#888').isLight(), '#888 is light')
	t.true(tinycolor('#999').isLight(), '#999 is light')
	t.true(tinycolor('#aaa').isLight(), '#aaa is light')
	t.true(tinycolor('#bbb').isLight(), '#bbb is light')
	t.true(tinycolor('#ccc').isLight(), '#ccc is light')
	t.true(tinycolor('#ddd').isLight(), '#ddd is light')
	t.true(tinycolor('#eee').isLight(), '#eee is light')
	t.true(tinycolor('#fff').isLight(), '#fff is light')
})
