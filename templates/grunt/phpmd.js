'use strict';

var config = require('./config');

module.exports.tasks = {
  phpmd: {
    options: {
      bin: 'vendor/bin/phpmd',
      rulesets: 'unusedcode,naming,design,controversial,codesize',
      reportFormat: 'text'
    },
    application: {
      dir: config.src
    }
  }
};
