'use strict';

var gulp = require('gulp');
var phpunit = require('gulp-phpunit');

gulp.task('phpunit', function() {
  return gulp.src('phpunit.xml')
    .pipe(phpunit('vendor/bin/phpunit', {
      coverageHtml: '<%= dir.dist %>/coverage'
    }))
    .on('error', console.error);
});
