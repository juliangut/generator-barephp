/*
 * generator-barephp
 * https://github.com/juliangut/generator-barephp
 *
 * Copyright (c) 2019 Julián Gutiérrez (juliangut@gmail.com)
 * Licensed under the BSD-3-Clause license.
 */

'use strict';

const Generator = require('yeoman-generator');
const util = require('util');
const _ = require('underscore.string');
const validator = require('validator');

module.exports = class extends Generator{
  constructor(args, opts) {
    super(args, opts);

    this.config.set('new', true);
  }

  prompting() {
    const prompts = [
      {
        name: 'name',
        message: 'What is your name?',
        default: this.config.get('ownerName')
      },
      {
        name: 'email',
        message: 'What is your email?',
        default: this.config.get('ownerEmail')
      },
      {
        name: 'homepage',
        message: 'What is your homepage?',
        default: this.config.get('ownerHomepage')
      }
    ];

    return this.prompt(prompts).then(answers => {
      this.config.set('ownerName', _.clean(answers.name));

      var ownerEmail = _.clean(answers.email).split(' ').shift();
      if (ownerEmail !== '' && !validator.isEmail(ownerEmail)) {
        throw new Error(util.format('"%s" is not a valid email', ownerEmail));
      }
      this.config.set('ownerEmail', ownerEmail);

      const canonical = ownerEmail !== '' ?
        ownerEmail.split('@')[0] :
        _.clean(answers.name).replace(/\s+/g, '-');
      this.config.set('ownerCanonical', _.cleanDiacritics(canonical).toLowerCase());

      var ownerHomepage = _.clean(answers.homepage).split(' ').shift();
      if (ownerHomepage !== '') {
        if (!validator.isURL(ownerHomepage)) {
          throw new Error(util.format('"%s" is not a valid URL', ownerHomepage));
        }

        if (!/^https?:\/\//.test(ownerHomepage)) {
          ownerHomepage = 'http://' + ownerHomepage;
        }
      }
      this.config.set('ownerHomepage', ownerHomepage);
    });
  }
};
