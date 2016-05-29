'use strict';

var config = require('./config');

module.exports.tasks = {
  php: {
    application: {
      options: {
        hostname: 'localhost',
        port: config.port,
        base: config.public,
        keepalive: true
      }
    }
  }
};
