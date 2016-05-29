'use strict';

var config = require('./config');

module.exports.tasks = {
  browserSync: {
    options: {
      proxy: <% if (control.homestead) { -%>'<%= project.name.replace(/[^a-zA-Z0-9-.]+/g, '-').replace(/^[-.]/g, '') %>.app'<% } else { -%>'localhost:' + config.port<% } -%>,

      logLevel: 'silent',
      watchTask: true
    },
    application: {
      src: [
        config.src + '/**/*.php',
        config.public + '/**/*.*'
      ]
    }
  }
};
