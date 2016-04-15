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
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      application: [
        'app/index.js',
        'test/generator-barephp.js',
        'Gruntfile.js'
      ]
    },
    jscs: {
      options: {
        config: '.jscsrc',
        verbose: true
      },
      application: [
        'app/index.js',
        'test/generator-barephp.js',
        'Gruntfile.js'
      ]
    }
  });

  grunt.registerTask('default', ['jscs', 'jshint']);
};
