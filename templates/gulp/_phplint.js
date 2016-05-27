'use strict';

var gulp = require('gulp');
var phplint = require('gulp-phplint');

gulp.task('phplint', function() {
  return gulp.src([
    '<%= dir.src %>/**/*.php',
    '<%= dir.tests %>/**/*.php'
  ])
  .pipe(phplint())
  .on('error', console.error);
});
