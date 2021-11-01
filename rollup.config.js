import cleanup from 'rollup-plugin-cleanup'

const config = {
	input: 'src/index.js',
	plugins: [cleanup({comments: [/^\*\*/]})],
	output: {
		file: 'index.js',
		format: 'es',
	},
}

export default config
