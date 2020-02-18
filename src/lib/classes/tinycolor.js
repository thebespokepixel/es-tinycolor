/* eslint no-constructor-return:0 */

/*
 *  ES-TinyColor : Core Class
 *  ────────────────────────────────────────────────────────────────────────────
 *  © 2016 Mark Griffiths @ The Bespoke Pixel (MIT licensed)
 *  Based on TinyColor © Brian Grinstead
 */

import {mathRound, boundAlpha, roundAlpha, roundIf01} from '../utilities'
import {rawToDeepRgba, rawToRgba, rgbaToHex, rgbToHex, rgbaToArray, rgbaToString, convertToPercentage, rgbaToPercentageRgba} from '../converters'
import {calcMix, calcBrightness, calcLuminance} from '../calculations'
import {readability as readabilityWCAG, isReadable as isWCAGReadable, mostReadable as mostWCAGReadable} from '../readability'
import {combine} from '../combiners'
import {modify} from '../modifiers'
import TinyColorExtensionAPI from './tinycolor-extension-api'

let tinyCounter = 0
const extensionApi = new TinyColorExtensionAPI()

export default class TinyColor {
	/**
	 * Create a new TinyColor instance
	 * @param  {String|Array|Object} color Notation describing a color
	 * @param  {Object} opts               Options object (see below)
	 * @return {TinyColor} An instance representing the color
	 */
	constructor(color, opts = {}) {
		color = color || ''
		// If input is already a tinycolor, return itself
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

	static registerFormat(id, opts = {}) {
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
		return readabilityWCAG(color1, color2)
	}

	static isReadable(color1, color2, wcag2) {
		return isWCAGReadable(color1, color2, wcag2)
	}

	static mostReadable(baseColor, colorList, args) {
		return mostWCAGReadable(baseColor, colorList, args)
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

	lighten(...args) {
		return modify('lighten', [this, ...args])
	}

	brighten(...args) {
		return modify('brighten', [this, ...args])
	}

	darken(...args) {
		return modify('darken', [this, ...args])
	}

	desaturate(...args) {
		return modify('desaturate', [this, ...args])
	}

	saturate(...args) {
		return modify('saturate', [this, ...args])
	}

	greyscale(...args) {
		return modify('greyscale', [this, ...args])
	}

	spin(...args) {
		return modify('spin', [this, ...args])
	}

	analogous(...args) {
		return combine('analogous', [this, ...args])
	}

	complement(...args) {
		return combine('complement', [this, ...args])
	}

	monochromatic(...args) {
		return combine('monochromatic', [this, ...args])
	}

	splitcomplement(...args) {
		return combine('splitcomplement', [this, ...args])
	}

	triad(...args) {
		return combine('triad', [this, ...args])
	}

	tetrad(...args) {
		return combine('tetrad', [this, ...args])
	}
}
