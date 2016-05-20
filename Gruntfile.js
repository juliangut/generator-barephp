/*
 * generator-barephp
 * https://github.com/juliangut/generator-barephp
 *
 * Copyright (c) 2016 Julián Gutiérrez (juliangut@gmail.com)
 * Licensed under the BSD-3-Clause license.
 */

'use strict';

module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt);

  var settings = {
    config: {
      src: ['grunt/*.js*']
    }
  };
  grunt.initConfig(require('load-grunt-configs')(grunt, settings));

  grunt.registerTask('default', ['jscs', 'jshint']);
};
