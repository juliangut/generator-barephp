'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect-php');
var browserSync = require('browser-sync');

gulp.task('connect-php', function() {
  connect.server({
    hostname: 'localhost',
    port: 9000,
    base: '<%= dir.public %>'
  }, function() {
    browserSync.init({
      proxy: 'localhost:9000'
    });
  });
});
