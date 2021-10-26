import test from 'ava'
import {tinycolor} from '../index.js'

test('RGB Text Parsing', t => {
	t.is(tinycolor('rgb 255 0 0').toHexString(), '#ff0000', 'spaced input')
	t.is(tinycolor('rgb(255, 0, 0)').toHexString(), '#ff0000', 'parenthesized input')
	t.is(tinycolor('rgb (255, 0, 0)').toHexString(), '#ff0000', 'parenthesized spaced input')
	t.is(tinycolor({r: 255, g: 0, b: 0}).toHexString(), '#ff0000', 'object input')
	t.deepEqual(tinycolor({r: 255, g: 0, b: 0}).toRgb(), {r: 255, g: 0, b: 0, a: 1}, 'object input and compare')

	t.true(tinycolor.equals({r: 200, g: 100, b: 0}, 'rgb(200, 100, 0)'))
	t.true(tinycolor.equals({r: 200, g: 100, b: 0}, 'rgb 200 100 0'))
	t.true(tinycolor.equals({r: 200, g: 100, b: 0}, 'rgb 200 100 0'))
	t.true(tinycolor.equals({r: 200, g: 100, b: 0, a: 0.4}, 'rgba 200 100 0 0.4'))
	t.false(tinycolor.equals({r: 199, g: 100, b: 0}, 'rgba 200 100 0 1'))

	t.false(tinycolor.equals({r: 199, g: 100, b: 0}, 'rgb(200, 100, 0)'))
	t.false(tinycolor.equals({r: 199, g: 100, b: 0}, 'rgb 200 100 0'))
	t.false(tinycolor.equals({r: 199, g: 100, b: 0}, 'rgb 200 100 0'))

	t.true(tinycolor.equals(tinycolor({r: 200, g: 100, b: 0}), 'rgb(200, 100, 0)'))
	t.true(tinycolor.equals(tinycolor({r: 200, g: 100, b: 0}), 'rgb 200 100 0'))
	t.true(tinycolor.equals(tinycolor({r: 200, g: 100, b: 0}), 'rgb 200 100 0'))
})

test('Percentage RGB Text Parsing', t => {
	t.is(tinycolor('rgb 100% 0% 0%').toHexString(), '#ff0000', 'spaced input')
	t.is(tinycolor('rgb(100%, 0%, 0%)').toHexString(), '#ff0000', 'parenthesized input')
	t.is(tinycolor('rgb (100%, 0%, 0%)').toHexString(), '#ff0000', 'parenthesized spaced input')
	t.is(tinycolor({r: '100%', g: '0%', b: '0%'}).toHexString(), '#ff0000', 'object input')
	t.deepEqual(tinycolor({r: '100%', g: '0%', b: '0%'}).toRgb(), {r: 255, g: 0, b: 0, a: 1}, 'object input and compare')

	t.true(tinycolor.equals({r: '90%', g: '45%', b: '0%'}, 'rgb(90%, 45%, 0%)'))
	t.true(tinycolor.equals({r: '90%', g: '45%', b: '0%'}, 'rgb 90% 45% 0%'))
	t.true(tinycolor.equals({r: '90%', g: '45%', b: '0%'}, 'rgb 90% 45% 0%'))
	t.true(tinycolor.equals({r: '90%', g: '45%', b: '0%', a: 0.4}, 'rgba 90% 45% 0% 0.4'))
	t.false(tinycolor.equals({r: '89%', g: '45%', b: '0%'}, 'rgba 90% 45% 0% 1'))

	t.false(tinycolor.equals({r: '89%', g: '45%', b: '0%'}, 'rgb(90%, 45%, 0%)'))
	t.false(tinycolor.equals({r: '89%', g: '45%', b: '0%'}, 'rgb 90% 45% 0%'))
	t.false(tinycolor.equals({r: '89%', g: '45%', b: '0%'}, 'rgb 90% 45% 0%'))

	t.true(tinycolor.equals(tinycolor({r: '90%', g: '45%', b: '0%'}), 'rgb(90%, 45%, 0%)'))
	t.true(tinycolor.equals(tinycolor({r: '90%', g: '45%', b: '0%'}), 'rgb 90% 45% 0%'))
	t.true(tinycolor.equals(tinycolor({r: '90%', g: '45%', b: '0%'}), 'rgb 90% 45% 0%'))
})

test('HSL parsing', t => {
	t.is(tinycolor({h: 251, s: 100, l: 0.38}).toHexString(), '#2400c2', 'to hex')
	t.is(tinycolor({h: 251, s: 100, l: 0.38}).toRgbString(), 'rgb(36, 0, 194)', 'to rgb')
	t.is(tinycolor({h: 251, s: 100, l: 0.38}).toHslString(), 'hsl(251, 100%, 38%)', 'to hsl')
	t.is(tinycolor('hsl(251, 100, 38)').toHexString(), '#2400c2', 'to hex')
	t.is(tinycolor('hsl(251, 100%, 38%)').toRgbString(), 'rgb(36, 0, 194)', 'to rgb')
	t.is(tinycolor('hsl(251, 100%, 38%)').toHslString(), 'hsl(251, 100%, 38%)', 'to hsl')
	t.is(tinycolor('hsl 100 20 10').toHslString(), 'hsl(100, 20%, 10%)', 'problematic hsl')
})

test('Hex Parsing', t => {
	t.is(tinycolor('rgb 255 0 0').toHexString(), '#ff0000')
	t.is(tinycolor('rgb 255 0 0').toHexString(true), '#f00')

	t.is(tinycolor('rgba 255 0 0 0.5').toHex8String(), '#ff000080')
	t.is(tinycolor('rgba 255 0 0 0').toHex8String(), '#ff000000')
	t.is(tinycolor('rgba 255 0 0 1').toHex8String(), '#ff0000')
	t.is(tinycolor('rgba 255 0 0 0.8').toHex8String(true), '#f00c')
	t.is(tinycolor('rgba 255 0 0 1').toHex8String(true), '#f00')

	t.is(tinycolor('rgb 255 0 0').toHex(), 'ff0000')
	t.is(tinycolor('rgb 255 0 0').toHex(true), 'f00')
	t.is(tinycolor('rgba 255 0 0 0.5').toHex8(), 'ff000080')
})

test('HSV Parsing', t => {
	t.is(tinycolor('hsv 251.1 0.887 0.918').toHsvString(), 'hsv(251, 89%, 92%)')
	t.is(tinycolor('hsv 251.1 0.887 0.918').toHsvString(), 'hsv(251, 89%, 92%)')
	t.is(tinycolor('hsva 251.1 0.887 0.918 0.5').toHsvString(), 'hsva(251, 89%, 92%, 0.5)')
})

test('Invalid Parsing', t => {
	let invalidColor = tinycolor('this is not a color')
	t.is(invalidColor.toHexString(), '#000000')
	t.is(invalidColor.isValid(), false)

	invalidColor = tinycolor('#red')
	t.is(invalidColor.toHexString(), '#000000')
	t.is(invalidColor.isValid(), false)

	invalidColor = tinycolor('  #red')
	t.is(invalidColor.toHexString(), '#000000')
	t.is(invalidColor.isValid(), false)

	invalidColor = tinycolor('##123456')
	t.is(invalidColor.toHexString(), '#000000')
	t.is(invalidColor.isValid(), false)

	invalidColor = tinycolor('  ##123456')
	t.is(invalidColor.toHexString(), '#000000')
	t.is(invalidColor.isValid(), false)

	invalidColor = tinycolor({r: 'invalid', g: 'invalid', b: 'invalid'})
	t.is(invalidColor.toHexString(), '#000000')
	t.is(invalidColor.isValid(), false)

	invalidColor = tinycolor({h: 'invalid', s: 'invalid', l: 'invalid'})
	t.is(invalidColor.toHexString(), '#000000')
	t.is(invalidColor.isValid(), false)

	invalidColor = tinycolor({h: 'invalid', s: 'invalid', v: 'invalid'})
	t.is(invalidColor.toHexString(), '#000000')
	t.is(invalidColor.isValid(), false)
})

test('Named colors', t => {
	t.is(tinycolor('aliceblue').toHex(), 'f0f8ff')
	t.is(tinycolor('antiquewhite').toHex(), 'faebd7')
	t.is(tinycolor('aqua').toHex(), '00ffff')
	t.is(tinycolor('aquamarine').toHex(), '7fffd4')
	t.is(tinycolor('azure').toHex(), 'f0ffff')
	t.is(tinycolor('beige').toHex(), 'f5f5dc')
	t.is(tinycolor('bisque').toHex(), 'ffe4c4')
	t.is(tinycolor('black').toHex(), '000000')
	t.is(tinycolor('blanchedalmond').toHex(), 'ffebcd')
	t.is(tinycolor('blue').toHex(), '0000ff')
	t.is(tinycolor('blueviolet').toHex(), '8a2be2')
	t.is(tinycolor('brown').toHex(), 'a52a2a')
	t.is(tinycolor('burlywood').toHex(), 'deb887')
	t.is(tinycolor('cadetblue').toHex(), '5f9ea0')
	t.is(tinycolor('chartreuse').toHex(), '7fff00')
	t.is(tinycolor('chocolate').toHex(), 'd2691e')
	t.is(tinycolor('coral').toHex(), 'ff7f50')
	t.is(tinycolor('cornflowerblue').toHex(), '6495ed')
	t.is(tinycolor('cornsilk').toHex(), 'fff8dc')
	t.is(tinycolor('crimson').toHex(), 'dc143c')
	t.is(tinycolor('cyan').toHex(), '00ffff')
	t.is(tinycolor('darkblue').toHex(), '00008b')
	t.is(tinycolor('darkcyan').toHex(), '008b8b')
	t.is(tinycolor('darkgoldenrod').toHex(), 'b8860b')
	t.is(tinycolor('darkgray').toHex(), 'a9a9a9')
	t.is(tinycolor('darkgreen').toHex(), '006400')
	t.is(tinycolor('darkkhaki').toHex(), 'bdb76b')
	t.is(tinycolor('darkmagenta').toHex(), '8b008b')
	t.is(tinycolor('darkolivegreen').toHex(), '556b2f')
	t.is(tinycolor('darkorange').toHex(), 'ff8c00')
	t.is(tinycolor('darkorchid').toHex(), '9932cc')
	t.is(tinycolor('darkred').toHex(), '8b0000')
	t.is(tinycolor('darksalmon').toHex(), 'e9967a')
	t.is(tinycolor('darkseagreen').toHex(), '8fbc8f')
	t.is(tinycolor('darkslateblue').toHex(), '483d8b')
	t.is(tinycolor('darkslategray').toHex(), '2f4f4f')
	t.is(tinycolor('darkturquoise').toHex(), '00ced1')
	t.is(tinycolor('darkviolet').toHex(), '9400d3')
	t.is(tinycolor('deeppink').toHex(), 'ff1493')
	t.is(tinycolor('deepskyblue').toHex(), '00bfff')
	t.is(tinycolor('dimgray').toHex(), '696969')
	t.is(tinycolor('dodgerblue').toHex(), '1e90ff')
	t.is(tinycolor('firebrick').toHex(), 'b22222')
	t.is(tinycolor('floralwhite').toHex(), 'fffaf0')
	t.is(tinycolor('forestgreen').toHex(), '228b22')
	t.is(tinycolor('fuchsia').toHex(), 'ff00ff')
	t.is(tinycolor('gainsboro').toHex(), 'dcdcdc')
	t.is(tinycolor('ghostwhite').toHex(), 'f8f8ff')
	t.is(tinycolor('gold').toHex(), 'ffd700')
	t.is(tinycolor('goldenrod').toHex(), 'daa520')
	t.is(tinycolor('gray').toHex(), '808080')
	t.is(tinycolor('grey').toHex(), '808080')
	t.is(tinycolor('green').toHex(), '008000')
	t.is(tinycolor('greenyellow').toHex(), 'adff2f')
	t.is(tinycolor('honeydew').toHex(), 'f0fff0')
	t.is(tinycolor('hotpink').toHex(), 'ff69b4')
	t.is(tinycolor('indianred ').toHex(), 'cd5c5c')
	t.is(tinycolor('indigo ').toHex(), '4b0082')
	t.is(tinycolor('ivory').toHex(), 'fffff0')
	t.is(tinycolor('khaki').toHex(), 'f0e68c')
	t.is(tinycolor('lavender').toHex(), 'e6e6fa')
	t.is(tinycolor('lavenderblush').toHex(), 'fff0f5')
	t.is(tinycolor('lawngreen').toHex(), '7cfc00')
	t.is(tinycolor('lemonchiffon').toHex(), 'fffacd')
	t.is(tinycolor('lightblue').toHex(), 'add8e6')
	t.is(tinycolor('lightcoral').toHex(), 'f08080')
	t.is(tinycolor('lightcyan').toHex(), 'e0ffff')
	t.is(tinycolor('lightgoldenrodyellow').toHex(), 'fafad2')
	t.is(tinycolor('lightgrey').toHex(), 'd3d3d3')
	t.is(tinycolor('lightgreen').toHex(), '90ee90')
	t.is(tinycolor('lightpink').toHex(), 'ffb6c1')
	t.is(tinycolor('lightsalmon').toHex(), 'ffa07a')
	t.is(tinycolor('lightseagreen').toHex(), '20b2aa')
	t.is(tinycolor('lightskyblue').toHex(), '87cefa')
	t.is(tinycolor('lightslategray').toHex(), '778899')
	t.is(tinycolor('lightsteelblue').toHex(), 'b0c4de')
	t.is(tinycolor('lightyellow').toHex(), 'ffffe0')
	t.is(tinycolor('lime').toHex(), '00ff00')
	t.is(tinycolor('limegreen').toHex(), '32cd32')
	t.is(tinycolor('linen').toHex(), 'faf0e6')
	t.is(tinycolor('magenta').toHex(), 'ff00ff')
	t.is(tinycolor('maroon').toHex(), '800000')
	t.is(tinycolor('mediumaquamarine').toHex(), '66cdaa')
	t.is(tinycolor('mediumblue').toHex(), '0000cd')
	t.is(tinycolor('mediumorchid').toHex(), 'ba55d3')
	t.is(tinycolor('mediumpurple').toHex(), '9370db')
	t.is(tinycolor('mediumseagreen').toHex(), '3cb371')
	t.is(tinycolor('mediumslateblue').toHex(), '7b68ee')
	t.is(tinycolor('mediumspringgreen').toHex(), '00fa9a')
	t.is(tinycolor('mediumturquoise').toHex(), '48d1cc')
	t.is(tinycolor('mediumvioletred').toHex(), 'c71585')
	t.is(tinycolor('midnightblue').toHex(), '191970')
	t.is(tinycolor('mintcream').toHex(), 'f5fffa')
	t.is(tinycolor('mistyrose').toHex(), 'ffe4e1')
	t.is(tinycolor('moccasin').toHex(), 'ffe4b5')
	t.is(tinycolor('navajowhite').toHex(), 'ffdead')
	t.is(tinycolor('navy').toHex(), '000080')
	t.is(tinycolor('oldlace').toHex(), 'fdf5e6')
	t.is(tinycolor('olive').toHex(), '808000')
	t.is(tinycolor('olivedrab').toHex(), '6b8e23')
	t.is(tinycolor('orange').toHex(), 'ffa500')
	t.is(tinycolor('orangered').toHex(), 'ff4500')
	t.is(tinycolor('orchid').toHex(), 'da70d6')
	t.is(tinycolor('palegoldenrod').toHex(), 'eee8aa')
	t.is(tinycolor('palegreen').toHex(), '98fb98')
	t.is(tinycolor('paleturquoise').toHex(), 'afeeee')
	t.is(tinycolor('palevioletred').toHex(), 'db7093')
	t.is(tinycolor('papayawhip').toHex(), 'ffefd5')
	t.is(tinycolor('peachpuff').toHex(), 'ffdab9')
	t.is(tinycolor('peru').toHex(), 'cd853f')
	t.is(tinycolor('pink').toHex(), 'ffc0cb')
	t.is(tinycolor('plum').toHex(), 'dda0dd')
	t.is(tinycolor('powderblue').toHex(), 'b0e0e6')
	t.is(tinycolor('purple').toHex(), '800080')
	t.is(tinycolor('rebeccapurple').toHex(), '663399')
	t.is(tinycolor('red').toHex(), 'ff0000')
	t.is(tinycolor('rosybrown').toHex(), 'bc8f8f')
	t.is(tinycolor('royalblue').toHex(), '4169e1')
	t.is(tinycolor('saddlebrown').toHex(), '8b4513')
	t.is(tinycolor('salmon').toHex(), 'fa8072')
	t.is(tinycolor('sandybrown').toHex(), 'f4a460')
	t.is(tinycolor('seagreen').toHex(), '2e8b57')
	t.is(tinycolor('seashell').toHex(), 'fff5ee')
	t.is(tinycolor('sienna').toHex(), 'a0522d')
	t.is(tinycolor('silver').toHex(), 'c0c0c0')
	t.is(tinycolor('skyblue').toHex(), '87ceeb')
	t.is(tinycolor('slateblue').toHex(), '6a5acd')
	t.is(tinycolor('slategray').toHex(), '708090')
	t.is(tinycolor('snow').toHex(), 'fffafa')
	t.is(tinycolor('springgreen').toHex(), '00ff7f')
	t.is(tinycolor('steelblue').toHex(), '4682b4')
	t.is(tinycolor('tan').toHex(), 'd2b48c')
	t.is(tinycolor('teal').toHex(), '008080')
	t.is(tinycolor('thistle').toHex(), 'd8bfd8')
	t.is(tinycolor('tomato').toHex(), 'ff6347')
	t.is(tinycolor('turquoise').toHex(), '40e0d0')
	t.is(tinycolor('violet').toHex(), 'ee82ee')
	t.is(tinycolor('wheat').toHex(), 'f5deb3')
	t.is(tinycolor('white').toHex(), 'ffffff')
	t.is(tinycolor('whitesmoke').toHex(), 'f5f5f5')
	t.is(tinycolor('yellow').toHex(), 'ffff00')
	t.is(tinycolor('yellowgreen').toHex(), '9acd32')

	t.is(tinycolor('#f00').toName(), 'red')
	t.is(tinycolor('#fa0a0a').toName(), false)
})
