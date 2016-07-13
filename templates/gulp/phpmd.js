'use strict';

var config = require('./config');

var gulp = require('gulp');
var phpmd = require('gulp-phpmd-plugin');

gulp.task('phpmd', function() {
  return gulp.src([config.src + '/**/*.php'])
    .pipe(phpmd({
      bin: 'vendor/bin/phpmd',
      ruleset: 'unusedcode,naming,design,controversial,codesize',
      format: 'text'
    }))
    .pipe(phpmd.reporter('log'));
});
