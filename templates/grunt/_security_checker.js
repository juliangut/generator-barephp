'use strict';

module.exports.tasks = {
  security_checker: {
    options: {
      bin: 'vendor/bin/security-checker',
      format: 'text'
    },
    application: {
      file: 'composer.lock'
    }
  }
};
