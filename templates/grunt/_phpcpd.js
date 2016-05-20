'use strict';

module.exports.tasks = {
  phpcpd: {
    options: {
      bin: 'vendor/bin/phpcpd',
      quiet: false,
      ignoreExitCode: true
    },
    application: {
      dir: '<%= dir.src %>'
    }
  }
};
