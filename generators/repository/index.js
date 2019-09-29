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
        name: 'repositoryType',
        type: 'list',
        message: 'Would you like to assign a public repository?',
        choices: ['none', 'github', 'bitbucket', 'gitlab'],
        default: this.config.get('repositoryType')
      }
    ];

    return this.prompt(prompts).then(async answers => {
      this.config.set('repositoryType', answers.repositoryType);

      if (answers.repositoryType !== 'none') {
        await this._repositoryAccount();

        if (answers.repositoryType === 'github') {
          await this._githubTemplates()
        }
      }
    });
  }

  _repositoryAccount() {
    const prompts = [
      {
        name: 'repositoryAccount',
        message: 'What is your repository account name?',
        default: this.config.get('accountRepository') !== '' ?
          this.config.get('accountRepository') :
          this.config.get('ownerCanonical')
      }
    ];

    return this.prompt(prompts).then(answers => {
      const accountRepository = _.cleanDiacritics(_.clean(answers.repositoryAccount)).replace(/\s+/g, '_');

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

  _githubTemplates() {
    const prompts = [
      {
        name: 'controlRepositoryTemplates',
        type: 'confirm',
        message: 'Would you like to include issue and pull request templates?',
        default: this.config.get('controlRepositoryTemplates')
      }
    ];

    return this.prompt(prompts).then(answers => {
      this.config.set('controlRepositoryTemplates', answers.controlRepositoryTemplates);
    });
  }

  writing() {
    if (!this.config.get('controlRepositoryTemplates')) {
      return;
    }

    this.fs.copy(this.templatePath('ISSUE_TEMPLATE.md'), this.destinationPath('ISSUE_TEMPLATE.md'));
    this.fs.copy(this.templatePath('PULL_REQUEST_TEMPLATE.md'), this.destinationPath('PULL_REQUEST_TEMPLATE.md'));
  }
};
