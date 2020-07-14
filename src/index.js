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
tinycolor.equals = TinyColor.equals
tinycolor.registerFormat = TinyColor.registerFormat
tinycolor.fromRatio = TinyColor.fromRatio
tinycolor.mix = TinyColor.mix
tinycolor.readability = TinyColor.readability
tinycolor.isReadable = TinyColor.isReadable
tinycolor.mostReadable = TinyColor.mostReadable
tinycolor.names = names

export {TinyColor, tinycolor, names}
