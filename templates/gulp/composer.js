'use strict';

var gulp = require('gulp');
var composer = require('gulp-composer');

gulp.task('composer-outdated', function() {
  composer('outdated', {
    async : false,
    direct: true
  });
});
