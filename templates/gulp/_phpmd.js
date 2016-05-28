'use strict';

var gulp = require('gulp');
var phpmd = require('gulp-phpmd');

gulp.task('phpmd', function() {
  return gulp.src([
    '<%= dir.src %>/**/*.php'
  ])
    .pipe(phpmd({
      bin: 'vendor/bin/phpmd',
      ruleset: 'unusedcode,naming,design,controversial,codesize',
      format: 'text'
    }))
    .on('error', console.error);
});
