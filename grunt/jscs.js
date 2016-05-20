/*
 * generator-barephp
 * https://github.com/juliangut/generator-barephp
 *
 * Copyright (c) 2016 Julián Gutiérrez (juliangut@gmail.com)
 * Licensed under the BSD-3-Clause license.
 */

'use strict';

module.exports.tasks = {
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
};
