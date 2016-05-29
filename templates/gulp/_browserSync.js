'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('browserSync', function() {
  browserSync.init({
    proxy: <% if (control.homestead) { -%>'<%= project.name.replace(/[^a-zA-Z0-9-.]+/g, '-').replace(/^[-.]/g, '') %>.app'<% } else { -%>'localhost:9000'<% } -%>

  });
});
