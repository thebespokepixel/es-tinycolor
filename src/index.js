/*
 *  ES-TinyColor v0.4.1
 *  ────────────────────────────────────────────────────────────────────────────
 *  © 2016 Mark Griffiths @ The Bespoke Pixel (MIT licensed)
 *  Based on TinyColor © Brian Grinstead
 */
/* eslint import/no-unassigned-import: 0 */
import TinyColor from './lib/classes/tinycolor'

import './lib/extensions/rgb'
import './lib/extensions/prgb'
import './lib/extensions/hex'
import './lib/extensions/hex8'
import './lib/extensions/hsl'
import './lib/extensions/hsv'
import {names} from './lib/extensions/name'

function tinycolor(color, options) {
	return new TinyColor(color, options)
}

// Expose static methods if called from function.

/**
 * Are two TinyColor colours equivalent?
 *
 * @alias  tinycolor.equals
 * @param  {TinyColor}  color1  The first color
 * @param  {TinyColor}  color2  The second color
 * @return {boolean}    Equivalent or not?
 */
tinycolor.equals = (color1, color2) => TinyColor.equals(color1, color2)

/**
 * Register a TinyColor extension
 *
 * @alias  tinycolor.registerFormat
 * @param  {string}  id                   The plugin identifier
 * @param  {object}  [options={}]         Plugin options
 * @param  {string}  options.alphaFormat  rgb|hex
 * @param  {boolean} options.shortHex     Short hex codes #ABC, if possible
 * @param  {boolean} options.upperCaseHex User UPPER case hex
 * @return {TinyColorExtension}           The TinyColor extension
 */
tinycolor.registerFormat = (id, options = {}) => TinyColor.registerFormat(id, options)

/**
 * Create a new TinyColor from values from 0..1
 *
 * @alias  tinycolor.fromRatio
 * @param  {object}    color    The color values
 * @param  {object}    options  Options to pass to TinyColor constructor
 * @return {TinyColor}          A TinyColor instance
 */
tinycolor.fromRatio = (color, options) => TinyColor.fromRatio(color, options)

/**
 * Mix a second colour into the first
 *
 * @alias  tinycolor.mix
 * @param  {TinyColor}  color1  The first color
 * @param  {TinyColor}  color2  The second color
 * @param  {number}     amount  The mix amount of the second color
 * @return {TinyColor}			   A new, mixed TinyColor instance
 */
tinycolor.mix = (color1, color2, amount) => TinyColor.mix(color1, color2, amount)

/**
 * How readable is the first color over the second color
 *
 * @alias  tinycolor.readability
 * @param  {TinyColor}  color1  The first color
 * @param  {TinyColor}  color2  The second color
 * @return {number}             The color contrast defined by (WCAG Version 2)
 */
tinycolor.readability = (color1, color2) => TinyColor.readability(color1, color2)

/**
 * Ensure that foreground and background color combinations meet WCAG2 guidelines.
 *
 * @alias  tinycolor.isReadable
 * @param   {TinyColor}        color1        The first color
 * @param   {TinyColor}        color2        The second color
 * @param   {object}           wcag2         The WCAG2 properties to test
 * @param   {object}           wcag2.level   The level to test "AA" or "AAA" (default "AA")
 * @param   {object}           wcag2.size    The content size to test "large" or "small" (default "small")
 * @example                                  tinycolor.isReadable("#000", "#111") → false
 * @example                                  tinycolor.isReadable("#000", "#111", {level:"AA",size:"large"}) → false
 * @return  {(boolean|number)} True if readable, False otherwise.
 */
tinycolor.isReadable = (color1, color2, wcag2) => TinyColor.isReadable(color1, color2, wcag2)

/**
 * Given a base color and a list of possible foreground or background colors for that
 * base, returns the most readable color.
 *
 * Optionally returns Black or White if the most readable color is unreadable.
 *
 * @alias  tinycolor.mostReadable
 * @param   {TinyColor}    baseColor                     The base color
 * @param   {[TinyColor]}  colorList                     An array of TinyColors
 * @param   {object}       [args={}]                     The arguments
 * @param   {boolean}      args.includeFallbackColors    Include fallback colors?
 * @param   {object}       args.level                    The level to test "AA" or "AAA" (default "AA")
 * @param   {object}       args.size                     The content size to test "large" or "small" (default "small")
 * @example tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
 * @example tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
 * @example tinycolor.mostReadable("#a8015a", ["#faf3f3"], {includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
 * @example tinycolor.mostReadable("#a8015a", ["#faf3f3"], {includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
 * @return  {TinyColor}    A TinyColor instance of the msot readable color.
 */
tinycolor.mostReadable = (baseColor, colorList, args) => TinyColor.mostReadable(baseColor, colorList, args)

/**
 * Named Colours (as per CSS color names)
 */
tinycolor.names = names

export {TinyColor, tinycolor, names}
