'use strict';

var config = require('./config');

module.exports.tasks = {
  phpunit: {
    options: {
      bin: 'vendor/bin/phpunit',
      coverage: true
    },
    application: {
      coverageHtml: config.build + '/coverage'
    }
  }
};
