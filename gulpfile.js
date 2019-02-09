const gulp = require('gulp')
const rename = require('gulp-rename')
const rollup = require('gulp-better-rollup')
const babel = require('rollup-plugin-babel')

const babelConfig = {
	presets: [
		['@babel/preset-env', {
			modules: false,
			targets: {
				node: '8.0.0'
			}
		}]
	],
	comments: false
}

gulp.task('cjs', () =>
	gulp.src('src/index.js')
		.pipe(rollup({
			plugins: [babel(babelConfig)]
		}, {
			format: 'cjs'
		}))
		.pipe(gulp.dest('.'))
)

gulp.task('es6', () =>
	gulp.src('src/index.js')
		.pipe(rollup({
			plugins: [babel(babelConfig)]
		}, {
			format: 'es'
		}))
		.pipe(rename('index.mjs'))
		.pipe(gulp.dest('.'))
)

gulp.task('default', gulp.series('cjs', 'es6'))
