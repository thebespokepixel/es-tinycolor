import test from 'ava'

import {tinycolor} from '../esm/index.js'
import conversions from './_conversions.js'
import {colorValid, colorEquals} from './_macros.js'

for (const c of conversions) {
	const tiny = tinycolor(c.hex)
	test(`Testing ${c.hex}`, colorValid, tiny)
	test(`${c.hex}: RGB = HEX`, colorEquals, c.rgb, c.hex)
	test(`${c.hex}: RGB = HEX8`, colorEquals, c.rgb, c.hex8)
	test(`${c.hex}: RGB = HSL`, colorEquals, c.rgb, c.hsl)
	test(`${c.hex}: RGB = HSV`, colorEquals, c.rgb, c.hsv)
	test(`${c.hex}: RGB = RGB`, colorEquals, c.rgb, c.rgb)
	test(`${c.hex}: HEX = HEX`, colorEquals, c.hex, c.hex)
	test(`${c.hex}: HEX = HEX8`, colorEquals, c.hex, c.hex8)
	test(`${c.hex}: HEX = HSL`, colorEquals, c.hex, c.hsl)
	test(`${c.hex}: HEX = HSV`, colorEquals, c.hex, c.hsv)
	test(`${c.hex}: HSL = HSV`, colorEquals, c.hsl, c.hsv)
}
