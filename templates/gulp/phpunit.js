'use strict';

var config = require('./config');

var gulp = require('gulp');
var phpunit = require('gulp-phpunit');

gulp.task('phpunit', function() {
  return gulp.src('phpunit.xml')
    .pipe(phpunit('vendor/bin/phpunit', {
      coverageHtml: config.dist + '/coverage'
    }))
    .on('error', console.error);
});
