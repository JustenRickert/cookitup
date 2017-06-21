var gulp = require('gulp'),
    watch = require('gulp-watch'),
    minify = require('gulp-minify'),
    browserify = require('gulp-browserify')

gulp.task('default', () => {
  return watch('_js/*.js', {
    ignoreInitial: false
  })
    .pipe(browserify({presets: ['es2015']}))
    .pipe(minify({ext:{ min:'.js'}}))
    .pipe(gulp.dest('dist'))
})
