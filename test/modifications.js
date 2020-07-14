/* eslint array-element-newline:0 */

import test from 'ava'
import {tinycolor} from '..'

/* Originally generated with:
const results = []
for (const i = 0; i <= 100; i++) results.push( tinycolor.saturate('red', i).toHex() )
console.log(JSON.stringify(results))
*/

const DESATURATIONS = [
	'ff0000', 'fe0101', 'fc0303', 'fb0404', 'fa0505', 'f90606', 'f70808', 'f60909',
	'f50a0a', 'f40b0b', 'f20d0d', 'f10e0e', 'f00f0f', 'ee1111', 'ed1212', 'ec1313',
	'eb1414', 'e91616', 'e81717', 'e71818', 'e61919', 'e41b1b', 'e31c1c', 'e21d1d',
	'e01f1f', 'df2020', 'de2121', 'dd2222', 'db2424', 'da2525', 'd92626', 'd72828',
	'd62929', 'd52a2a', 'd42b2b', 'd22d2d', 'd12e2e', 'd02f2f', 'cf3030', 'cd3232',
	'cc3333', 'cb3434', 'c93636', 'c83737', 'c73838', 'c63939', 'c43b3b', 'c33c3c',
	'c23d3d', 'c13e3e', 'bf4040', 'be4141', 'bd4242', 'bb4444', 'ba4545', 'b94646',
	'b84747', 'b64949', 'b54a4a', 'b44b4b', 'b34d4d', 'b14e4e', 'b04f4f', 'af5050',
	'ad5252', 'ac5353', 'ab5454', 'aa5555', 'a85757', 'a75858', 'a65959', 'a45b5b',
	'a35c5c', 'a25d5d', 'a15e5e', '9f6060', '9e6161', '9d6262', '9c6363', '9a6565',
	'996666', '986767', '966969', '956a6a', '946b6b', '936c6c', '916e6e', '906f6f',
	'8f7070', '8e7171', '8c7373', '8b7474', '8a7575', '887777', '877878', '867979',
	'857a7a', '837c7c', '827d7d', '817e7e', '808080'
]

const SATURATIONS = [
	'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000',
	'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000',
	'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000',
	'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000',
	'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000',
	'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000',
	'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000',
	'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000',
	'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000',
	'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000',
	'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000',
	'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000',
	'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000'
]

const LIGHTENS = [
	'ff0000', 'ff0505', 'ff0a0a', 'ff0f0f', 'ff1414', 'ff1a1a', 'ff1f1f', 'ff2424',
	'ff2929', 'ff2e2e', 'ff3333', 'ff3838', 'ff3d3d', 'ff4242', 'ff4747', 'ff4d4d',
	'ff5252', 'ff5757', 'ff5c5c', 'ff6161', 'ff6666', 'ff6b6b', 'ff7070', 'ff7575',
	'ff7a7a', 'ff8080', 'ff8585', 'ff8a8a', 'ff8f8f', 'ff9494', 'ff9999', 'ff9e9e',
	'ffa3a3', 'ffa8a8', 'ffadad', 'ffb3b3', 'ffb8b8', 'ffbdbd', 'ffc2c2', 'ffc7c7',
	'ffcccc', 'ffd1d1', 'ffd6d6', 'ffdbdb', 'ffe0e0', 'ffe5e5', 'ffebeb', 'fff0f0',
	'fff5f5', 'fffafa', 'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff',
	'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff',
	'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff',
	'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff',
	'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff',
	'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff',
	'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff'
]

const BRIGHTENS = [
	'ff0000', 'ff0303', 'ff0505', 'ff0808', 'ff0a0a', 'ff0d0d', 'ff0f0f', 'ff1212',
	'ff1414', 'ff1717', 'ff1919', 'ff1c1c', 'ff1f1f', 'ff2121', 'ff2424', 'ff2626',
	'ff2929', 'ff2b2b', 'ff2e2e', 'ff3030', 'ff3333', 'ff3636', 'ff3838', 'ff3b3b',
	'ff3d3d', 'ff4040', 'ff4242', 'ff4545', 'ff4747', 'ff4a4a', 'ff4c4c', 'ff4f4f',
	'ff5252', 'ff5454', 'ff5757', 'ff5959', 'ff5c5c', 'ff5e5e', 'ff6161', 'ff6363',
	'ff6666', 'ff6969', 'ff6b6b', 'ff6e6e', 'ff7070', 'ff7373', 'ff7575', 'ff7878',
	'ff7a7a', 'ff7d7d', 'ff7f7f', 'ff8282', 'ff8585', 'ff8787', 'ff8a8a', 'ff8c8c',
	'ff8f8f', 'ff9191', 'ff9494', 'ff9696', 'ff9999', 'ff9c9c', 'ff9e9e', 'ffa1a1',
	'ffa3a3', 'ffa6a6', 'ffa8a8', 'ffabab', 'ffadad', 'ffb0b0', 'ffb2b2', 'ffb5b5',
	'ffb8b8', 'ffbaba', 'ffbdbd', 'ffbfbf', 'ffc2c2', 'ffc4c4', 'ffc7c7', 'ffc9c9',
	'ffcccc', 'ffcfcf', 'ffd1d1', 'ffd4d4', 'ffd6d6', 'ffd9d9', 'ffdbdb', 'ffdede',
	'ffe0e0', 'ffe3e3', 'ffe5e5', 'ffe8e8', 'ffebeb', 'ffeded', 'fff0f0', 'fff2f2',
	'fff5f5', 'fff7f7', 'fffafa', 'fffcfc', 'ffffff'
]

const DARKENS = [
	'ff0000', 'fa0000', 'f50000', 'f00000', 'eb0000', 'e60000', 'e00000', 'db0000',
	'd60000', 'd10000', 'cc0000', 'c70000', 'c20000', 'bd0000', 'b80000', 'b30000',
	'ad0000', 'a80000', 'a30000', '9e0000', '990000', '940000', '8f0000', '8a0000',
	'850000', '800000', '7a0000', '750000', '700000', '6b0000', '660000', '610000',
	'5c0000', '570000', '520000', '4d0000', '470000', '420000', '3d0000', '380000',
	'330000', '2e0000', '290000', '240000', '1f0000', '190000', '140000', '0f0000',
	'0a0000', '050000', '000000', '000000', '000000', '000000', '000000', '000000',
	'000000', '000000', '000000', '000000', '000000', '000000', '000000', '000000',
	'000000', '000000', '000000', '000000', '000000', '000000', '000000', '000000',
	'000000', '000000', '000000', '000000', '000000', '000000', '000000', '000000',
	'000000', '000000', '000000', '000000', '000000', '000000', '000000', '000000',
	'000000', '000000', '000000', '000000', '000000', '000000', '000000', '000000',
	'000000', '000000', '000000', '000000', '000000'
]

test('Modifications', t => {
	t.plan(509)
	for (let i = 0; i <= 100; i++) {
		t.is(tinycolor('red').desaturate(i).toHex(), DESATURATIONS[i], `Desaturation ${i} works`)
	}

	for (let i = 0; i <= 100; i++) {
		t.is(tinycolor('red').saturate(i).toHex(), SATURATIONS[i], `Saturation ${i} works`)
	}

	for (let i = 0; i <= 100; i++) {
		t.is(tinycolor('red').lighten(i).toHex(), LIGHTENS[i], `Lighten ${i} works`)
	}

	for (let i = 0; i <= 100; i++) {
		t.is(tinycolor('red').brighten(i).toHex(), BRIGHTENS[i], `Brighter ${i} works`)
	}

	for (let i = 0; i <= 100; i++) {
		t.is(tinycolor('red').darken(i).toHex(), DARKENS[i], `Darken ${i} works`)
	}

	t.is(tinycolor('red').invert().toHex(), '00ffff', 'Invert `red` works')
	t.is(tinycolor('#808080').invert().toHex(), '7f7f7f', 'Invert `#808080` works')
	t.is(tinycolor('hsl(36, 10, 10)').invert().toHex(), 'e3e5e8', 'Invert `hsl(36, 10, 10)` works')

	t.is(tinycolor('red').greyscale().toHex(), '808080', 'Greyscale works')
})

test('Spin', t => {
	t.plan(457)
	t.is(Math.round(tinycolor('#f00').spin(-1234).toHsl().h), 206, 'Spinning -1234 works')
	t.is(Math.round(tinycolor('#f00').spin(-360).toHsl().h), 0, 'Spinning -360 works')
	t.is(Math.round(tinycolor('#f00').spin(-120).toHsl().h), 240, 'Spinning -120 works')
	t.is(Math.round(tinycolor('#f00').spin(0).toHsl().h), 0, 'Spinning 0 works')
	t.is(Math.round(tinycolor('#f00').spin(10).toHsl().h), 10, 'Spinning 10 works')
	t.is(Math.round(tinycolor('#f00').spin(360).toHsl().h), 0, 'Spinning 360 works')
	t.is(Math.round(tinycolor('#f00').spin(2345).toHsl().h), 185, 'Spinning 2345 works');

	[-360, 0, 360].forEach(delta => {
		Object.keys(tinycolor.names).forEach(name => {
			t.is(tinycolor(name).toHex(), tinycolor(name).spin(delta).toHex(), `Spinning ${delta.toString()} has no effect`)
		})
	})
})

test('Mix', t => {
	t.plan(503)
	// Amount 0 or none
	t.is(tinycolor.mix('#000', '#fff').toHsl().l, 0.5, 'Mixing without amount works')
	t.is(tinycolor.mix('#f00', '#000', 0).toHex(), 'ff0000', 'Mixing with 0 amount works')
	// This case checks the the problem with floating point numbers (eg 255/90)
	t.is(tinycolor.mix('#fff', '#000', 90).toHex(), '1a1a1a', 'Mixing with 90 amount works correctly')

	// Black and white
	for (let i = 0; i < 100; i++) {
		t.is(Math.round(tinycolor.mix('#000', '#fff', i).toHsl().l * 100) / 100, i / 100, `Mixing black and white with ${i} amount works`)
	}

	// With colors
	for (let i = 0; i < 100; i++) {
		let newHex = Math.round((255 * (100 - i)) / 100).toString(16)

		newHex = newHex.length === 1 ? `0${newHex}` : newHex

		t.is(tinycolor.mix('#f00', '#000', i).toHex(), `${newHex}0000`, `Mixing ${i} (red channel)`)
		t.is(tinycolor.mix('#0f0', '#000', i).toHex(), `00${newHex}00`, `Mixing ${i} (green channel)`)
		t.is(tinycolor.mix('#00f', '#000', i).toHex(), `0000${newHex}`, `Mixing ${i} (blue channel)`)
		t.is(tinycolor.mix(tinycolor('transparent'), '#000', i).toRgb().a, i / 100, `Mixing ${i} (alpha channel)`)
	}
})
