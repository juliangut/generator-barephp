'use strict';

var config = require('./config');

var gulp = require('gulp');
var phpcs = require('gulp-phpcs');

gulp.task('phpcs', function() {
  return gulp.src([config.src + '/**/*.php', config.tests + '/**/*.php'])
    .pipe(phpcs({
      bin: 'vendor/bin/phpcs',
      standard: <% if (control.customPHPCS) { -%>'phpcs.xml'<% } else { -%>'PSR2'<% } -%>,
      warningSeverity: 0
    }))
    .pipe(phpcs.reporter('log'));
});
