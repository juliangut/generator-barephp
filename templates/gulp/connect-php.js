'use strict';

var config = require('./config');

var gulp = require('gulp');
var connect = require('gulp-connect-php');

gulp.task('connect-php', function() {
  connect.server({
    hostname: 'localhost',
    port: config.port,
    base: config.public
  });
});
