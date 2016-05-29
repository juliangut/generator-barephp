'use strict';

var config = require('./config');

var gulp = require('gulp');
var phpcpd = require('gulp-phpcpd');

gulp.task('phpcpd', function() {
  return gulp.src([config.src + '/**/*.php'])
    .pipe(phpcpd({
      bin: 'vendor/bin/phpcpd',
      quiet: true
    }))
    .on('error', console.error);
});
