'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');

var tasks = fs.readdirSync('./gulp/').filter(function(name) {
  return /(\.(js)$)/i.test(path.extname(name));
});

tasks.forEach(function(task) {
  require('./gulp/' + task);
});

gulp.task('qa', ['phplint', 'phpcs', 'phpmd', 'phpcpd']);
gulp.task('test', ['phplint', 'phpunit']);
gulp.task('security', ['composer-outdated']);

gulp.task('serve', ['phplint', <% if (!control.homestead) { -%>'connect-php'<% } else { -%>'browserSync'<% } -%>]);


gulp.task('build', ['test'], function() {
  console.log('Task ready to be implemented');
});

gulp.task('default', ['qa', 'test']);
