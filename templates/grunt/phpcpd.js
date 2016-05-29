'use strict';

var config = require('./config');

module.exports.tasks = {
  phpcpd: {
    options: {
      bin: 'vendor/bin/phpcpd',
      quiet: false,
      ignoreExitCode: true
    },
    application: {
      dir: config.src
    }
  }
};
