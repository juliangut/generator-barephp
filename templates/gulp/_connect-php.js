'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect-php');

gulp.task('connect-php', function() {
  connect.server({
    hostname: 'localhost',
    port: 9000,
    base: '<%= dir.public %>'
  });
});
