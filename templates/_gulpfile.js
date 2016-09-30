'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var runSequence = require('run-sequence');

var tasks = fs.readdirSync('./gulp/').filter(function(task) {
  return /^(?!config)[\w_-]+\.js$/i.test(path.basename(task));
});

tasks.forEach(function(task) {
  require('./gulp/' + task);
});

gulp.task('qa', function() {
  runSequence(
    'phplint',
    ['phpcs', 'phpmd', 'phpcpd']
  );
});

gulp.task('test', function() {
  runSequence(
    'phplint',
    'phpunit'
  );
});

gulp.task('security', ['composer-outdated']);

<% if (project.type === 'project') { -%>
gulp.task('serve', function() {
  runSequence(
    'phplint',
<% if (!control.homestead) { -%>
    'connect-php', // To change localhost port head to ./gulp/config.js
<% } -%>
    'browserSync'
  );
});

<% } -%>
gulp.task('build', function() {
  console.log('Task ready to be implemented');
});

gulp.task('default', ['qa', 'test']);
