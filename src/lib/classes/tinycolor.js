/* eslint no-constructor-return:0 */

/*
 *  ES-TinyColor : Core Class
 *  ────────────────────────────────────────────────────────────────────────────
 *  © 2016 Mark Griffiths @ The Bespoke Pixel (MIT licensed)
 *  Based on TinyColor © Brian Grinstead
 */

import {mathRound, boundAlpha, roundAlpha, roundIf01} from '../utilities.js'
import {rawToDeepRgba, rawToRgba, rgbaToHex, rgbToHex, rgbaToArray, rgbaToString, convertToPercentage, rgbaToPercentageRgba} from '../converters.js'
import {calcMix, calcBrightness, calcLuminance} from '../calculations.js'
import {readability as readabilityWCAG, isReadable as isWCAGReadable, mostReadable as mostWCAGReadable} from '../readability.js'
import {combine} from '../combiners.js'
import {modify} from '../modifiers.js'
import TinyColorExtensionAPI from './tinycolor-extension-api.js'

let tinyCounter = 0
const extensionApi = new TinyColorExtensionAPI()

export default class TinyColor {
	/**
	 * Create a new TinyColor instance
	 * @param  {string|array|object} color Notation describing a color
	 * @param  {object} options            Options object (see below)
	 * @return {TinyColor}                 An instance representing the color
	 */
	constructor(color, options = {}) {
		color = color || ''
		// If input is already a tinycolor, return itself
		if (color instanceof TinyColor) {
			return color
		}

		const rgba = extensionApi.findColor(color)
		this._originalInput = color
		this._r = roundIf01(rgba.r)
		this._g = roundIf01(rgba.g)
		this._b = roundIf01(rgba.b)
		this._a = rgba.a
		this._roundA = roundAlpha(this._a)
		this._format = options.format || rgba.format
		this._gradientType = options.gradientType

		this._ok = rgba.ok
		this._tc_id = TinyColor.newId()
		extensionApi.set(options)
	}

	/**
	 * Create a new ID
	 *
	 * @return     {number}  Incremented ID counter
	 */
	static newId() {
		return tinyCounter++
	}

	/**
	 * Register a TinyColor extension
	 * @param   {string}  id                   The plugin identifier
	 * @param   {object}  [options={}]         Plugin options
	 * @param   {string}  options.alphaFormat  rgb|hex
	 * @param   {boolean} options.shortHex     Short hex codes #ABC, if possible
	 * @param   {boolean} options.upperCaseHex User UPPER case hex
	 * @return  {TinyColorExtension}           The TinyColor extension
	 */
	static registerFormat(id, options = {}) {
		return extensionApi.add(id, options)
	}

	/**
	 * Are two TinyColor colours equivalent?
	 *
	 * @param      {TinyColor}  color1  The first color
	 * @param      {TinyColor}  color2  The second color
	 * @return     {boolean}  Equivalent or not?
	 */
	static equals(color1, color2) {
		if (!color1 || !color2) {
			return false
		}

		return new TinyColor(color1).toRgbString() === new TinyColor(color2).toRgbString()
	}

	/**
	 * Create a new TinyColor from values from 0..1
	 *
	 * @param      {object}     color    The color
	 * @param      {object}     options  The options
	 * @return     {TinyColor}  The tiny color.
	 */
	static fromRatio(color, options) {
		if (typeof color === 'object') {
			const newColor = {}
			for (const i in color) {
				if (Object.prototype.hasOwnProperty.call(color, i)) {
					if (i === 'a') {
						newColor[i] = color[i]
					} else {
						newColor[i] = convertToPercentage(color[i])
					}
				}
			}

			color = newColor
		}

		return new TinyColor(color, options)
	}

	/**
	 * Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
	 *
	 * @param      {TinyColor}  color1  The first color
	 * @param      {TinyColor}  color2  The second color
	 * @return     {number}             The color contrast defined by (WCAG Version 2)
	 */
	static readability(color1, color2) {
		return readabilityWCAG(color1, color2)
	}

	/**
	 * Ensure that foreground and background color combinations meet WCAG2 guidelines.
	 *
	 * @param   {TinyColor}        color1        The first color
	 * @param   {TinyColor}        color2        The second color
	 * @param   {object}           wcag2         The WCAG2 properties to test
	 * @param   {object}           wcag2.level   The level to test "AA" or "AAA" (default "AA")
	 * @param   {object}           wcag2.size    The content size to test "large" or "small" (default "small")
	 * @example Tinycolor.isReadable("#000", "#111") → false
	 * @example Tinycolor.isReadable("#000", "#111", {level:"AA",size:"large"}) → false
	 * @return  {(boolean|number)} True if readable, False otherwise.
	 */
	static isReadable(color1, color2, wcag2) {
		return isWCAGReadable(color1, color2, wcag2)
	}

	/**
	 * Given a base color and a list of possible foreground or background colors for that
	 * base, returns the most readable color.
	 *
	 * Optionally returns Black or White if the most readable color is unreadable.
	 *
	 * @param   {TinyColor}    baseColor                     The base color
	 * @param   {[TinyColor]}  colorList                     An array of TinyColors
	 * @param   {object}       [args={}]                     The arguments
	 * @param   {boolean}      args.includeFallbackColors    Include fallback colors?
	 * @param   {object}       args.level                    The level to test "AA" or "AAA" (default "AA")
	 * @param   {object}       args.size                     The content size to test "large" or "small" (default "small")
	 * @example Tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"], {includeFallbackColors:false}).toHexString(); // "#112255"
	 * @example Tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"], {includeFallbackColors:true}).toHexString();  // "#ffffff"
	 * @example Tinycolor.mostReadable("#a8015a", ["#faf3f3"], {includeFallbackColors:true, level:"AAA", size:"large"}).toHexString(); // "#faf3f3"
	 * @example Tinycolor.mostReadable("#a8015a", ["#faf3f3"], {includeFallbackColors:true, level:"AAA", size:"small"}).toHexString(); // "#ffffff"
	 * @return  {TinyColor}    A TinyColor instance of the msot readable color.
	 */
	static mostReadable(baseColor, colorList, args) {
		return mostWCAGReadable(baseColor, colorList, args)
	}

	/**
	 * Mix a second colour into the first
	 *
	 * @param  {TinyColor}  color1  The first color
	 * @param  {TinyColor}  color2  The second color
	 * @param  {number}     amount  The mix amount of the second color
	 * @return {TinyColor}			   A new, mixed TinyColor instance
	 */
	static mix(color1, color2, amount) {
		return calcMix(color1, color2, amount)
	}

	/**
	 * Determines if dark.
	 *
	 * @return     {boolean}  True if dark, False otherwise.
	 */
	isDark() {
		return this.getBrightness() < 128
	}

	/**
	 * Determines if light.
	 *
	 * @return     {boolean}  True if light, False otherwise.
	 */
	isLight() {
		return !this.isDark()
	}

	/**
	 * Determines if valid.
	 *
	 * @return     {boolean}  True if valid, False otherwise.
	 */
	isValid() {
		return this._ok
	}

	/**
	 * Gets the original input.
	 *
	 * @return     {string|object}  The original input.
	 */
	getOriginalInput() {
		return this._originalInput
	}

	/**
	 * Gets the format.
	 *
	 * @return     {string}  The format.
	 */
	getFormat() {
		return this._format
	}

	/**
	 * Gets the alpha.
	 *
	 * @return     {number}  The alpha.
	 */
	getAlpha() {
		return this._a
	}

	/**
	 * Gets the brightness.
	 *
	 * @return     {number}  The brightness.
	 */
	getBrightness() {
		return calcBrightness(this.toRgb())
	}

	/**
	 * Gets the luminance.
	 *
	 * @return     {number}  The luminance.
	 */
	getLuminance() {
		return calcLuminance(rawToDeepRgba(this))
	}

	/**
	 * Return the current color as a string.
	 *
	 * @param      {string}  format  The color format
	 * @return     {string}  The current color, as a string.
	 */
	toString(format) {
		return extensionApi.print(rawToRgba(this), this._format, format)
	}

	/**
	 * Returns a name representation of the object.
	 *
	 * @return     {string}  The name of the colour.
	 */
	toName() {
		return extensionApi.print(rawToRgba(this), 'name', 'toName')
	}

	/**
	 * Returns a rgb representation of the object.
	 *
	 * @return     {object}  Rgb representation of the object.
	 */
	toRgb() {
		return rawToDeepRgba(this)
	}

	/**
	 * Returns a rgb string representation of the object.
	 *
	 * @return     {string}  Rgb string representation of the object.
	 */
	toRgbString() {
		return rgbaToString(rawToRgba(this))
	}

	/**
	 * Returns a rgb array representation of the object.
	 *
	 * @return     {[number]}  Rgb array representation of the object.
	 */
	toRgbArray() {
		return rgbaToArray(rawToRgba(this))
	}

	/**
	 * Returns a percentage rgb representation of the object.
	 *
	 * @return     {object}  Percentage rgb representation of the object.
	 */
	toPercentageRgb() {
		return rgbaToPercentageRgba(rawToDeepRgba(this))
	}

	/**
	 * Returns a percentage rgb string representation of the object.
	 *
	 * @return     {string}  Percentage rgb string representation of the object.
	 */
	toPercentageRgbString() {
		return rgbaToString(rgbaToPercentageRgba(rawToRgba(this)))
	}

	/**
	 * Return the hex string of a color, as pure hexadecimal.
	 *
	 * @param      {boolean}  allow3Char  Allow 3 digit RGB strings
	 * @return     {string}  The Hex string of the color.
	 */
	toHex(allow3Char) {
		return rgbToHex(rawToRgba(this), allow3Char)
	}

	/**
	 * Return the hex string of a color, with a leading #
	 *
	 * @param      {boolean}  allow3Char  Allow 3 digit RGB strings
	 * @return     {string}  The Hex string of the color.
	 */
	toHexString(allow3Char) {
		return `#${this.toHex(allow3Char)}`
	}

	/**
	 * Return the hex string of a color with aplha, as pure hexadecimal.
	 *
	 * @param      {boolean}  allow4Char  Allow 4 digit RGBA strings
	 * @return     {string}  The Hex string of the color.
	 */
	toHex8(allow4Char) {
		return rgbaToHex(rawToRgba(this), allow4Char)
	}

	/**
	 * Return the hex string of a color with aplha, with a leading #
	 *
	 * @param      {boolean}  allow3Char  Allow 4 digit RGBA strings
	 * @return     {string}  The Hex string of the color.
	 */
	toHex8String(allow4Char) {
		return `#${this.toHex8(allow4Char)}`
	}

	/**
	 * Returns a HSV object representation of the object.
	 *
	 * @return     {object}  HSV(A) representation of the color.
	 */
	toHsv() {
		return extensionApi.raw(rawToDeepRgba(this), 'hsv')
	}

	/**
	 * Returns a HSV string representation of the object.
	 *
	 * @return     {string}  hsv(h, s, v[, a]) representation of the color.
	 */
	toHsvString() {
		return extensionApi.print(rawToDeepRgba(this), this._format, 'hsv')
	}

	/**
	 * Returns a HSL object representation of the object.
	 *
	 * @return     {object}  HSL(A) representation of the color.
	 */
	toHsl() {
		return extensionApi.raw(rawToDeepRgba(this), 'hsl')
	}

	/**
	 * Returns a HSL string representation of the object.
	 *
	 * @return     {string}  hsl(h, s, l[, a]) representation of the color.
	 */
	toHslString() {
		return extensionApi.print(rawToDeepRgba(this), this._format, 'hsl')
	}

	/**
	 * Sets the alpha.
	 *
	 * @param      {number}  value   The alpha value (0 - 1.0)
	 * @return     {TinyColor}  The current colour with the set alpha.
	 */
	setAlpha(value) {
		this._a = boundAlpha(value)
		this._roundA = mathRound(100 * this._a) / 100
		return this
	}

	/**
	 * Creates a new instance of the object with same properties than original.
	 *
	 * @return     {TinyColor}  Copy of this object.
	 */
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

	invert(...args) {
		return modify('invert', [this, ...args])
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
