'use strict';

var config = require('./config');

module.exports.tasks = {
  phpmd: {
    options: {
      bin: 'vendor/bin/phpmd',
      rulesets: <% if (control.customPHPMD) { -%>'phpmd.xml'<% } else { -%>'unusedcode,naming,design,controversial,codesize'<% } -%>,
      reportFormat: 'text'
    },
    application: {
      dir: config.src
    }
  }
};
