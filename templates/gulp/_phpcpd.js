'use strict';

var gulp = require('gulp');
var phpcpd = require('gulp-phpcpd');

gulp.task('phpcpd', function() {
  return gulp.src([
    '<%= dir.src %>/**/*.php'
  ])
  .pipe(phpcpd({
    quiet: true
  }))
  .on('error', console.error);
});
