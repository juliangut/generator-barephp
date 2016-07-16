'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var runSequence = require('run-sequence');

var tasks = fs.readdirSync('./gulp/').filter(function(task) {
  return /\.js$/i.test(path.basename(task));
});

tasks.forEach(function(task) {
  require('./gulp/' + task);
});

gulp.task('default',  function() {
  runSequence(
    'jshint',
    'jscs'
  );
});
