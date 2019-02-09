/*
 *  ES-TinyColor : Color Extension API Class
 *  ────────────────────────────────────────────────────────────────────────────
 */

import TinyColorExtension from './tinycolor-extension'

const _template = {
	format: false,
	ok: false,
	r: 0,
	g: 0,
	b: 0,
	a: 1
}

export default class TinyColorExtensionAPI {
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
		this.colorspaces[id] = new TinyColorExtension(this, id, {...this.opts, ...opts})
		if (opts.alias) {
			opts.alias.forEach(id_ => {
				this.colorspaces[id_] = this.colorspaces[id]
			})
		}

		return this.colorspaces[id]
	}

	find(input) {
		const color = {..._template}
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

		return {r: rgba.r / 255, g: rgba.g / 255, b: rgba.b / 255, a: rgba.a}
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
