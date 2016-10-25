'use strict'

Object.defineProperty(exports, '__esModule', {
	value: true
})

const mathRound = Math.round
const mathMin = Math.min
const mathMax = Math.max

const isOnePointZero = n => typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1

const isPercentage = n => typeof n === 'string' && n.indexOf('%') !== -1

const roundIf01 = n => n < 1 ? mathRound(n) : n

const roundAlpha = a => mathRound(100 * a) / 100

const boundAlpha = a => {
	a = parseFloat(a)
	return isNaN(a) || a < 0 || a > 1 ? 1 : a
}

const hasAlpha = rgba => rgba.a < 1 && rgba.a >= 0

const clamp01 = val => mathMin(1, mathMax(0, val))

const pad2 = c => c.length === 1 ? `0${c}` : `${c}`

const CSS_INTEGER = `[-\+]?\d+%?`

const CSS_NUMBER = `[-\+]?\d*\.\d+%?`

const CSS_UNIT = `(?:${CSS_NUMBER})|(?:${CSS_INTEGER})`

const isValidCSSUnit = color => new RegExp(CSS_UNIT).test(color)

const isValidCSSUnitRGB = rgb => isValidCSSUnit(rgb.r) && isValidCSSUnit(rgb.g) && isValidCSSUnit(rgb.b)

const PERMISSIVE_MATCH3 = `[\s|\(]+(${CSS_UNIT})[,|\s]+(${CSS_UNIT})[,|\s]+(${CSS_UNIT})\s*\)?`
const PERMISSIVE_MATCH4 = `[\s|\(]+(${CSS_UNIT})[,|\s]+(${CSS_UNIT})[,|\s]+(${CSS_UNIT})[,|\s]+(${CSS_UNIT})\s*\)?`

function bound01(n, max) {
	if (isOnePointZero(n)) {
		n = '100%'
	}

	const processPercent = isPercentage(n)
	n = mathMin(max, mathMax(0, parseFloat(n)))

	if (processPercent) {
		n = parseInt(n * max, 10) / 100
	}

	if (Math.abs(n - max) < 0.000001) {
		return 1
	}

	return n % max / parseFloat(max)
}

const asyncGenerator = (function () {
	function AwaitValue(value) {
		this.value = value
	}

	function AsyncGenerator(gen) {
		let front
		let back

		function send(key, arg) {
			return new Promise((resolve, reject) => {
				const request = {
					key,
					arg,
					resolve,
					reject,
					next: null
				}

				if (back) {
					back = back.next = request
				} else {
					front = back = request
					resume(key, arg)
				}
			})
		}

		function resume(key, arg) {
			try {
				const result = gen[key](arg)
				const value = result.value

				if (value instanceof AwaitValue) {
					Promise.resolve(value.value).then(arg => {
						resume('next', arg)
					}, arg => {
						resume('throw', arg)
					})
				} else {
					settle(result.done ? 'return' : 'normal', result.value)
				}
			} catch (err) {
				settle('throw', err)
			}
		}

		function settle(type, value) {
			switch (type) {
				case 'return':
					front.resolve({
						value,
						done: true
					})
					break

				case 'throw':
					front.reject(value)
					break

				default:
					front.resolve({
						value,
						done: false
					})
					break
			}

			front = front.next

			if (front) {
				resume(front.key, front.arg)
			} else {
				back = null
			}
		}

		this._invoke = send

		if (typeof gen.return !== 'function') {
			this.return = undefined
		}
	}

	if (typeof Symbol === 'function' && Symbol.asyncIterator) {
		AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
			return this
		}
	}

	AsyncGenerator.prototype.next = function (arg) {
		return this._invoke('next', arg)
	}

	AsyncGenerator.prototype.throw = function (arg) {
		return this._invoke('throw', arg)
	}

	AsyncGenerator.prototype.return = function (arg) {
		return this._invoke('return', arg)
	}

	return {
		wrap(fn) {
			return function () {
				return new AsyncGenerator(fn.apply(this, arguments))
			}
		},
		await(value) {
			return new AwaitValue(value)
		}
	}
})()

const get = function get(object, property, receiver) {
	if (object === null)
		{object = Function.prototype}
	const desc = Object.getOwnPropertyDescriptor(object, property)

	if (desc === undefined) {
		const parent = Object.getPrototypeOf(object)

		if (parent === null) {
			return undefined
		} else {
			return get(parent, property, receiver)
		}
	} else if ('value' in desc) {
		return desc.value
	} else {
		const getter = desc.get

		if (getter === undefined) {
			return undefined
		}

		return getter.call(receiver)
	}
}

const set = function set(object, property, value, receiver) {
	const desc = Object.getOwnPropertyDescriptor(object, property)

	if (desc === undefined) {
		const parent = Object.getPrototypeOf(object)

		if (parent !== null) {
			set(parent, property, value, receiver)
		}
	} else if ('value' in desc && desc.writable) {
		desc.value = value
	} else {
		const setter = desc.set

		if (setter !== undefined) {
			setter.call(receiver, value)
		}
	}

	return value
}

const slicedToArray = (function () {
	function sliceIterator(arr, i) {
		const _arr = []
		let _n = true
		let _d = false
		let _e

		try {
			for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
				_arr.push(_s.value)

				if (i && _arr.length === i) {break}
			}
		} catch (err) {
			_d = true
			_e = err
		} finally {
			try {
				if (!_n && _i.return) {_i.return()}
			} finally {
				if (_d)
					{throw _e}
			}
		}

		return _arr
	}

	return function (arr, i) {
		if (Array.isArray(arr)) {
			return arr
		} else if (Symbol.iterator in Object(arr)) {
			return sliceIterator(arr, i)
		} else {
			throw new TypeError('Invalid attempt to destructure non-iterable instance')
		}
	}
})()

const toConsumableArray = function (arr) {
	if (Array.isArray(arr)) {
		for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i]}

		return arr2
	} else {
		return Array.from(arr)
	}
}

const convertHexToInt = val => parseInt(val, 16)

const convertHexToDecimal = h => convertHexToInt(h) / 255

const convertToPercentage = n => n <= 1 ? `${n * 100}%` : n

const rawToRgba = raw => {
	const _map = [raw._r, raw._g, raw._b].map(mathRound)
	const _map2 = slicedToArray(_map, 3)

	const r = _map2[0]
	const g = _map2[1]
	const b = _map2[2]

	return {
		r,
		g,
		b,
		a: raw._roundA
	}
}

const rawToDeepRgba = raw => ({
	r: raw._r,
	g: raw._g,
	b: raw._b,
	a: raw._a
})

const conformRgba = rgba => {
	const _map3 = [rgba.r, rgba.g, rgba.b].map(n => bound01(n, 255) * 255)
	const _map4 = slicedToArray(_map3, 3)

	const r = _map4[0]
	const g = _map4[1]
	const b = _map4[2]

	return {
		r,
		g,
		b,
		a: boundAlpha(rgba.a)
	}
}

const rgbaToPercentageRgba = rgba => {
	const _map5 = [rgba.r, rgba.g, rgba.b].map(n => `${mathRound(bound01(n, 255) * 100)}%`)
	const _map6 = slicedToArray(_map5, 3)

	const r = _map6[0]
	const g = _map6[1]
	const b = _map6[2]

	return {
		r,
		g,
		b,
		a: rgba.a
	}
}

const rgbaToString = rgba => rgba.a === 1 ? `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})` : `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`

const rgbaToArray = rgba => rgba.a === 1 ? [rgba.r, rgba.g, rgba.b] : [rgba.r, rgba.g, rgba.b, mathRound(rgba.a * 255)]

const rgbaToHex = (rgba, allowShort) => {
	const hex = rgbaToArray(rgba).map(n => n.toString(16)).map(pad2)
	return allowShort && hex.every(h => h.charAt(0) === h.charAt(1)) ? hex.map(h => h.charAt(0)).join('') : hex.join('')
}

const rgbToHex = (rgba, allowShort) => rgbaToHex(Object.assign({}, rgba, {
	a: 1
}), allowShort)

const calcBrightness = rgb => (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000

function calcLuminance(rgb, deepRgb) {
	let R
	let G
	let B
	const RsRGB = deepRgb.r / 255
	const GsRGB = deepRgb.g / 255
	const BsRGB = deepRgb.b / 255

	if (RsRGB <= 0.03928) {
		R = RsRGB / 12.92
	} else {
		R = Math.pow((RsRGB + 0.055) / 1.055, 2.4)
	}
	if (GsRGB <= 0.03928) {
		G = GsRGB / 12.92
	} else {
		G = Math.pow((GsRGB + 0.055) / 1.055, 2.4)
	}
	if (BsRGB <= 0.03928) {
		B = BsRGB / 12.92
	} else {
		B = Math.pow((BsRGB + 0.055) / 1.055, 2.4)
	}
	return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

function calcMix(color1, color2, amount) {
	amount = amount === 0 ? 0 : amount || 50
	const rgb1 = tinycolor(color1).toRgb()
	const rgb2 = tinycolor(color2).toRgb()
	const p = amount / 100
	const rgba = {
		r: (rgb2.r - rgb1.r) * p + rgb1.r,
		g: (rgb2.g - rgb1.g) * p + rgb1.g,
		b: (rgb2.b - rgb1.b) * p + rgb1.b,
		a: (rgb2.a - rgb1.a) * p + rgb1.a
	}
	return tinycolor(rgba)
}

function validateWCAG2Parms(parms) {
	let level
	let size
	parms = parms || {
		level: 'AA',
		size: 'small'
	}
	level = (parms.level || 'AA').toUpperCase()
	size = (parms.size || 'small').toLowerCase()
	if (level !== 'AA' && level !== 'AAA') {
		level = 'AA'
	}
	if (size !== 'small' && size !== 'large') {
		size = 'small'
	}
	return {
		level,
		size
	}
}

function readability(color1, color2) {
	const c1 = tinycolor(color1)
	const c2 = tinycolor(color2)
	return (Math.max(c1.getLuminance(), c2.getLuminance()) + 0.05) / (Math.min(c1.getLuminance(), c2.getLuminance()) + 0.05)
}

function isReadable(color1, color2, wcag2) {
	const readable = readability(color1, color2)
	const wcag2Parms = validateWCAG2Parms(wcag2)
	let out = false

	switch (wcag2Parms.level + wcag2Parms.size) {
		case 'AAlarge':
			out = readable >= 3
			break
		case 'AAAsmall':
			out = readable >= 7
			break
		default:
			out = readable >= 4.5
	}
	return out
}

function mostReadable(baseColor, colorList) {
	const args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}

	const includeFallbackColors = args.includeFallbackColors
	const level = args.level
	const size = args.size
	let readable
	let bestColor = null
	let bestScore = 0

	colorList.forEach(color => {
		readable = readability(baseColor, color)
		if (readable > bestScore) {
			bestScore = readable
			bestColor = tinycolor(color)
		}
	})

	if (isReadable(baseColor, bestColor, {
		level,
		size
	}) || !includeFallbackColors) {
		return bestColor
	}
	args.includeFallbackColors = false
	return mostReadable(baseColor, ['#fff', '#000'], args)
}

function combine(action, args) {
	const actions = {
		monochromatic,
		analogous,
		complement,
		splitcomplement,
		triad,
		tetrad
	}
	return actions[action].apply(actions, toConsumableArray(args))
}

function complement(color) {
	const hsl = tinycolor(color).toHsl()
	hsl.h = (hsl.h + 180) % 360
	return tinycolor(hsl)
}

function triad(color) {
	const hsl = tinycolor(color).toHsl()
	const h = hsl.h
	return [tinycolor(color), tinycolor({
		h: (h + 120) % 360,
		s: hsl.s,
		l: hsl.l
	}), tinycolor({
		h: (h + 240) % 360,
		s: hsl.s,
		l: hsl.l
	})]
}

function tetrad(color) {
	const hsl = tinycolor(color).toHsl()
	const h = hsl.h
	return [tinycolor(color), tinycolor({
		h: (h + 90) % 360,
		s: hsl.s,
		l: hsl.l
	}), tinycolor({
		h: (h + 180) % 360,
		s: hsl.s,
		l: hsl.l
	}), tinycolor({
		h: (h + 270) % 360,
		s: hsl.s,
		l: hsl.l
	})]
}

function splitcomplement(color) {
	const hsl = tinycolor(color).toHsl()
	const h = hsl.h
	return [tinycolor(color), tinycolor({
		h: (h + 72) % 360,
		s: hsl.s,
		l: hsl.l
	}), tinycolor({
		h: (h + 216) % 360,
		s: hsl.s,
		l: hsl.l
	})]
}

function analogous(color, results, slices) {
	results = results || 6
	slices = slices || 30

	const hsl = tinycolor(color).toHsl()
	const part = 360 / slices
	const ret = [tinycolor(color)]

	for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results;) {
		hsl.h = (hsl.h + part) % 360
		ret.push(tinycolor(hsl))
	}
	return ret
}

function monochromatic(color, results) {
	results = results || 6
	const hsv = tinycolor(color).toHsv()
	const h = hsv.h
	const s = hsv.s
	let v = hsv.v

	const ret = []
	const modification = 1 / results

	while (results--) {
		ret.push(tinycolor({
			h,
			s,
			v
		}))
		v = (v + modification) % 1
	}
	return ret
}

function modify(action, args) {
	const actions = {
		desaturate,
		saturate,
		greyscale,
		lighten,
		brighten,
		darken,
		spin
	}
	const color = actions[action].apply(actions, toConsumableArray(args))

	const _args = slicedToArray(args, 1)

	const source = _args[0]

	source._r = color._r
	source._g = color._g
	source._b = color._b
	source.setAlpha(color._a)
	return source
}

function desaturate(color, amount) {
	amount = amount === 0 ? 0 : amount || 10
	const hsl = tinycolor(color).toHsl()
	hsl.s -= amount / 100
	hsl.s = clamp01(hsl.s)
	return tinycolor(hsl)
}

function saturate(color, amount) {
	amount = amount === 0 ? 0 : amount || 10
	const hsl = tinycolor(color).toHsl()
	hsl.s += amount / 100
	hsl.s = clamp01(hsl.s)
	return tinycolor(hsl)
}

function greyscale(color) {
	return tinycolor(color).desaturate(100)
}

function lighten(color, amount) {
	amount = amount === 0 ? 0 : amount || 10
	const hsl = tinycolor(color).toHsl()
	hsl.l += amount / 100
	hsl.l = clamp01(hsl.l)
	return tinycolor(hsl)
}

function brighten(color, amount) {
	amount = amount === 0 ? 0 : amount || 10
	const rgb = tinycolor(color).toRgb()
	rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * -(amount / 100))))
	rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * -(amount / 100))))
	rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * -(amount / 100))))
	return tinycolor(rgb)
}

function darken(color, amount) {
	amount = amount === 0 ? 0 : amount || 10
	const hsl = tinycolor(color).toHsl()
	hsl.l -= amount / 100
	hsl.l = clamp01(hsl.l)
	return tinycolor(hsl)
}

function spin(color, amount) {
	const hsl = tinycolor(color).toHsl()
	const hue = (hsl.h + amount) % 360
	hsl.h = hue < 0 ? 360 + hue : hue
	return tinycolor(hsl)
}

class TinyColorExtension {
	constructor(api, id) {
		const opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}

		this.api = api
		this.id = id
		this.opts = opts
	}
	use(specified) {
		this.wanted = specified
		return this
	}
	parse(input) {
		const result = this.api.find(input)
		return {
			as: format => Object.assign(result, {
				format
			}),
			rgba: {
				r: result.r,
				g: result.g,
				b: result.b,
				a: result.a
			},
			valueOf: () => result
		}
	}
	print(id, rgba) {
		return this.api.print(rgba, id)
	}
	complete(rgba) {
		const output = this.toString(rgba)
		delete this.wanted
		return output
	}
}

const _template = {
	format: false,
	ok: false,
	r: 0,
	g: 0,
	b: 0,
	a: 1
}

class TinyColorExtensionAPI {
	constructor() {
		this.colorspaces = {}
		this.opts = {
			alphaFormat: 'rgb',
			shortHex: false,
			upperCaseHex: false
		}
	}
	set(opts) {
		Object.assign(this.opts, opts)
		for (const id in this.colorspaces) {
			if ({}.hasOwnProperty.call(this.colorspaces, id)) {
				Object.assign(this.colorspaces[id].opts, opts)
			}
		}
	}
	add(id, opts) {
		this.colorspaces[id] = new TinyColorExtension(this, id, Object.assign({}, this.opts, opts))
		if (opts.alias) {
			opts.alias.forEach(id_ => {
				this.colorspaces[id_] = this.colorspaces[id]
			})
		}
		return this.colorspaces[id]
	}
	find(input) {
		const color = Object.assign({}, _template)
		input = typeof input === 'string' ? input.trim().toLowerCase() : input
		if (input) {
			for (const id in this.colorspaces) {
				if (this.colorspaces[id].shouldHandleInput(input)) {
					Object.assign(color, this.colorspaces[id].toRgb(input))
					color.format = color.format || id
					color.ok = true
					break
				}
			}
		}
		return color
	}
	raw(rgba, format) {
		if (format in this.colorspaces) {
			return this.colorspaces[format].toRaw(rgba)
		}
		return {
			r: rgba.r / 255,
			g: rgba.g / 255,
			b: rgba.b / 255,
			a: rgba.a
		}
	}
	print(rgba, original, format) {
		const specified = format
		format = format || original
		if (format in this.colorspaces) {
			return this.colorspaces[format].use(specified).complete(rgba)
		}
		return `[${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a * 255}]`
	}
}

let tinyCounter = 0
const extensionApi = new TinyColorExtensionAPI()

class TinyColor {
	constructor(color) {
		const opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}

		color = color || ''

		if (color instanceof TinyColor) {
			return color
		}

		const rgba = extensionApi.find(color)

		this._originalInput = color
		this._r = roundIf01(rgba.r)
		this._g = roundIf01(rgba.g)
		this._b = roundIf01(rgba.b)
		this._a = rgba.a
		this._roundA = roundAlpha(this._a)
		this._format = opts.format || rgba.format
		this._gradientType = opts.gradientType

		this._ok = rgba.ok
		this._tc_id = TinyColor.newId()
		extensionApi.set(opts)
	}
	static newId() {
		return tinyCounter++
	}
	static registerFormat(id) {
		const opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}

		return extensionApi.add(id, opts)
	}
	static equals(color1, color2) {
		if (!color1 || !color2) {
			return false
		}
		return new TinyColor(color1).toRgbString() === new TinyColor(color2).toRgbString()
	}
	static fromRatio(color, opts) {
		if (typeof color === 'object') {
			const newColor = {}
			for (const i in color) {
				if ({}.hasOwnProperty.call(color, i)) {
					if (i === 'a') {
						newColor[i] = color[i]
					} else {
						newColor[i] = convertToPercentage(color[i])
					}
				}
			}
			color = newColor
		}
		return new TinyColor(color, opts)
	}
	static readability(color1, color2) {
		return readability(color1, color2)
	}
	static isReadable(color1, color2, wcag2) {
		return isReadable(color1, color2, wcag2)
	}
	static mostReadable(baseColor, colorList, args) {
		return mostReadable(baseColor, colorList, args)
	}
	static mix(color1, color2, amount) {
		return calcMix(color1, color2, amount)
	}
	isDark() {
		return this.getBrightness() < 128
	}
	isLight() {
		return !this.isDark()
	}
	isValid() {
		return this._ok
	}
	getOriginalInput() {
		return this._originalInput
	}
	getFormat() {
		return this._format
	}
	getAlpha() {
		return this._a
	}
	getBrightness() {
		return calcBrightness(this.toRgb())
	}
	getLuminance() {
		return calcLuminance(this.toRgb(), rawToDeepRgba(this))
	}
	toString(format) {
		return extensionApi.print(rawToRgba(this), this._format, format)
	}
	toName() {
		return extensionApi.print(rawToRgba(this), 'name', 'toName')
	}
	toRgb() {
		return rawToDeepRgba(this)
	}
	toRgbString() {
		return rgbaToString(rawToRgba(this))
	}
	toRgbArray() {
		return rgbaToArray(rawToRgba(this))
	}
	toPercentageRgb() {
		return rgbaToPercentageRgba(rawToDeepRgba(this))
	}
	toPercentageRgbString() {
		return rgbaToString(rgbaToPercentageRgba(rawToRgba(this)))
	}
	toHex(allow3Char) {
		return rgbToHex(rawToRgba(this), allow3Char)
	}
	toHexString(allow3Char) {
		return `#${this.toHex(allow3Char)}`
	}
	toHex8(allow4Char) {
		return rgbaToHex(rawToRgba(this), allow4Char)
	}
	toHex8String(allow4Char) {
		return `#${this.toHex8(allow4Char)}`
	}
	toHsv() {
		return extensionApi.raw(rawToDeepRgba(this), 'hsv')
	}
	toHsvString() {
		return extensionApi.print(rawToDeepRgba(this), this._format, 'hsv')
	}
	toHsl() {
		return extensionApi.raw(rawToDeepRgba(this), 'hsl')
	}
	toHslString() {
		return extensionApi.print(rawToDeepRgba(this), this._format, 'hsl')
	}
	setAlpha(value) {
		this._a = boundAlpha(value)
		this._roundA = mathRound(100 * this._a) / 100
		return this
	}
	clone() {
		return new TinyColor(this.toString())
	}

	lighten() {
		return modify('lighten', [this].concat(Array.prototype.slice.call(arguments)))
	}
	brighten() {
		return modify('brighten', [this].concat(Array.prototype.slice.call(arguments)))
	}
	darken() {
		return modify('darken', [this].concat(Array.prototype.slice.call(arguments)))
	}
	desaturate() {
		return modify('desaturate', [this].concat(Array.prototype.slice.call(arguments)))
	}
	saturate() {
		return modify('saturate', [this].concat(Array.prototype.slice.call(arguments)))
	}
	greyscale() {
		return modify('greyscale', [this].concat(Array.prototype.slice.call(arguments)))
	}
	spin() {
		return modify('spin', [this].concat(Array.prototype.slice.call(arguments)))
	}
	analogous() {
		return combine('analogous', [this].concat(Array.prototype.slice.call(arguments)))
	}
	complement() {
		return combine('complement', [this].concat(Array.prototype.slice.call(arguments)))
	}
	monochromatic() {
		return combine('monochromatic', [this].concat(Array.prototype.slice.call(arguments)))
	}
	splitcomplement() {
		return combine('splitcomplement', [this].concat(Array.prototype.slice.call(arguments)))
	}
	triad() {
		return combine('triad', [this].concat(Array.prototype.slice.call(arguments)))
	}
	tetrad() {
		return combine('tetrad', [this].concat(Array.prototype.slice.call(arguments)))
	}
}

const matchers = (function () {
	return {
		rgb: new RegExp(`rgb${PERMISSIVE_MATCH3}`),
		rgba: new RegExp(`rgba${PERMISSIVE_MATCH4}`)
	}
})()

function rgbStringToObject(color) {
	let r
	let g
	let b
	let a
	let match
	if (match = matchers.rgb.exec(color)) {
		const _match$splice = match.splice(1, 3)

		const _match$splice2 = slicedToArray(_match$splice, 3)

		r = _match$splice2[0]
		g = _match$splice2[1]
		b = _match$splice2[2]

		return {
			r,
			g,
			b
		}
	}
	if (match = matchers.rgba.exec(color)) {
		const _match$splice3 = match.splice(1, 4)

		const _match$splice4 = slicedToArray(_match$splice3, 4)

		r = _match$splice4[0]
		g = _match$splice4[1]
		b = _match$splice4[2]
		a = _match$splice4[3]

		return {
			r,
			g,
			b,
			a
		}
	}

	return false
}

const api = TinyColor.registerFormat('rgb')

api.shouldHandleInput = input => typeof input === 'object' && isValidCSSUnitRGB(input) && !isPercentage(input.r) || rgbStringToObject(input)

api.toRgb = input => typeof input === 'object' && conformRgba(input) || conformRgba(rgbStringToObject(input))

api.toRaw = rgba => rgba

api.toString = rgba => rgbaToString(rgba)

const api$1 = TinyColor.registerFormat('prgb')

api$1.shouldHandleInput = input => {
	if (typeof input === 'string') {
		const rgbCheck = rgbStringToObject(input)
		return rgbCheck && isPercentage(rgbCheck.r)
	}
	return isValidCSSUnitRGB(input) && isPercentage(input.r)
}
api$1.toRgb = input => typeof input === 'object' ? conformRgba(input) : conformRgba(rgbStringToObject(input))
api$1.toRaw = rgba => rgbaToPercentageRgba(rgba)
api$1.toString = rgba => rgbaToString(rgbaToPercentageRgba(rgba))

const api$2 = TinyColor.registerFormat('hex', {
	alias: ['hex3', 'hex6']
})

const matchers$1 = (function () {
	return {
		hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
		hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
	}
})()

function hexToRgba(color) {
	let match
	if (match = matchers$1.hex3.exec(color)) {
		const _match$splice$map$map = match.splice(1, 3).map(h => `${h}${h}`).map(convertHexToInt)
		const _match$splice$map$map2 = slicedToArray(_match$splice$map$map, 3)

		const r = _match$splice$map$map2[0]
		const g = _match$splice$map$map2[1]
		const b = _match$splice$map$map2[2]

		return {
			r,
			g,
			b,
			a: 1
		}
	}
	if (match = matchers$1.hex6.exec(color)) {
		const _match$splice$map = match.splice(1, 3).map(convertHexToInt)
		const _match$splice$map2 = slicedToArray(_match$splice$map, 3)

		const r = _match$splice$map2[0]
		const g = _match$splice$map2[1]
		const b = _match$splice$map2[2]

		return {
			r,
			g,
			b,
			a: 1
		}
	}
	return false
}

const hexToString = function hexToString(rgba) {
	const short = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : api$2.opts.shortHex
	return `#${api$2.opts.upperCaseHex ? rgbToHex(rgba, short).toUpperCase() : rgbToHex(rgba, short)}`
}

api$2.shouldHandleInput = input => matchers$1.hex6.test(input) || matchers$1.hex3.test(input)
api$2.toRgb = input => hexToRgba(input)
api$2.toRaw = rgba => rgba
api$2.toString = rgba => {
	if (/^hex6?$/.test(api$2.wanted)) {
		return hexToString(rgba)
	}
	if (api$2.wanted === 'hex3') {
		return hexToString(rgba, true)
	}
	if (hasAlpha(rgba)) {
		return api$2.opts.alphaFormat === 'hex' ? hexToString(rgba) : api$2.print(api$2.opts.alphaFormat, rgba)
	}
	return hexToString(rgba)
}

const api$3 = TinyColor.registerFormat('hex8', {
	alias: ['hex4']
})

const matchers$2 = (function () {
	return {
		hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
		hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
	}
})()

function hexToRgba$1(color) {
	let match
	if (match = matchers$2.hex4.exec(color)) {
		const a = convertHexToDecimal(`${match[4]}${match[4]}`)

		const _match$splice$map$map = match.splice(1, 3).map(h => `${h}${h}`).map(convertHexToInt)
		const _match$splice$map$map2 = slicedToArray(_match$splice$map$map, 3)

		const r = _match$splice$map$map2[0]
		const g = _match$splice$map$map2[1]
		const b = _match$splice$map$map2[2]

		return {
			r,
			g,
			b,
			a
		}
	}
	if (match = matchers$2.hex8.exec(color)) {
		const a = convertHexToDecimal(match[4])

		const _match$splice$map = match.splice(1, 3).map(convertHexToInt)
		const _match$splice$map2 = slicedToArray(_match$splice$map, 3)

		const r = _match$splice$map2[0]
		const g = _match$splice$map2[1]
		const b = _match$splice$map2[2]

		return {
			r,
			g,
			b,
			a
		}
	}
	return false
}

const hexToString$1 = function hexToString$1(rgba) {
	const short = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : api$3.opts.shortHex
	return `#${api$3.opts.upperCaseHex ? rgbaToHex(rgba, short).toUpperCase() : rgbaToHex(rgba, short)}`
}

api$3.shouldHandleInput = input => matchers$2.hex8.test(input) || matchers$2.hex4.test(input)
api$3.toRgb = input => hexToRgba$1(input)
api$3.toRaw = rgba => rgba
api$3.toString = rgba => {
	if (api$3.wanted === 'hex4') {
		return hexToString$1(rgba, true)
	}
	if (api$3.wanted === 'hex8') {
		return hexToString$1(rgba)
	}
	if (hasAlpha(rgba)) {
		return api$3.opts.alphaFormat === 'hex' ? hexToString$1(rgba) : api$3.print(api$3.opts.alphaFormat, rgba)
	}
	return hexToString$1(rgba)
}

const api$4 = TinyColor.registerFormat('hsl')

const matchers$3 = (function () {
	return {
		hsl: new RegExp(`hsl${PERMISSIVE_MATCH3}`),
		hsla: new RegExp(`hsla${PERMISSIVE_MATCH4}`)
	}
})()

const isValidCSSUnitHSL = hsl => isValidCSSUnit(hsl.h) && isValidCSSUnit(hsl.s) && isValidCSSUnit(hsl.l)

function rgbaToHsla(rgba) {
	const r = bound01(rgba.r, 255)
	const g = bound01(rgba.g, 255)
	const b = bound01(rgba.b, 255)
	const a = rgba.a || 1
	const max = mathMax(r, g, b)
	const min = mathMin(r, g, b)
	let h
	let s
	const l = (max + min) / 2

	if (max === min) {
		h = s = 0
	} else {
		const d = max - min
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0)
				break
			case g:
				h = (b - r) / d + 2
				break
			default:
				h = (r - g) / d + 4
				break
		}
		h /= 6
	}
	return {
		h,
		s,
		l,
		a
	}
}

function hslaToRgba(hsla) {
	const h = bound01(hsla.h, 360)
	const s = bound01(convertToPercentage(hsla.s), 100)
	const l = bound01(convertToPercentage(hsla.l), 100)
	const a = hsla.a || 1
	let r
	let g
	let b

	function hue2rgb(p, q, t) {
		t = t < 0 ? t + 1 : t
		t = t > 1 ? t - 1 : t
		if (t < 1 / 6) {
			return p + (q - p) * 6 * t
		}
		if (t < 1 / 2) {
			return q
		}
		if (t < 2 / 3) {
			return p + (q - p) * (2 / 3 - t) * 6
		}
		return p
	}

	if (s === 0) {
		r = g = b = l
	} else {
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s
		const p = 2 * l - q
		r = hue2rgb(p, q, h + 1 / 3)
		g = hue2rgb(p, q, h)
		b = hue2rgb(p, q, h - 1 / 3)
	}

	return {
		r: r * 255,
		g: g * 255,
		b: b * 255,
		a
	}
}

function hslStringToObject(color) {
	let h
	let s
	let l
	let a
	let match
	if (match = matchers$3.hsl.exec(color)) {
		const _match$splice = match.splice(1, 3)

		const _match$splice2 = slicedToArray(_match$splice, 3)

		h = _match$splice2[0]
		s = _match$splice2[1]
		l = _match$splice2[2]

		return {
			h,
			s,
			l
		}
	}
	if (match = matchers$3.hsla.exec(color)) {
		const _match$splice3 = match.splice(1, 4)

		const _match$splice4 = slicedToArray(_match$splice3, 4)

		h = _match$splice4[0]
		s = _match$splice4[1]
		l = _match$splice4[2]
		a = _match$splice4[3]

		return {
			h,
			s,
			l,
			a
		}
	}
	return false
}

function hslaToString(hsla) {
	let h = hsla.h
	let s = hsla.s
	let l = hsla.l
	const a = hsla.a

	h = mathRound(h * 360)
	s = mathRound(s * 100)
	l = mathRound(l * 100)
	return a === 1 ? `hsl(${h}, ${s}%, ${l}%)` : `hsla(${h}, ${s}%, ${l}%, ${a})`
}

function hslaToRaw(hsla) {
	let h = hsla.h
	const s = hsla.s
	const l = hsla.l
	const a = hsla.a

	h *= 360

	return {
		h,
		s,
		l,
		a
	}
}

api$4.shouldHandleInput = input => typeof input === 'object' && isValidCSSUnitHSL(input) || hslStringToObject(input)
api$4.toRgb = input => typeof input === 'object' && hslaToRgba(input) || hslaToRgba(hslStringToObject(input))
api$4.toRaw = rgba => hslaToRaw(rgbaToHsla(rgba))
api$4.toString = rgba => hslaToString(rgbaToHsla(rgba))

const api$5 = TinyColor.registerFormat('hsv')

const matchers$4 = (function () {
	return {
		hsv: new RegExp(`hsv${PERMISSIVE_MATCH3}`),
		hsva: new RegExp(`hsva${PERMISSIVE_MATCH4}`)
	}
})()

const isValidCSSUnitHSV = hsv => isValidCSSUnit(hsv.h) && isValidCSSUnit(hsv.s) && isValidCSSUnit(hsv.v)

function rgbaToHsva(rgba) {
	const r = bound01(rgba.r, 255)
	const g = bound01(rgba.g, 255)
	const b = bound01(rgba.b, 255)
	const a = rgba.a || 1
	const max = mathMax(r, g, b)
	const min = mathMin(r, g, b)
	const d = max - min
	let h
	const s = max === 0 ? 0 : d / max
	const v = max

	if (max === min) {
		h = 0
	} else {
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0)
				break
			case g:
				h = (b - r) / d + 2
				break
			default:
				h = (r - g) / d + 4
				break
		}
		h /= 6
	}
	return {
		h,
		s,
		v,
		a
	}
}

function hsvaToRgba(hsva) {
	const h = bound01(hsva.h, 360) * 6
	const s = bound01(convertToPercentage(hsva.s), 100)
	const v = bound01(convertToPercentage(hsva.v), 100)
	const a = hsva.a || 1

	const i = Math.floor(h)
	const f = h - i
	const p = v * (1 - s)
	const q = v * (1 - f * s)
	const t = v * (1 - (1 - f) * s)
	const mod = i % 6
	const r = [v, q, p, p, t, v][mod]
	const g = [t, v, v, q, p, p][mod]
	const b = [p, p, t, v, v, q][mod]

	return {
		r: r * 255,
		g: g * 255,
		b: b * 255,
		a
	}
}

function hsvStringToObject(color) {
	let h
	let s
	let v
	let a
	let match
	if (match = matchers$4.hsv.exec(color)) {
		const _match$splice = match.splice(1, 3)

		const _match$splice2 = slicedToArray(_match$splice, 3)

		h = _match$splice2[0]
		s = _match$splice2[1]
		v = _match$splice2[2]

		return {
			h,
			s,
			v
		}
	}
	if (match = matchers$4.hsva.exec(color)) {
		const _match$splice3 = match.splice(1, 4)

		const _match$splice4 = slicedToArray(_match$splice3, 4)

		h = _match$splice4[0]
		s = _match$splice4[1]
		v = _match$splice4[2]
		a = _match$splice4[3]

		return {
			h,
			s,
			v,
			a
		}
	}
	return false
}

function hsvaToString(hsva) {
	let h = hsva.h
	let s = hsva.s
	let v = hsva.v
	const a = hsva.a

	h = mathRound(h * 360)
	s = mathRound(s * 100)
	v = mathRound(v * 100)
	return a === 1 ? `hsv(${h}, ${s}%, ${v}%)` : `hsva(${h}, ${s}%, ${v}%, ${a})`
}

function hsvaToRaw(hsla) {
	let h = hsla.h
	const s = hsla.s
	const v = hsla.v
	const a = hsla.a

	h *= 360

	return {
		h,
		s,
		v,
		a
	}
}

api$5.shouldHandleInput = input => typeof input === 'object' && isValidCSSUnitHSV(input) || hsvStringToObject(input)
api$5.toRgb = input => typeof input === 'object' && hsvaToRgba(input) || hsvaToRgba(hsvStringToObject(input))
api$5.toRaw = rgba => hsvaToRaw(rgbaToHsva(rgba))
api$5.toString = rgba => hsvaToString(rgbaToHsva(rgba))

const api$6 = TinyColor.registerFormat('name', {
	alias: ['toName']
})

function flip(o) {
	const flipped = {}
	for (const i in o) {
		if ({}.hasOwnProperty.call(o, i)) {
			flipped[o[i]] = i
		}
	}
	return flipped
}

const names = {
	aliceblue: 'f0f8ff',
	antiquewhite: 'faebd7',
	aqua: '0ff',
	aquamarine: '7fffd4',
	azure: 'f0ffff',
	beige: 'f5f5dc',
	bisque: 'ffe4c4',
	black: '000',
	blanchedalmond: 'ffebcd',
	blue: '00f',
	blueviolet: '8a2be2',
	brown: 'a52a2a',
	burlywood: 'deb887',
	burntsienna: 'ea7e5d',
	cadetblue: '5f9ea0',
	chartreuse: '7fff00',
	chocolate: 'd2691e',
	coral: 'ff7f50',
	cornflowerblue: '6495ed',
	cornsilk: 'fff8dc',
	crimson: 'dc143c',
	cyan: '0ff',
	darkblue: '00008b',
	darkcyan: '008b8b',
	darkgoldenrod: 'b8860b',
	darkgray: 'a9a9a9',
	darkgreen: '006400',
	darkgrey: 'a9a9a9',
	darkkhaki: 'bdb76b',
	darkmagenta: '8b008b',
	darkolivegreen: '556b2f',
	darkorange: 'ff8c00',
	darkorchid: '9932cc',
	darkred: '8b0000',
	darksalmon: 'e9967a',
	darkseagreen: '8fbc8f',
	darkslateblue: '483d8b',
	darkslategray: '2f4f4f',
	darkslategrey: '2f4f4f',
	darkturquoise: '00ced1',
	darkviolet: '9400d3',
	deeppink: 'ff1493',
	deepskyblue: '00bfff',
	dimgray: '696969',
	dimgrey: '696969',
	dodgerblue: '1e90ff',
	firebrick: 'b22222',
	floralwhite: 'fffaf0',
	forestgreen: '228b22',
	fuchsia: 'f0f',
	gainsboro: 'dcdcdc',
	ghostwhite: 'f8f8ff',
	gold: 'ffd700',
	goldenrod: 'daa520',
	gray: '808080',
	green: '008000',
	greenyellow: 'adff2f',
	grey: '808080',
	honeydew: 'f0fff0',
	hotpink: 'ff69b4',
	indianred: 'cd5c5c',
	indigo: '4b0082',
	ivory: 'fffff0',
	khaki: 'f0e68c',
	lavender: 'e6e6fa',
	lavenderblush: 'fff0f5',
	lawngreen: '7cfc00',
	lemonchiffon: 'fffacd',
	lightblue: 'add8e6',
	lightcoral: 'f08080',
	lightcyan: 'e0ffff',
	lightgoldenrodyellow: 'fafad2',
	lightgray: 'd3d3d3',
	lightgreen: '90ee90',
	lightgrey: 'd3d3d3',
	lightpink: 'ffb6c1',
	lightsalmon: 'ffa07a',
	lightseagreen: '20b2aa',
	lightskyblue: '87cefa',
	lightslategray: '789',
	lightslategrey: '789',
	lightsteelblue: 'b0c4de',
	lightyellow: 'ffffe0',
	lime: '0f0',
	limegreen: '32cd32',
	linen: 'faf0e6',
	magenta: 'f0f',
	maroon: '800000',
	mediumaquamarine: '66cdaa',
	mediumblue: '0000cd',
	mediumorchid: 'ba55d3',
	mediumpurple: '9370db',
	mediumseagreen: '3cb371',
	mediumslateblue: '7b68ee',
	mediumspringgreen: '00fa9a',
	mediumturquoise: '48d1cc',
	mediumvioletred: 'c71585',
	midnightblue: '191970',
	mintcream: 'f5fffa',
	mistyrose: 'ffe4e1',
	moccasin: 'ffe4b5',
	navajowhite: 'ffdead',
	navy: '000080',
	oldlace: 'fdf5e6',
	olive: '808000',
	olivedrab: '6b8e23',
	orange: 'ffa500',
	orangered: 'ff4500',
	orchid: 'da70d6',
	palegoldenrod: 'eee8aa',
	palegreen: '98fb98',
	paleturquoise: 'afeeee',
	palevioletred: 'db7093',
	papayawhip: 'ffefd5',
	peachpuff: 'ffdab9',
	peru: 'cd853f',
	pink: 'ffc0cb',
	plum: 'dda0dd',
	powderblue: 'b0e0e6',
	purple: '800080',
	rebeccapurple: '639',
	red: 'f00',
	rosybrown: 'bc8f8f',
	royalblue: '4169e1',
	saddlebrown: '8b4513',
	salmon: 'fa8072',
	sandybrown: 'f4a460',
	seagreen: '2e8b57',
	seashell: 'fff5ee',
	sienna: 'a0522d',
	silver: 'c0c0c0',
	skyblue: '87ceeb',
	slateblue: '6a5acd',
	slategray: '708090',
	slategrey: '708090',
	snow: 'fffafa',
	springgreen: '00ff7f',
	steelblue: '4682b4',
	tan: 'd2b48c',
	teal: '008080',
	thistle: 'd8bfd8',
	tomato: 'ff6347',
	turquoise: '40e0d0',
	violet: 'ee82ee',
	wheat: 'f5deb3',
	white: 'fff',
	whitesmoke: 'f5f5f5',
	yellow: 'ff0',
	yellowgreen: '9acd32'
}

names.transparent = '00000000'

const hexNames = flip(names)

api$6.shouldHandleInput = input => names[input]

api$6.toRgb = input => api$6.parse(names[input]).rgba

api$6.toRaw = rgba => rgba

api$6.toString = rgba => {
	if (rgba.a === 0) {
		return 'transparent'
	}
	if (hasAlpha(rgba) && api$6.wanted === 'toName') {
		return false
	}
	if (hasAlpha(rgba) && api$6.wanted === 'name') {
		return `#${rgbToHex(rgba)}`
	}
	if (hasAlpha(rgba)) {
		return api$6.print(api$6.opts.alphaFormat, rgba)
	}

	return hexNames[rgbToHex(rgba, true)] || false
}

function tinycolor(color, opts) {
	return new TinyColor(color, opts)
}

tinycolor.equals = TinyColor.equals
tinycolor.registerFormat = TinyColor.registerFormat
tinycolor.fromRatio = TinyColor.fromRatio
tinycolor.mix = TinyColor.mix
tinycolor.readability = TinyColor.readability
tinycolor.isReadable = TinyColor.isReadable
tinycolor.mostReadable = TinyColor.mostReadable
tinycolor.names = names

exports.TinyColor = TinyColor
exports.tinycolor = tinycolor
exports.names = names

