'use strict';

module.exports.tasks = {
  phpmd: {
    options: {
      bin: 'vendor/bin/phpmd',
      rulesets: 'unusedcode,naming,design,controversial,codesize',
      reportFormat: 'text'
    },
    application: {
      dir: '<%= dir.src %>'
    }
  }
};
