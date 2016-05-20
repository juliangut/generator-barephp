'use strict';

module.exports.tasks = {
  browserSync: {
    options: {
      proxy: <% if (control.homestead) { -%>'<%= project.name.replace(/[^a-zA-Z0-9-.]+/g, '-').replace(/^[-.]/g, '') %>.app'<% } else { -%>'localhost:9000'<% } -%>,

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
