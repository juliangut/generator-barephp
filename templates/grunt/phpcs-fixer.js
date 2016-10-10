'use strict';

var config = require('./config');

module.exports.tasks = {
  phpcsfixer: {
    options: {
      bin: 'vendor/bin/php-cs-fixer',
      configfile: '.php_cs',
      ignoreExitCode: true
    },
    fix: {
    },
    test: {
      options: {
        dryRun: true,
        verbose: true
      }
    }
  }
};
