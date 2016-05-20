'use strict';

module.exports.tasks = {
  phplint: {
    options: {
      swapPath: '/tmp'
    },
    application: [
      '<%= dir.src %>/**/*.php',
      '<%= dir.tests %>/**/*.php'
    ]
  }
};
