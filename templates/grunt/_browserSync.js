'use strict';

module.exports.tasks = {
  browserSync: {
    options: {
<% if (control.homestead) { -%>
      proxy: '<%= project.name.replace(/[^a-zA-Z0-9-.]+/g, '-').replace(/^[-.]/g, '') %>.app',
<% } else { -%>
      proxy: 'localhost:9000',
<% } -%>
      logLevel: 'silent',
      watchTask: true
    },
    application: {
      src: [
        '<%= dir.src %>/**/*.php',
        '<%= dir.public %>/**/*.*'
      ]
    }
  }
};
