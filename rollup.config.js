import cleanup from 'rollup-plugin-cleanup'

const config = {
	input: 'src/index.js',
	plugins: [cleanup()],
	output: {
		file: 'index.js',
		format: 'es',
	},
}

export default config
