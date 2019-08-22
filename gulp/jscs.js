'use strict';

var gulp = require('gulp');
var jscs = require('gulp-jscs');

gulp.task('jscs', function() {
  return gulp.src(['generators/**/*.js', 'test/**/*.js'])
    .pipe(jscs())
    .pipe(jscs.reporter());
});
