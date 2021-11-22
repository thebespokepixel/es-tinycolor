import cleanup from 'rollup-plugin-cleanup'

const config = [{
	input: 'src/index.js',
	plugins: [cleanup({comments: [/^\*\*/]})],
	output: {
		file: 'esm/index.js',
		format: 'es',
	},
}, {
	input: 'src/index.js',
	plugins: [cleanup({comments: [/^\*\*/]})],
	output: {
		file: 'cjs/index.js',
		format: 'cjs',
	},
}]

export default config
