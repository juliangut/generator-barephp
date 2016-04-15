/*
 * generator-barephp
 * https://github.com/juliangut/generator-barephp
 *
 * Copyright (c) 2016 Julián Gutiérrez (juliangut@gmail.com)
 * Licensed under the BSD-3-Clause license.
 */

'use strict';

var yeoman = require('yeoman-generator');
var util = require('util');
var path = require('path');
var yosay = require('yosay');
var chalk = require('chalk');
var validator = require('validator');
var _ = require('underscore.string');
var mkdirp = require('mkdirp');
var shell = require('shelljs');
var fs = require('fs');
var sprintf = require("sprintf-js").sprintf;

var BarePHP = module.exports = function BarePHP() {
  yeoman.generators.Base.apply(this, arguments);

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
      license: 'BSD-3-Clause',
      licenseFile: 'bsd-new',
      phpVersion: 5.6,
      testPhpVersion: 5.6
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
      controlHomestead: false,
      controlPhpMyAdmin: false,
      controlDocs: true,
      repositoryType: 'Github',
      repositoryHomepage: null,
      projectName: null,
      projectNamespace: null,
      dirSrc: 'src',
      dirTests: 'tests',
      dirDist: 'dist',
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
    this.defaults.owner.name = _.clean(shell.exec('git config --global user.name', {silent: true}).output, '\n');
    this.defaults.owner.email = _.clean(shell.exec('git config --global user.email', {silent: true}).output, '\n');
  }

  if (fs.existsSync('composer.json')) {
    var configs = JSON.parse(fs.readFileSync('composer.json'));

    if (configs.authors && configs.authors instanceof Array) {
      this.defaults.owner.name = configs.authors[0].name ? configs.authors[0].name : null ;
      this.defaults.owner.email = configs.authors[0].email ? configs.authors[0].email : null;
      this.defaults.owner.homepage = configs.authors[0].homepage ? configs.authors[0].homepage : null;
    }

    if (configs.description) {
      this.defaults.project.description = configs.description;
    }
    if (configs.type) {
      this.defaults.project.type = configs.type;
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

util.inherits(BarePHP, yeoman.generators.Base);

BarePHP.prototype.welcome = function() {
  this.log(
    yosay('\'Allo \'allo!\nOut of the box I include GIT, Composer, Grunt, Travis, and many, many more integrations!')
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
    if (!this.config.get('accountStyleci')) {
      this.config.set('accountStyleci', 'XXXXXXXX');
    }

    var repositoryUrl = 'https://';
    switch (props.type.toLowerCase()) {
      case 'github':
        repositoryUrl += 'github.com';
        break;
      case 'bitbucket':
        repositoryUrl += 'bitbucket.org';
        break;
    }

    this.config.set('repositoryHomepage', repositoryUrl + '/' + accountRepository + '/');
    this.config.set('accountRepository', accountRepository);

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
      name: 'type',
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
    this.defaults.project.type = props.type.toLowerCase();

    if (this.defaults.project.type === 'project') {
      this.config.set('controlHomestead', true);
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

BarePHP.prototype.askForProjectContinue2 = function() {
  var done = this.async();
  var prompts = [
    {
      type: 'list',
      name: 'phpVersion',
      message: 'What is the minimum supported PHP version for the project?',
      choices: ['5.3', '5.4', '5.5', '5.6', '7.0'],
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
      message: 'What is the license you want to use?',
      choices: [
        'BSD-3-Clause',
        'BSD-2-Clause',
        'BSD-4-Clause',
        'MIT',
        'GPL-3.0',
        'LGPL-3.0',
        'Apache-2.0',
        'Proprietary'
      ],
      default: this.defaults.project.license
    }
  ];

  this.prompt(prompts, function(props) {
    this.defaults.project.license = props.license;

    var licenseFile = '';
    switch (props.license) {
      case 'BSD-3-Clause':
        licenseFile = 'bsd-new';
        break;
      case 'BSD-2-Clause':
        licenseFile = 'bsd-free';
        break;
      case 'BSD-4-Clause':
        licenseFile = 'bsd-original';
        break;
      case 'MIT':
        licenseFile = 'mit';
        break;
      case 'GPL-3.0':
        licenseFile = 'gpl';
        break;
      case 'LGPL-3.0':
        licenseFile = 'lgpl';
        break;
      case 'Apache-2.0':
        licenseFile = 'apache';
        break;
      case 'Proprietary':
        this.defaults.project.license = this.defaults.project.license.toLowerCase();
        break;
    }

    this.defaults.project.licenseFile = licenseFile;

    done();
  }.bind(this));
};

BarePHP.prototype.askForComposer = function() {
  var done = this.async();

  shell.exec('composer -v', {silent: true}, function(error) {
    if (error != null) {
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
          default: false
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

BarePHP.prototype.askForInstall = function() {
  if (this.defaults.quickMode) {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      type: 'checkbox',
      name: 'xtras',
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
          value: 'homestead',
          name: 'Laravel Homestead',
          checked: this.config.get('controlHomestead')
        },
        {
          value: 'docs',
          name: 'Basic documentation',
          checked: this.config.get('controlDocs')
        }
      ]
    }
  ];

  this.prompt(prompts, function(props) {
    var hasMod = function(mod) { return props.xtras.indexOf(mod) !== -1; };

    this.config.set('controlPackagist', hasMod('packagist'));
    this.config.set('controlTravis', hasMod('travis'));
    this.config.set('controlCoveralls', hasMod('coveralls'));
    this.config.set('controlScrutinizer', hasMod('scrutinizer'));
    this.config.set('controlStyleci', hasMod('styleci'));
    this.config.set('controlHomestead', hasMod('homestead'));
    if (!hasMod('homestead')) {
      this.config.set('controlPhpMyAdmin', false);
    }
    this.config.set('controlDocs', hasMod('docs'));

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
    }
  ];

  this.prompt(prompts, function(props) {
    this.config.set('accountTravis', _.clean(props.account).replace(/\s+/g, '_'));

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
  if (this.defaults.quickMode || !this.config.get('controlStyleci')) {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      name: 'account',
      message: 'What is your StyleCI account number?',
      default: this.config.get('accountStyleci')
    }
  ];

  this.prompt(prompts, function(props) {
    var accountStyleci = _.clean(props.account).replace(/\s+/g, '_');
    if (accountStyleci === '') {
      accountStyleci = 'XXXXXXXX';
    }
    this.config.set('accountStyleci', accountStyleci);

    done();
  }.bind(this));
};

BarePHP.prototype.askForHomestead = function() {
  if (this.defaults.quickMode || !this.config.get('controlHomestead')) {
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
  if (this.defaults.quickMode || !this.config.get('controlHomestead')) {
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
    ', ' + this.config.get('dirDist');
  if (this.config.get('controlHomestead')) {
    defaultDirs += ', ' + this.config.get('dirPublic');
  }

  var done = this.async();
  var prompts = [
    {
      type: 'confirm',
      name: 'changeDirs',
      message: util.format('Would you like to change default directories (%s)?', defaultDirs),
      default: this.config.get('controlDirs')
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
      name: 'dist',
      message: 'What is the distribution directory?',
      default: this.config.get('dirDist')
    }
  ];

  if (this.config.get('controlHomestead')) {
    prompts.push({
      name: 'public',
      message: 'What is the public directory?',
      default: this.config.get('dirPublic')
    });
  }

  this.prompt(prompts, function(props) {
    this.config.set('dirSrc', props.src);
    this.config.set('dirTests', props.tests);
    this.config.set('dirDist', props.dist);

    if (this.config.get('controlHomestead')) {
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
      homestead: this.config.get('controlHomestead'),
      docs: this.config.get('controlDocs'),
      phpMyAdmin: this.config.get('controlPhpMyAdmin')
    };

    this.owner = {
      name: this.defaults.owner.name,
      canonical: this.defaults.owner.canonical,
      email: this.defaults.owner.email,
      homepage: this.defaults.owner.homepage
    };

    this.repository = {
      type: this.config.get('repositoryType'),
      homepage: this.config.get('repositoryHomepage')
    };

    this.project = {
      name: this.config.get('projectName'),
      description: this.defaults.project.description,
      type: this.defaults.project.type,
      keywords: this.defaults.project.keywords,
      homepage: this.defaults.project.homepage,
      phpVersion: this.defaults.project.phpVersion,
      testPhpVersion: this.defaults.project.testPhpVersion,
      license: this.defaults.project.license,
      namespace: this.config.get('projectNamespace'),
      dependencies: []
    };

    switch (this.defaults.project.phpVersion) {
      case 5.3:
        this.project.dependencies = [
          ['symfony/polyfill-php54', '^1.0'],
          ['ircmaxell/password-compat', '^1.0'],
          ['symfony/polyfill-php55', '^1.0'],
          ['symfony/polyfill-php56', '^1.0'],
          ['paragonie/random_compat', '^1.0'],
          ['symfony/polyfill-php70', '^1.0']
        ];
        break;

      case 5.4:
        this.project.dependencies = [
          ['ircmaxell/password-compat', '^1.0'],
          ['symfony/polyfill-php55', '^1.0'],
          ['symfony/polyfill-php56', '^1.0'],
          ['paragonie/random_compat', '^1.0'],
          ['symfony/polyfill-php70', '^1.0']
        ];
        break;

      case 5.5:
        this.project.dependencies = [
          ['symfony/polyfill-php56', '^1.0'],
          ['paragonie/random_compat', '^1.0'],
          ['symfony/polyfill-php70', '^1.0']
        ];
        break;

      case 5.6:
        this.project.dependencies = [
          ['paragonie/random_compat', '^1.0'],
          ['symfony/polyfill-php70', '^1.0']
        ];
        break;
    }

    this.dir = {
      src: this.config.get('dirSrc'),
      tests: this.config.get('dirTests'),
      testsSrc: this.config.get('projectNamespace').replace(/\\+/g, path.sep).split(path.sep).pop(),
      dist: this.config.get('dirDist'),
      public: this.config.get('dirPublic')
    };

    this.account = {
      repository: this.config.get('accountRepository'),
      packagist: this.config.get('accountPackagist'),
      travis: this.config.get('accountTravis'),
      coveralls: this.config.get('accountCoveralls'),
      scrutinizer: this.config.get('accountScrutinizer'),
      styleci: this.config.get('accountStyleci')
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

    if (this.config.get('controlHomestead')) {
      mkdirp('.vagrant');
      mkdirp(this.config.get('dirPublic'));
    }
  },

  writeFiles: function() {
    this.copy('../../templates/editorconfig', '.editorconfig');
    this.template('../../templates/_gitattributes', '.gitattributes');
    this.template('../../templates/_gitignore', '.gitignore');

    this.template('../../templates/_composer.json', 'composer.json');
    this.template('../../templates/_package.json', 'package.json');
    this.template('../../templates/_Gruntfile.js', 'Gruntfile.js');

    this.template('../../templates/code/_Greeter.php', this.config.get('dirSrc') + '/Greeter.php');
    this.template(
      '../../templates/code/_GreeterTest.php',
      this.config.get('dirTests') + '/' + this.dir.testsSrc + '/GreeterTest.php'
    );
    this.template('../../templates/code/_bootstrap.php', this.config.get('dirTests') + '/bootstrap.php');

    this.template('../../templates/_phpunit.xml', 'phpunit.xml');
  },

  writeXtraFiles: function() {
    if (this.config.get('controlTravis')) {
      this.template('../../templates/extra/_travis.yml', '.travis.yml');
    }
    if (this.config.get('controlCoveralls')) {
      this.template('../../templates/extra/_coveralls.yml', '.coveralls.yml');
    }
    if (this.config.get('controlScrutinizer')) {
      this.template('../../templates/extra/_scrutinizer.yml', '.scrutinizer.yml');
    }
    if (this.config.get('controlStyleci')) {
      this.template('../../templates/extra/styleci.yml', '.styleci.yml');
    }
    if (this.config.get('controlHomestead')) {
      this.template('../../templates/code/_index.php', this.config.get('dirPublic') + '/index.php');
      this.template('../../templates/extra/_Vagrantfile', 'Vagrantfile');
      if (this.config.get('homesteadFormat') === 'json') {
        this.template('../../templates/extra/_homestead.json', '.vagrant/homestead.json');
      } else {
        this.template('../../templates/extra/_homestead.yml', '.vagrant/homestead.yml');
      }
      this.template('../../templates/extra/_provision.sh', '.vagrant/provision.sh');
      this.copy('../../templates/extra/aliases', '.vagrant/aliases');
      this.copy('../../templates/extra/vagrant_gitignore', '.vagrant/.gitignore');
    }
    if (this.config.get('controlDocs')) {
      this.template('../../templates/docs/_CONTRIBUTING.md', 'CONTRIBUTING.md');
      this.template('../../templates/docs/_README.md', 'README.md');
    }
    if (this.config.get('controlLicense') && this.defaults.project.license !== 'proprietary') {
      this.template('../../templates/license/' + this.defaults.project.licenseFile, 'LICENSE');
    }
  }
};

BarePHP.prototype.install = function() {
  var projectName = this.config.get('projectName');
  var defaults = this.defaults;

  this.installDependencies({
    bower: false,
    callback: function() {
      var message = '\nProject ' + chalk.green.bold(projectName) + ' is set up and ready';

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
