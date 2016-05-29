'use strict';

var config = require('./config');

module.exports.tasks = {
  phplint: {
    options: {
      swapPath: '/tmp'
    },
    application: [
      config.src + '/**/*.php',
      config.tests + '/**/*.php'
    ]
  }
};
