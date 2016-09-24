const gulp = require('gulp')
const cordial = require('@thebespokepixel/cordial')()

gulp.task('bundle', cordial.macro({
	babel: {
		plugins: ['external-helpers']
	},
	exports: 'named',
	source: 'src/index.js'
}).basic())

gulp.task('master', cordial.macro({
	master: true,
	babel: {
		plugins: ['external-helpers']
	},
	source: 'src/index.js'
}).basic())

// Tests
gulp.task('ava', cordial.test().ava(['test/*.js']))
gulp.task('xo', cordial.test().xo(['src/*.js']))
gulp.task('test', gulp.parallel('xo', 'ava'))

// Hooks
gulp.task('start-release', gulp.series('reset', 'master'))
gulp.task('test-release', gulp.series('test'))
gulp.task('finish-release', gulp.series('push-force', 'push-tags'))

// Default
gulp.task('default', gulp.series('bump', 'bundle'))
