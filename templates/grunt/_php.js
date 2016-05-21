'use strict';

module.exports.tasks = {
  php: {
    application: {
      options: {
        hostname: 'localhost',
        port: 9000,
        base: '<%= dir.public %>',
        keepalive: true
      }
    }
  }
};
