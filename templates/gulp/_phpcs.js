'use strict';

var gulp = require('gulp');
var phpcs = require('gulp-phpcs');

gulp.task('phpcs', function() {
  return gulp.src([
    '<%= dir.src %>/**/*.php',
    '<%= dir.tests %>/**/*.php'
  ])
  .pipe(phpcs({
    bin: 'vendor/bin/phpcs',
    standard: 'PSR2',
    warningSeverity: 0
  }))
  .pipe(phpcs.reporter('fail'));
});
