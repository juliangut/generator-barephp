/*
 * generator-barephp
 * https://github.com/juliangut/generator-barephp
 *
 * Copyright (c) 2016 Julián Gutiérrez (juliangut@gmail.com)
 * Licensed under the BSD-3-Clause license.
 */

'use strict';

var generators = require('yeoman-generator');
var util = require('util');
var path = require('path');
var yosay = require('yosay');
var chalk = require('chalk');
var validator = require('validator');
var _ = require('underscore.string');
var mkdirp = require('mkdirp');
var shell = require('shelljs');
var fs = require('fs');
var sprintf = require('sprintf-js').sprintf;

var BarePHP = module.exports = function BarePHP() {
  generators.Base.apply(this, arguments);

  this.defaults = {
    quickMode: false,
    freshRun: true,
    globalComposer: false,
    localComposer: false,
    owner: {
      name: null,
      canonical: null,
      email: null,
      homepage: null
    },
    project: {
      description: null,
      type: 'project',
      keywords: [],
      homepage: null,
      license: 'MIT',
      licenseFile: 'mit',
      phpVersion: 7.0,
      testPhpVersion: 7.0,
      supportNightly: true
    },
    config: {
      controlRepository: true,
      controlDirs: false,
      controlLicense: true,
      controlPackagist: true,
      controlTravis: true,
      controlCoveralls: true,
      controlScrutinizer: true,
      controlStyleci: true,
      controlDevEnv: null,
      controlPhpMyAdmin: false,
      controlDocs: true,
      repositoryType: 'Github',
      repositorySSH: null,
      repositoryHomepage: null,
      projectName: null,
      projectNamespace: null,
      dirSrc: 'src',
      dirTests: 'tests',
      dirBuild: 'build',
      dirPublic: 'public',
      accountRepository: null,
      accountPackagist: null,
      accountTravis: null,
      accountCoveralls: null,
      accountScrutinizer: null,
      accountStyleci: null,
      homesteadFormat: 'yaml',
      homesteadIP: sprintf('192.168.%1$d.%1$d', Math.max(100, Math.floor(Math.random() * 255)))
    }
  };

  if (!shell.which('git')) {
    var userHomeDirectory = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

    this.defaults.owner.name = _.clean(userHomeDirectory.split(path.sep).pop());
  } else {
    this.defaults.owner.name = _.clean(shell.exec('git config user.name', {silent: true}).output, '\n');
    this.defaults.owner.email = _.clean(shell.exec('git config user.email', {silent: true}).output, '\n');
    this.defaults.owner.homepage = _.clean(shell.exec('git config user.homepage', {silent: true}).output, '\n');
  }

  if (fs.existsSync('composer.json')) {
    var configs = JSON.parse(fs.readFileSync('composer.json'));

    if (configs.authors && configs.authors instanceof Array) {
      this.defaults.owner.name = configs.authors[0].name ? configs.authors[0].name : this.defaults.owner.name;
      this.defaults.owner.email = configs.authors[0].email ? configs.authors[0].email : this.defaults.owner.email;
      this.defaults.owner.homepage = configs.authors[0].homepage ? configs.authors[0].homepage : this.defaults.owner.homepage;
    }

    if (configs.description) {
      this.defaults.project.description = configs.description;
    }
    if (configs.type) {
      this.defaults.project.type = configs.type;
    } else {
      this.defaults.project.type = 'library';
    }
    if (configs.keywords && configs.keywords instanceof Array) {
      this.defaults.project.keywords = configs.keywords;
    }
    if (configs.homepage) {
      this.defaults.project.homepage = configs.homepage;
    }
    if (configs.license) {
      this.defaults.project.license = configs.license;
    }

    if (configs.require.php) {
      this.defaults.project.phpVersion = parseFloat(configs.require.php.replace(/^([<>=^~ ]+)?/, ''));
    }
  }

  if (fs.existsSync('composer.lock')) {
    this.defaults.freshRun = false;
  }

  this.config.defaults(this.defaults.config);
};

util.inherits(BarePHP, generators.Base);

BarePHP.prototype.welcome = function() {
  this.log(
    yosay('\'Allo \'allo!\nOut of the box I include GIT, Composer, Travis, Docker and many more integrations!')
  );
};

BarePHP.prototype.askForMode = function() {
  var done = this.async();
  var prompts = [
    {
      type: 'confirm',
      name: 'quickMode',
      message: 'Would you like the quick assistant?',
      default: this.defaults.quickMode
    }
  ];

  this.prompt(prompts, function(props) {
    this.defaults.quickMode = props.quickMode;

    done();
  }.bind(this));
};

BarePHP.prototype.askForOwner = function() {
  var done = this.async();
  var prompts = [
    {
      name: 'name',
      message: 'What is your name?',
      default: this.defaults.owner.name
    },
    {
      name: 'email',
      message: 'What is your email?',
      default: this.defaults.owner.email
    },
    {
      name: 'homepage',
      message: 'What is your homepage?',
      default: this.defaults.owner.homepage
    }
  ];

  this.prompt(prompts, function(props) {
    this.defaults.owner.name = _.clean(props.name);
    this.defaults.owner.canonical = _.cleanDiacritics(_.clean(props.name)).replace(/\s+/g, '-').toLowerCase();

    var ownerEmail = _.clean(props.email).split(' ').shift();
    if (ownerEmail !== '' && !validator.isEmail(ownerEmail)) {
      throw new Error(util.format('"%s" is not a valid email', ownerEmail));
    }
    this.defaults.owner.email = ownerEmail;

    var ownerHomepage = _.clean(props.homepage).split(' ').shift();
    if (ownerHomepage !== '') {
      if (!validator.isURL(ownerHomepage)) {
        throw new Error(util.format('"%s" is not a valid URL', ownerHomepage));
      }

      if (!/^https?:\/\//.test(ownerHomepage)) {
        ownerHomepage = 'http://' + ownerHomepage;
      }
    }
    this.defaults.owner.homepage = ownerHomepage;

    done();
  }.bind(this));
};

BarePHP.prototype.askForRepositoryUse = function() {
  var done = this.async();
  var prompts = [
    {
      type: 'confirm',
      name: 'useRepository',
      message: 'Would you like to assign a public repository (Github/Bitbucket)?',
      default: this.config.get('controlRepository')
    }
  ];

  this.prompt(prompts, function(props) {
    this.config.set('controlRepository', props.useRepository);

    done();
  }.bind(this));
};

BarePHP.prototype.askForRepository = function() {
  if (!this.config.get('controlRepository')) {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      type: 'list',
      name: 'type',
      message: 'What repository is the project hosted on?',
      choices: ['Github', 'Bitbucket'],
      default: _.capitalize(this.config.get('repositoryType'))
    },
    {
      name: 'account',
      message: 'What is your repository account name?',
      default: this.config.get('accountRepository') ?
        this.config.get('accountRepository') :
        this.defaults.owner.canonical
    }
  ];

  this.prompt(prompts, function(props) {
    this.config.set('repositoryType', props.type.toLowerCase());

    var accountRepository = _.cleanDiacritics(_.clean(props.account)).replace(/\s+/g, '_');

    if (!this.config.get('accountPackagist')) {
      this.config.set('accountPackagist', accountRepository);
    }

    if (!this.config.get('accountTravis')) {
      this.config.set('accountTravis', accountRepository);
    }
    if (!this.config.get('accountCoveralls')) {
      this.config.set('accountCoveralls', accountRepository);
    }
    if (!this.config.get('accountScrutinizer')) {
      this.config.set('accountScrutinizer', accountRepository);
    }

    var repositorySSH = 'git@';
    var repositoryUrl = 'https://';
    switch (props.type.toLowerCase()) {
      case 'github':
        repositorySSH += 'github.com';
        repositoryUrl += 'github.com';
        break;
      case 'bitbucket':
        repositorySSH += 'bitbucket.com';
        repositoryUrl += 'bitbucket.org';
        break;
    }

    this.config.set('accountRepository', accountRepository);
    this.config.set('repositorySSH', repositoryUrl + ':' + accountRepository + '/');
    this.config.set('repositoryHomepage', repositoryUrl + '/' + accountRepository + '/');

    done();
  }.bind(this));
};

BarePHP.prototype.askForProject = function() {
  var done = this.async();
  var prompts = [
    {
      name: 'name',
      message: 'What is the project name?',
      default: this.config.get('projectName') ?
        this.config.get('projectName') :
        _.cleanDiacritics(process.cwd().split(path.sep).pop()).replace(/\s+/g, '_')
    }
  ];

  this.prompt(prompts, function(props) {
    this.config.set('projectName', _.clean(_.cleanDiacritics(props.name)).replace(/\s+/g, '_'));

    if (!this.config.get('projectNamespace')) {
      this.config.set('projectNamespace', _.capitalize(_.camelize(this.config.get('projectName'))));
    }

    if (this.config.get('controlRepository')) {
      this.config.set(
        'repositorySSH',
        this.config.get('repositorySSH') + this.config.get('projectName') + '.git'
      );

      this.config.set(
        'repositoryHomepage',
        this.config.get('repositoryHomepage') + this.config.get('projectName')
      );
    }

    done();
  }.bind(this));
};

BarePHP.prototype.askForProjectContinue = function() {
  if (this.defaults.quickMode) {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      name: 'description',
      message: 'What is the project description?',
      default: this.defaults.project.description
    },
    {
      type: 'list',
      name: 'projectType',
      message: 'What type is the project?',
      choices: ['library', 'project', 'metapackage', 'composer-plugin'],
      default: this.defaults.project.type
    },
    {
      name: 'keywords',
      message: 'What are the project keywords? (comma separated)',
      default: this.defaults.project.keywords.join(', ')
    },
    {
      name: 'homepage',
      message: 'What is the project homepage?',
      default: this.defaults.project.homepage ?
        this.defaults.project.homepage :
        (this.config.get('controlRepository') ? this.config.get('repositoryHomepage') : '')
    }
  ];

  this.prompt(prompts, function(props) {
    props.keywords = _.clean(props.keywords);

    this.defaults.project.description = _.trim(props.description);
    this.defaults.project.type = props.projectType.toLowerCase();

    if (this.defaults.project.type === 'project' && this.config.get('controlDevEnv') === null) {
      this.config.set('controlDevEnv', 'docker');
    }

    this.defaults.project.keywords = props.keywords.length ?
      props.keywords.replace(/(\s+)?,\s+?/g, ',').replace(/,$/, '').split(',') :
      [];

    var projectHomepage  = _.trim(props.homepage).split(' ').shift();
    if (projectHomepage !== '') {
      if (!validator.isURL(projectHomepage)) {
        throw new Error(util.format('"%s" is not a valid URL', projectHomepage));
      }

      if (!/^https?:\/\//.test(projectHomepage)) {
        projectHomepage = 'http://' + projectHomepage;
      }
    }
    this.defaults.project.homepage = projectHomepage;

    done();
  }.bind(this));
};

BarePHP.prototype.askForLicenseUse = function() {
  if (this.defaults.quickMode) {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      type: 'confirm',
      name: 'useLicense',
      message: 'Would you like to assign a license?',
      default: this.config.get('controlLicense')
    }
  ];

  this.prompt(prompts, function(props) {
    this.config.set('controlLicense', props.useLicense);

    done();
  }.bind(this));
};

BarePHP.prototype.askForLicense = function() {
  if (this.defaults.quickMode || !this.config.get('controlLicense')) {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      type: 'list',
      name: 'license',
      message: 'What license do you want to use?',
      choices: [
        'Apache-2.0',
        'BSD-2-Clause',
        'BSD-3-Clause',
        'BSD-4-Clause',
        'GPL-2.0',
        'GPL-3.0',
        'LGPL-3.0',
        'MIT',
        'Proprietary'
      ],
      default: this.defaults.project.license
    }
  ];

  this.prompt(prompts, function(props) {
    this.defaults.project.license = props.license;

    var licenseFile = '';
    switch (props.license) {
      case 'Apache-2.0':
        licenseFile = 'apache-2';
        break;
      case 'BSD-2-Clause':
        licenseFile = 'bsd-free';
        break;
      case 'BSD-3-Clause':
        licenseFile = 'bsd-new';
        break;
      case 'BSD-4-Clause':
        licenseFile = 'bsd-original';
        break;
      case 'GPL-2.0':
        licenseFile = 'gpl-2';
        break;
      case 'GPL-3.0':
        licenseFile = 'gpl-3';
        break;
      case 'LGPL-3.0':
        licenseFile = 'lgpl-3';
        break;
      case 'MIT':
        licenseFile = 'mit';
        break;
      case 'Proprietary':
        licenseFile = 'proprietary';
        break;
    }

    this.defaults.project.licenseFile = licenseFile;

    done();
  }.bind(this));
};

BarePHP.prototype.askCodeConfig = function() {
  var done = this.async();
  var prompts = [
    {
      type: 'list',
      name: 'phpVersion',
      message: 'What is the minimum supported PHP version for the project?',
      choices: ['5.6', '7.0', '7.1', '7.2'],
      default: this.defaults.project.phpVersion.toFixed(1)
    },
    {
      name: 'namespace',
      message: 'What is the base namespace of the project?',
      default: this.config.get('projectNamespace')
    }
  ];

  this.prompt(prompts, function(props) {
    var phpVersion = parseFloat(props.phpVersion);
    if (phpVersion > this.defaults.project.testPhpVersion) {
      this.defaults.project.testPhpVersion = phpVersion;
    }
    this.defaults.project.phpVersion = phpVersion;

    var projectNamespace = _.clean(_.cleanDiacritics(props.namespace));
    if (/^[a-zA-Z][a-zA-Z0-9_-]+((\\[a-zA-Z][a-zA-Z0-9_-]+)+)?$/.test(projectNamespace) === false) {
      throw new Error(util.format('"%s" is not a valid PHP namespace', projectNamespace));
    }

    this.config.set('projectNamespace', projectNamespace);

    done();
  }.bind(this));
};

BarePHP.prototype.askForComposer = function() {
  var done = this.async();

  shell.exec('composer -v', {silent: true}, function(error) {
    if (error !== 0) {
      if (fs.existsSync('composer.phar')) {
        this.defaults.localComposer = true;

        done();
        return;
      }

      var prompts = [
        {
          type: 'confirm',
          name: 'install',
          message: 'No global Composer installation found. Install Composer locally?',
          default: true
        }
      ];

      this.prompt(prompts, function(props) {
        if (props.install) {
          this.defaults.localComposer = true;
        }

        done();
      }.bind(this));
    } else {
      this.defaults.globalComposer = true;

      done();
    }
  }.bind(this));
};

BarePHP.prototype.askForToolsInstall = function() {
  if (this.defaults.quickMode) {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      type: 'checkbox',
      name: 'tools',
      message: 'Which of this extra tools would you like to include?',
      choices: [
        {
          value: 'packagist',
          name: 'Packagist',
          checked: this.config.get('controlPackagist')
        },
        {
          value: 'travis',
          name: 'Travis',
          checked: this.config.get('controlTravis')
        },
        {
          value: 'coveralls',
          name: 'Coveralls',
          checked: this.config.get('controlCoveralls')
        },
        {
          value: 'scrutinizer',
          name: 'Scrutinizer',
          checked: this.config.get('controlScrutinizer')
        },
        {
          value: 'styleci',
          name: 'StyleCI',
          checked: this.config.get('controlStyleci')
        },
        {
          value: 'docs',
          name: 'Initial documentation',
          checked: this.config.get('controlDocs')
        }
      ]
    }
  ];

  this.prompt(prompts, function(props) {
    var hasMod = function(mod) { return props.tools.indexOf(mod) !== -1; };

    this.config.set('controlPackagist', hasMod('packagist'));
    this.config.set('controlTravis', hasMod('travis'));
    this.config.set('controlCoveralls', hasMod('coveralls'));
    this.config.set('controlScrutinizer', hasMod('scrutinizer'));
    this.config.set('controlStyleci', hasMod('styleci'));
    this.config.set('controlDocs', hasMod('docs'));

    done();
  }.bind(this));
};

BarePHP.prototype.askForDevEnv = function() {
  if (this.defaults.quickMode || this.defaults.project.type !== 'project') {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      type: 'list',
      name: 'devenv',
      message: 'Which development environment do you want to use?',
      choices: ['Docker', 'Homestead', 'None'],
      default: _.capitalize(this.config.get('controlDevEnv'))
    }
  ];

  this.prompt(prompts, function(props) {
    var devEnv = props.devenv.toLowerCase();

    if (devEnv !== 'homestead') {
      this.config.set('controlPhpMyAdmin', false);
    }

    this.config.set('controlDevEnv', devEnv);

    done();
  }.bind(this));
};

BarePHP.prototype.askForPackagistAccount = function() {
  if (this.defaults.quickMode || !this.config.get('controlPackagist')) {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      name: 'account',
      message: 'What is your Packagist account name?',
      default: this.config.get('controlRepository') ?
        this.config.get('accountPackagist') :
        this.defaults.owner.canonical
    }
  ];

  this.prompt(prompts, function(props) {
    this.config.set('accountPackagist', _.clean(props.account).replace(/\s+/g, '_'));

    done();
  }.bind(this));
};

BarePHP.prototype.askForTravisAccount = function() {
  if (this.defaults.quickMode || !this.config.get('controlTravis')) {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      name: 'account',
      message: 'What is your Travis account name?',
      default: this.config.get('controlRepository') ?
        this.config.get('accountTravis') :
        this.defaults.owner.canonical
    },
    {
      type: 'confirm',
      name: 'supportNightly',
      message: 'Want to support PHP nightly version on Travis?',
      default: this.defaults.project.supportNightly
    }
  ];

  this.prompt(prompts, function(props) {
    this.config.set('accountTravis', _.clean(props.account).replace(/\s+/g, '_'));

    this.config.set('supportNightly', props.supportNightly);

    done();
  }.bind(this));
};

BarePHP.prototype.askForCoverallsAccount = function() {
  if (this.defaults.quickMode || !this.config.get('controlCoveralls')) {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      name: 'account',
      message: 'What is your Coveralls account name?',
      default: this.config.get('controlRepository') ?
        this.config.get('accountCoveralls') :
        this.defaults.owner.canonical
    }
  ];

  this.prompt(prompts, function(props) {
    this.config.set('accountCoveralls', _.clean(props.account).replace(/\s+/g, '_'));

    done();
  }.bind(this));
};

BarePHP.prototype.askForScrutinizerAccount = function() {
  if (this.defaults.quickMode || !this.config.get('controlScrutinizer')) {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      name: 'account',
      message: 'What is your Scrutinizer account name?',
      default: this.config.get('controlRepository') ?
        this.config.get('accountScrutinizer') :
        this.defaults.owner.canonical
    }
  ];

  this.prompt(prompts, function(props) {
    this.config.set('accountScrutinizer', _.clean(props.account).replace(/\s+/g, '_'));

    done();
  }.bind(this));
};

BarePHP.prototype.askForStyleciAccount = function() {
  if (this.defaults.quickMode || !this.config.get('controlStyleci') || !this.config.get('controlDocs')) {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      name: 'account',
      message: 'What is this project StyleCI repository code?',
      default: this.config.get('accountStyleci')
    }
  ];

  this.prompt(prompts, function(props) {
    var accountStyleci = _.clean(props.account).replace(/\s+/g, '');

    if (accountStyleci === '') {
      console.log(chalk.yellow.bold('  Remember to assign StyleCI repository code on README file'));
    }

    this.config.set('accountStyleci', accountStyleci);

    done();
  }.bind(this));
};

BarePHP.prototype.askForHomestead = function() {
  if (this.defaults.quickMode || this.config.get('controlDevEnv') !== 'homestead') {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      type: 'list',
      name: 'format',
      message: 'What Laravel Homestead configuration format you want to use?',
      choices: ['JSON', 'YAML'],
      default: this.config.get('homesteadFormat').toUpperCase()
    },
    {
      type: 'confirm',
      name: 'usePhpmyadmin',
      message: 'Would you like to install PhpMyAdmin in Laravel Homestead?',
      default: this.config.get('controlPhpMyAdmin')
    }
  ];

  this.prompt(prompts, function(props) {
    switch (props.format.toLowerCase()) {
      case 'json':
      case 'yaml':
        this.config.set('homesteadFormat', props.format.toLowerCase());
        break;
    }

    this.config.set('controlPhpMyAdmin', props.usePhpmyadmin);

    done();
  }.bind(this));
};

BarePHP.prototype.askForHomesteadIP = function() {
  if (this.defaults.quickMode || this.config.get('controlDevEnv') !== 'homestead') {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      name: 'ip',
      message: 'What will be homestead local IP?',
      default: this.config.get('homesteadIP')
    }
  ];

  this.prompt(prompts, function(props) {
    var homesteadIp = _.trim(props.ip);

    if (!validator.isIP(homesteadIp)) {
      throw new Error(util.format('"%s" is not a valid IP', homesteadIp));
    }

    this.config.set('homesteadIP', homesteadIp);

    done();
  }.bind(this));
};

BarePHP.prototype.askForChangeDirs = function() {
  var defaultDirs = this.config.get('dirSrc') +
    ', ' + this.config.get('dirTests') +
    ', ' + this.config.get('dirBuild');
  if (this.defaults.project.type === 'project') {
    defaultDirs += ', ' + this.config.get('dirPublic');
  }

  var done = this.async();
  var prompts = [
    {
      type: 'confirm',
      name: 'changeDirs',
      message: util.format('Would you like to change default directories (%s)?', defaultDirs),
      default: this.defaults.config.controlDirs
    }
  ];

  this.prompt(prompts, function(props) {
    this.config.set('controlDirs', props.changeDirs);

    done();
  }.bind(this));
};

BarePHP.prototype.askForCustomDirs = function() {
  if (!this.config.get('controlDirs')) {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      name: 'src',
      message: 'What is the source directory?',
      default: this.config.get('dirSrc')
    },
    {
      name: 'tests',
      message: 'What is the tests directory?',
      default: this.config.get('dirTests')
    },
    {
      name: 'build',
      message: 'What is the build directory?',
      default: this.config.get('dirBuild')
    }
  ];

  if (this.defaults.project.type === 'project') {
    prompts.push({
      name: 'public',
      message: 'What is the public directory?',
      default: this.config.get('dirPublic')
    });
  }

  this.prompt(prompts, function(props) {
    this.config.set('dirSrc', props.src);
    this.config.set('dirTests', props.tests);
    this.config.set('dirBuild', props.build);

    if (this.defaults.project.type === 'project') {
      this.config.set('dirPublic', props.public);
    }

    done();
  }.bind(this));
};

BarePHP.prototype.writing = {
  createViewParameters: function() {
    this.underscoreString = _;
    this.path = path;

    this.control = {
      repository: this.config.get('controlRepository'),
      dirs: this.config.get('controlDirs'),
      license: this.config.get('controlLicense'),
      packagist: this.config.get('controlPackagist'),
      travis: this.config.get('controlTravis'),
      coveralls: this.config.get('controlCoveralls'),
      scrutinizer: this.config.get('controlScrutinizer'),
      styleci: this.config.get('controlStyleci'),
      homestead: this.config.get('controlDevEnv') === 'homestead',
      docker: this.config.get('controlDevEnv') === 'docker',
      docs: this.config.get('controlDocs'),
      phpMyAdmin: this.config.get('controlPhpMyAdmin'),
      localComposer: this.defaults.localComposer
    };

    this.owner = {
      name: this.defaults.owner.name,
      canonical: this.defaults.owner.canonical,
      email: this.defaults.owner.email,
      homepage: this.defaults.owner.homepage
    };

    this.repository = {
      type: this.config.get('repositoryType'),
      ssh: this.config.get('repositorySSH'),
      homepage: this.config.get('repositoryHomepage')
    };

    this.project = {
      name: this.config.get('projectName'),
      description: this.defaults.project.description,
      type: this.defaults.project.type,
      keywords: this.defaults.project.keywords,
      homepage: this.defaults.project.homepage,
      phpVersion: this.defaults.project.phpVersion,
      supportNightly: this.config.get('supportNightly'),
      testPhpVersion: this.defaults.project.testPhpVersion,
      license: this.defaults.project.license,
      namespace: this.config.get('projectNamespace'),
      dependencies: [],
      phpunitVersion: ''
    };

    switch (this.defaults.project.phpVersion) {
      case 5.6:
        this.project.dependencies = [
          ['symfony/polyfill-php70', '^1.0'],
          ['symfony/polyfill-php71', '^1.0'],
          ['symfony/polyfill-php72', '^1.0']
        ];
        this.project.phpunitVersion = '^5.7';
        break;

      case 7.0:
        this.project.dependencies = [
          ['symfony/polyfill-php71', '^1.0'],
          ['symfony/polyfill-php72', '^1.0']
        ];
        this.project.phpunitVersion = '^5.7|^6.0';
        break;

      case 7.1:
        this.project.dependencies = [
          ['symfony/polyfill-php72', '^1.0']
        ];
        this.project.phpunitVersion = '^6.0|^7.0';
        break;

      case 7.2:
        this.project.phpunitVersion = '^6.0|^7.0';
        break;
    }

    this.dir = {
      src: this.config.get('dirSrc'),
      tests: this.config.get('dirTests'),
      testsSrc: this.config.get('projectNamespace').replace(/\\+/g, path.sep).split(path.sep).pop(),
      build: this.config.get('dirBuild'),
      public: this.config.get('dirPublic')
    };

    this.account = {
      repository: this.config.get('accountRepository'),
      packagist: this.config.get('accountPackagist'),
      travis: this.config.get('accountTravis'),
      coveralls: this.config.get('accountCoveralls'),
      scrutinizer: this.config.get('accountScrutinizer'),
      styleci: this.config.get('accountStyleci') !== '' ? this.config.get('accountStyleci') : 'XXXXXXXX'
    };

    this.homestead = {
      format: this.config.get('homesteadFormat'),
      ip: this.config.get('homesteadIP')
    };
  },

  createDirs: function() {
    console.log('\nWriting project files ...\n');

    mkdirp(this.config.get('dirSrc'));
    mkdirp(this.config.get('dirTests') + '/' + this.dir.testsSrc);

    if (this.defaults.project.type === 'project') {
      mkdirp(this.config.get('dirPublic'));
    }

    if (this.config.get('controlDevEnv') === 'homestead') {
      mkdirp('vagrant');
    }
    if (this.config.get('controlDevEnv') === 'docker') {
      mkdirp('docker/config');
      mkdirp('docker/log/nginx');
      mkdirp('docker/log/php');
      mkdirp('docker/data/mysql');
    }
  },

  writeFiles: function() {
    this.copy('../../templates/tools/editorconfig', '.editorconfig');
    this.template('../../templates/tools/git/_gitattributes', '.gitattributes');
    this.template('../../templates/tools/git/_gitignore', '.gitignore');

    this.template('../../templates/tools/_composer.json', 'composer.json');
    this.template('../../templates/tools/npm/_package.json', 'package.json');

    if (this.defaults.project.phpVersion < 7.0) {
      this.template('../../templates/code/_Person-56.php', this.config.get('dirSrc') + '/Person.php');
      this.template(
        '../../templates/code/_PersonTest-56.php',
        this.config.get('dirTests') + '/' + this.dir.testsSrc + '/PersonTest.php'
      );
      this.template('../../templates/code/_Greeter-56.php', this.config.get('dirSrc') + '/Greeter.php');
      this.template(
        '../../templates/code/_GreeterTest-56.php',
        this.config.get('dirTests') + '/' + this.dir.testsSrc + '/GreeterTest.php'
      );
      this.template('../../templates/code/_bootstrap-56.php', this.config.get('dirTests') + '/bootstrap.php');
    } else {
      this.template('../../templates/code/_Person.php', this.config.get('dirSrc') + '/Person.php');
      this.template(
        '../../templates/code/_PersonTest.php',
        this.config.get('dirTests') + '/' + this.dir.testsSrc + '/PersonTest.php'
      );
      this.template('../../templates/code/_Greeter.php', this.config.get('dirSrc') + '/Greeter.php');
      this.template(
        '../../templates/code/_GreeterTest.php',
        this.config.get('dirTests') + '/' + this.dir.testsSrc + '/GreeterTest.php'
      );
      this.template('../../templates/code/_bootstrap.php', this.config.get('dirTests') + '/bootstrap.php');
    }

    this.template('../../templates/tools/qa/_php_cs', '.php_cs');
    this.template('../../templates/tools/qa/_phpunit.xml.dist', 'phpunit.xml.dist');

    if (this.defaults.project.phpVersion >= 7.0) {
      this.template('../../templates/tools/qa/_infection.json.dist', 'infection.json.dist');
      this.template('../../templates/tools/qa/_phpstan.neon', 'phpstan.neon');
    }

    if (this.defaults.project.type === 'project') {
      this.template('../../templates/code/_index.php', this.config.get('dirPublic') + '/index.php');
    }
  },

  writeToolsFiles: function() {
    if (this.config.get('controlTravis')) {
      this.template('../../templates/tools/_travis.yml', '.travis.yml');
    }
    if (this.config.get('controlCoveralls')) {
      this.template('../../templates/tools/coveralls.yml', '.coveralls.yml');
    }
    if (this.config.get('controlScrutinizer')) {
      this.template('../../templates/tools/_scrutinizer.yml', '.scrutinizer.yml');
    }
    if (this.config.get('controlStyleci')) {
      this.template('../../templates/tools/_styleci.yml', '.styleci.yml');
    }

    if (this.config.get('controlDocs')) {
      this.template('../../templates/docs/_CONTRIBUTING.md', 'CONTRIBUTING.md');
      this.template('../../templates/docs/_README.md', 'README.md');
    }
    if (this.config.get('controlLicense')) {
      this.template('../../templates/license/' + this.defaults.project.licenseFile, 'LICENSE');
    }

    if (this.config.get('controlDevEnv') === 'homestead') {
      this.template('../../templates/tools/vagrant/_Vagrantfile', 'Vagrantfile');
      if (this.config.get('homesteadFormat') === 'json') {
        this.template('../../templates/tools/vagrant/_homestead.json', 'vagrant/homestead.json');
      } else {
        this.template('../../templates/tools/vagrant/_homestead.yml', 'vagrant/homestead.yml');
      }
      this.template('../../templates/tools/vagrant/_provision.sh', 'vagrant/provision.sh');
      this.copy('../../templates/tools/vagrant/aliases', 'vagrant/aliases');
      this.copy('../../templates/tools/vagrant/gitignore', 'vagrant/.gitignore');
    }
    if (this.config.get('controlDevEnv') === 'docker') {
      this.template('../../templates/tools/docker/nginx.conf', 'docker/config/nginx.conf');
      this.template('../../templates/tools/docker/vhost.conf', 'docker/config/vhost.conf');
      this.template('../../templates/tools/docker/gitignore', 'docker/log/nginx/.gitignore');
      this.template('../../templates/tools/docker/gitignore', 'docker/log/php/.gitignore');
      this.template('../../templates/tools/docker/gitignore', 'docker/data/mysql/.gitignore');
      this.template('../../templates/tools/docker/_docker-compose.yml', 'docker-compose.yml');
    }
  }
};

BarePHP.prototype.install = function() {
  var defaults = this.defaults;
  var options = this.options;
  var projectName = this.config.get('projectName');

  this.installDependencies({
    bower: false,
    callback: function() {
      fs.unlinkSync('package.json');
      if (fs.existsSync('node_modules')) {
        fs.rmdir('node_modules');
      }

      var message = '\nProject ' + chalk.green.bold(projectName) + ' is set up and ready';

      if (options['skip-install']) {
        console.log(message);
        console.log();

        return;
      }

      if (defaults.localComposer && !fs.existsSync('composer.phar')) {
        console.log('Installing Composer locally ...');
        console.log('See http://getcomposer.org for more details on composer');
        shell.exec('php -r "readfile(\'https://getcomposer.org/installer\');" | php', {silent: true});
      }

      if (defaults.freshRun) {
        if (defaults.globalComposer || defaults.localComposer) {
          if (defaults.globalComposer) {
            console.log('Running ' + chalk.yellow.bold('composer install') +
              ' for you to install the required PHP dependencies. If this fails, try running the command yourself');

            shell.exec('composer install');
          } else {
            console.log('Running ' + chalk.yellow.bold('php composer.phar install') +
              ' for you to install the required PHP dependencies. If this fails, try running the command yourself');

            shell.exec('php composer.phar install');
          }
        } else {
          message += '\nInstall Composer dependencies by running ' + chalk.yellow.bold('composer install') +
            ' before starting development';
        }
      }

      console.log(message);
      console.log();
    }
  });
};
