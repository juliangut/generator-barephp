/*
 * generator-barephp
 * https://github.com/juliangut/generator-barephp
 *
 * Copyright (c) 2019 Julián Gutiérrez (juliangut@gmail.com)
 * Licensed under the BSD-3-Clause license.
 */

'use strict';

const Generator = require('yeoman-generator');
const _ = require('underscore.string');

module.exports = class extends Generator{
  constructor(args, opts) {
    super(args, opts);

    this.config.set('new', true);
  }

  prompting() {
    const prompts = [
      {
        type: 'list',
        name: 'type',
        message: 'Would you like to assign a public repository?',
        choices: ['none', 'github', 'bitbucket', 'gitlab'],
        default: this.config.get('repositoryType')
      }
    ];

    return this.prompt(prompts).then(answers => {
      this.config.set('repositoryType', answers.type);

      if (answers.type !== 'none') {
        return this._repositoryAccount();
      }
    });
  }

  _repositoryAccount() {
    const prompts = [
      {
        name: 'account',
        message: 'What is your repository account name?',
        default: this.config.get('accountRepository') !== '' ?
          this.config.get('accountRepository') :
          this.config.get('ownerCanonical')
      }
    ];

    return this.prompt(prompts).then(answers => {
      const accountRepository = _.cleanDiacritics(_.clean(answers.account)).replace(/\s+/g, '_');

      if (this.config.get('accountPackagist') === '') {
        this.config.set('accountPackagist', accountRepository);
      }
      if (this.config.get('accountTravis') === '') {
        this.config.set('accountTravis', accountRepository);
      }
      if (this.config.get('accountCoveralls') === '') {
        this.config.set('accountCoveralls', accountRepository);
      }
      if (this.config.get('accountScrutinizer') === '') {
        this.config.set('accountScrutinizer', accountRepository);
      }

      let repositorySSH = 'git@';
      let repositoryUrl = 'https://';
      switch (this.config.get('repositoryType')) {
        case 'github':
          repositorySSH += 'github.com';
          repositoryUrl += 'github.com';
          break;
        case 'bitbucket':
          repositorySSH += 'bitbucket.com';
          repositoryUrl += 'bitbucket.org';
          break;
        case 'gitlab':
          repositorySSH += 'gitlab.com';
          repositoryUrl += 'gitlab.com';
          break;
      }

      this.config.set('accountRepository', accountRepository);
      this.config.set('repositorySSH', repositorySSH + ':' + accountRepository + '/');
      this.config.set('repositoryHomepage', repositoryUrl + '/' + accountRepository + '/');
    });
  }
};
