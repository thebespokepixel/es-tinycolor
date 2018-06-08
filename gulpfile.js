const gulp = require('gulp')
const rename = require('gulp-rename')
const rollup = require('gulp-better-rollup')
const strip = require('gulp-strip-comments')
const babel = require('rollup-plugin-babel')

const babelConfig = {
	presets: [['@babel/preset-env', {
		modules: false,
		targets: {
			node: '8.0.0'
		}
	}]]
}

gulp.task('cjs', () =>
	gulp.src('src/index.js')
		.pipe(rollup({
			plugins: [babel(babelConfig)]
		}, {
			format: 'cjs'
		}))
		.pipe(strip())
		.pipe(gulp.dest('.'))
)

gulp.task('es6', () =>
	gulp.src('src/index.js')
		.pipe(rollup({
			plugins: [babel(babelConfig)]
		}, {
			format: 'es'
		}))
		.pipe(strip())
		.pipe(rename('index.mjs'))
		.pipe(gulp.dest('.'))
)

gulp.task('default', gulp.series('cjs', 'es6'))

/* Old:
gulp.task('default', () =>
	gulp.src('src/index.js')
	.pipe(babel({
		presets: [['babel-preset-env', {
   	targets: {
			node: "10.0.0"
   	}}]]
	}))
	.pipe(gulp.dest('lib'))
)

gulp.task('bundle', cordial.macro({
	babel: {
		plugins: ['external-helpers']
	},
	exports: 'named',
	source: 'src/index.js'
}).bundle())

// Clean
gulp.task('clean', cordial.shell({
	source: ['lib', 'npm-debug.*', './.nyc_output', './coverage']
}).trash())

// Tests
gulp.task('ava', cordial.test().ava(['test/*.js']))
gulp.task('xo', cordial.test().xo(['src/*.js']))
gulp.task('test', gulp.parallel('xo', 'ava'))

// Hooks
gulp.task('start-release', gulp.series('reset', 'clean', 'bundle'))
gulp.task('test-release', gulp.series('test'))
gulp.task('finish-release', gulp.series('push-force', 'push-tags'))

// Default
gulp.task('default', gulp.series('bump', 'clean', 'bundle'))
*/
