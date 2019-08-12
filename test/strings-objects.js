import test from 'ava'

import conversions from './_conversions'
import {colorObjectMatch, colorStringLimitDiff} from './_macros'

import {tinycolor} from '..'

conversions.forEach(c => {
	const tiny = tinycolor(c.hex)
	test('HSL Object', colorObjectMatch, tiny, tiny.toHsl())
	test('HSV Object', colorObjectMatch, tiny, tiny.toHsv())
	test('RGB Object', colorObjectMatch, tiny, tiny.toRgb())
	test('PRGB Object', colorStringLimitDiff, tiny, tiny.toPercentageRgb(), 2)
	test('HSL String', colorStringLimitDiff, tiny, tiny.toHslString(), 2)
	test('HSV String', colorStringLimitDiff, tiny, tiny.toHsvString(), 2)
	test('RGB String', colorObjectMatch, tiny, tiny.toRgbString())
	test('PRGB String', colorStringLimitDiff, tiny, tiny.toPercentageRgbString(), 2)
	test('Object', colorObjectMatch, tiny, tiny)
})
