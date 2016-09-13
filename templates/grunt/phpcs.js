'use strict';

var config = require('./config');

module.exports.tasks = {
  phpcs: {
    options: {
      bin: 'vendor/bin/phpcs',
      standard: 'PSR2'
    },
    application: {
      dir: [
        config.src,
        config.tests
      ]
    }
  }
};
