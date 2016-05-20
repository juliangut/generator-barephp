'use strict';

module.exports.tasks = {
  phpunit: {
    options: {
      bin: 'vendor/bin/phpunit',
      coverage: true
    },
    application: {
      coverageHtml: '<%= dir.dist %>/coverage'
    }
  }
};
