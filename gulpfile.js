const gulp = require('gulp')
const cordial = require('@thebespokepixel/cordial')()

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
