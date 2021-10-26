/*
 *  ES-TinyColor : Color Extension Class
 * ────────────────────────────────────────────────────────────────────────────
 */

export default class TinyColorExtension {
	constructor(api, id, options = {}) {
		this.api = api
		this.id = id
		this.options = options
	}

	use(specified) {
		this.wanted = specified
		return this
	}

	parse(input) {
		const result = this.api.findColor(input)
		return {
			as: format => Object.assign(result, {format}),
			rgba: {
				r: result.r,
				g: result.g,
				b: result.b,
				a: result.a,
			},
			valueOf: () => result,
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
