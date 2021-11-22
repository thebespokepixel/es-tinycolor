import test from 'ava'

import {tinycolor} from '../esm/index.js'
import conversions from './_conversions.js'
import {colorObjectMatch, colorStringLimitDiff} from './_macros.js'

for (const c of conversions) {
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
}
