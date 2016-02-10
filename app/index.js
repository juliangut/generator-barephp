'use strict';

var yeoman = require('yeoman-generator'),
    util = require('util'),
    path = require('path'),
    yosay = require('yosay'),
    chalk = require('chalk'),
    validator = require('validator'),
    _ = require('underscore.string'),
    mkdirp = require('mkdirp'),
    util = require('util'),
    shell = require('shelljs');

var BarePHP = module.exports = function BarePHP() {
  yeoman.generators.Base.apply(this, arguments);

  this.getUserHome = function() {
    return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
  };

  this.owner = {
    name: '',
    canonical: '',
    email: '',
    homepage: ''
  };

  this.project = {
    name: '',
    description: '',
    type: 'library',
    keywords: '',
    homepage: '',
    phpversion: 5.5,
    testphpversion: 5.6,
    license: 'BSD-3-Clause',
    licenseFile: 'bsd-new',
    namespace: ''
  };

  this.control = {
    quick: false,
    dirs: false,
    repository: true,
    license: true,
    packagist: true,
    travis: true,
    coveralls: true,
    scrutinizer: true,
    styleci: true,
    homestead: true,
    docs: true,
    phpmyadmin: false
  };

  this.repository = {
    type: '',
    homepage: '',
    url: ''
  };

  this.accounts = {
    repository: '',
    packagist: '',
    travis: '',
    coveralls: '',
    scrutinizer: '',
    styleci: ''
  };

  this.homestead = {
    format: 'json'
  };

  this.dirs = {
    src: 'src',
    tests: 'tests',
    dist: 'dist',
    public: 'public'
  };

  this.underscoreString = _;

  if (!shell.which('git')) {
    this.owner.name = _.clean(this.getUserHome().split(path.sep).pop());
  } else {
    this.owner.name = _.clean(shell.exec('git config --global user.name', { silent: true }).output, '\n');
    this.owner.email = _.clean(shell.exec('git config --global user.email', { silent: true }).output, '\n');
  }
};

util.inherits(BarePHP, yeoman.generators.Base);

BarePHP.prototype.welcome = function () {
  this.log(
    yosay('\'Allo \'allo!\nOut of the box I include GIT, Composer, Travis, Grunt, and many, many more integrations!')
  );
};

BarePHP.prototype.askForMode = function() {
  var done = this.async(),
      prompts = [
        {
          type: 'confirm',
          name: 'quick',
          message: 'Would you like the quick assistant?',
          default: this.control.quick
        }
      ];

  this.prompt(prompts, function(props) {
    this.control.quick = props.quick;

    done();
  }.bind(this));
};

BarePHP.prototype.askForOwner = function () {
  var done = this.async(),
      prompts = [
        {
          name: 'name',
          message: 'What is your name?',
          default: this.owner.name
        },
        {
          name: 'email',
          message: 'What is your email?',
          default: this.owner.email
        },
        {
          name: 'homepage',
          message: 'What is your homepage?'
        }
      ];

  this.prompt(prompts, function(props) {
    this.owner.name      = _.clean(props.name);
    this.owner.canonical = _.cleanDiacritics(_.clean(props.name)).replace(/\s+/g, '_').toLowerCase();
    this.owner.email     = _.clean(props.email).split(' ').shift();
    this.owner.homepage  = _.clean(props.homepage).split(' ').shift();

    if (!validator.isEmail(this.owner.email)) {
      throw new Error(util.format('"%s" is not a valid email', this.owner.email));
    }

    done();
  }.bind(this));
};

BarePHP.prototype.askForRepositoryUse = function() {
  var done = this.async(),
      prompts = [
        {
          type: 'confirm',
          name: 'useRepository',
          message: 'Would you like to assign a public repository (Github/Bitbucket)?',
          default: this.control.repository
        }
      ];

  this.prompt(prompts, function(props) {
    this.control.repository = props.useRepository;

    done();
  }.bind(this));
};

BarePHP.prototype.askForRepository = function () {
  if (!this.control.repository) {
    return;
  }

  var done = this.async(),
      prompts = [
        {
          type: 'list',
          name: 'type',
          message: 'What repository is the project hosted on?',
          choices: ['Github', 'Bitbucket'],
          default: 'Github'
        },
        {
          name: 'account',
          message: 'What is your repository account name?',
          default: this.owner.canonical
        }
      ];

  this.prompt(prompts, function(props) {
    this.repository.type     = props.type.toLowerCase();

    this.accounts.repository  = _.cleanDiacritics(_.clean(props.account)).replace(/\s+/g, '_');
    this.accounts.packagist   = this.accounts.repository;
    this.accounts.travis      = this.accounts.repository;
    this.accounts.coveralls   = this.accounts.repository;
    this.accounts.scrutinizer = this.accounts.repository;
    this.accounts.styleci     = 'XXXXXXXX';

    switch (this.repository.type) {
      case 'github':
        this.repository.homepage = 'https://github.com/' + this.accounts.repository + '/';
        this.repository.url      = 'git@github.com:' + this.accounts.repository + '/';
        break;
      case 'bitbucket':
        this.repository.homepage = 'https://bitbucket.org/' + this.accounts.repository + '/';
        this.repository.url      = 'git@bitbucket.org:' + this.accounts.repository + '/';
        break;
    }

    done();
  }.bind(this));
};

BarePHP.prototype.askForProject = function () {
  var done = this.async(),
      prompts = [
        {
          name: 'name',
          message: 'What is the project name?',
          default: _.camelize(process.cwd().split(path.sep).pop())
        }
      ];

  this.prompt(prompts, function(props) {
    this.project.name        = _.clean(props.name).replace(/\s+/g, '_');
    this.project.namespace   = _.capitalize(_.camelize(_.trim(props.name)));

    if (this.control.repository) {
      this.repository.homepage += this.project.name;
      this.repository.url      += this.project.name + '.git';
    }

    done();
  }.bind(this));
};

BarePHP.prototype.askForProjectContinue = function () {
  if (this.control.quick) {
    return;
  }

  var done = this.async(),
      prompts = [
        {
          name: 'description',
          message: 'What is the project description?'
        },
        {
          type: 'list',
          name: 'type',
          message: 'What type is the project?',
          choices: ['library', 'project', 'metapackage', 'composer-plugin'],
          default: this.project.type
        },
        {
          name: 'keywords',
          message: 'What are the project keywords?',
          default: this.project.keywords
        },
        {
          name: 'homepage',
          message: 'What is the project homepage?',
          default: this.control.repository ? this.repository.homepage : ''
        }
      ];

  this.prompt(prompts, function(props) {
    props.keywords = _.clean(props.keywords);

    this.project.description = _.trim(props.description);
    this.project.type        = props.type.toLowerCase();
    this.project.keywords    = props.keywords.length ? props.keywords.split(' ') : [];
    this.project.homepage  = _.trim(props.homepage).split(' ').shift();

    if (this.project.homepage !== '' && !validator.isURL(this.project.homepage)) {
      throw new Error(util.format('"%s" is not a valid URL', this.project.homepage));
    }

    done();
  }.bind(this));
};

BarePHP.prototype.askForProjectContinue2 = function () {
  var done = this.async(),
      prompts = [
        {
          type: 'list',
          name: 'phpversion',
          message: 'What is the minimum supported PHP version for the project?',
          choices: ['5.5', '5.6', '7.0'],
          default: this.project.phpversion.toString()
        },
        {
          name: 'namespace',
          message: 'What is the base namespace of the project?',
          default: this.control.repository
            ? _.capitalize(_.camelize(this.accounts.repository))
            : _.camelize(_.cleanDiacritics(_.clean(this.owner.name)))
        }
      ];

  this.prompt(prompts, function(props) {
    this.project.namespace   = _.capitalize(_.camelize(_.trim(props.namespace))) + '\\' + this.project.namespace;
    this.project.phpversion  = parseFloat(props.phpversion);

    if (this.project.phpversion > this.project.testphpversion) {
      this.project.testphpversion = this.project.phpversion;
    }

    done();
  }.bind(this));
};

BarePHP.prototype.askForLicenseUse = function() {
  if (this.control.quick) {
    return;
  }

  var done = this.async(),
      prompts = [
        {
          type: 'confirm',
          name: 'useLicense',
          message: 'Would you like to assign a license?',
          default: this.control.license
        }
      ];

  this.prompt(prompts, function(props) {
    this.control.license = props.useLicense;

    done();
  }.bind(this));
};

BarePHP.prototype.askForLicense = function() {
  if (!this.control.license || this.control.quick) {
    return;
  }

  var done = this.async(),
      prompts = [
        {
          type: 'list',
          name: 'license',
          message: 'What is the license you want to use?',
          choices: ['BSD-3-Clause', 'BSD-2-Clause', 'BSD-4-Clause', 'MIT', 'GPL-3.0', 'LGPL-3.0', 'Apache-2.0', 'Proprietary'],
          default: this.project.license
        }
      ];

  this.prompt(prompts, function(props) {
    var licenseFile = '';

    this.project.license = props.license;

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
        this.project.license = 'proprietary';
        break;
    }

    this.project.licenseFile = licenseFile;

    done();
  }.bind(this));
};

BarePHP.prototype.askForInstall = function() {
  if (this.control.quick) {
    return;
  }

  var done = this.async(),
      prompts = [
        {
          type: 'checkbox',
          name: 'xtras',
          message: 'Which of this extra tools would you like to include?',
          choices: [
            {
              value: 'packagist',
              name: 'Packagist',
              checked: this.control.packagist
            },
            {
              value: 'travis',
              name: 'Travis',
              checked: this.control.travis
            },
            {
              value: 'coveralls',
              name: 'Coveralls',
              checked: this.control.coveralls
            },
            {
              value: 'scrutinizer',
              name: 'Scrutinizer',
              checked: this.control.scrutinizer
            },
            {
              value: 'styleci',
              name: 'StyleCI',
              checked: this.control.styleci
            },
            {
              value: 'homestead',
              name: 'Laravel Homestead',
              checked: this.control.homestead
            },
            {
              value: 'docs',
              name: 'Basic documentation',
              checked: this.control.docs
            }
          ]
        }
      ];

  this.prompt(prompts, function(props) {
    var hasMod = function (mod) { return props.xtras.indexOf(mod) !== -1; };

    this.control.packagist   = hasMod('packagist');
    this.control.travis      = hasMod('travis');
    this.control.coveralls   = hasMod('coveralls');
    this.control.scrutinizer = hasMod('scrutinizer');
    this.control.styleci     = hasMod('styleci');
    this.control.homestead   = hasMod('homestead');
    this.control.docs        = hasMod('docs');

    done();
  }.bind(this));
};

BarePHP.prototype.askForPackagistAccount = function() {
  if (!this.control.packagist || this.control.quick) {
    return;
  }

  var done = this.async(),
      prompts = [
        {
          name: 'account',
          message: 'What is your Packagist account name?',
          default: this.control.repository ? this.accounts.packagist : this.owner.canonical
        }
      ];

  this.prompt(prompts, function(props) {
    this.accounts.packagist = _.clean(props.account).replace(/\s+/g, '_');

    done();
  }.bind(this));
};

BarePHP.prototype.askForTravisAccount = function() {
  if (!this.control.travis || this.control.quick) {
    return;
  }

  var done = this.async(),
      prompts = [
        {
          name: 'account',
          message: 'What is your Travis account name?',
          default: this.control.repository ? this.accounts.travis : this.owner.canonical
        }
      ];

  this.prompt(prompts, function(props) {
    this.accounts.travis = _.clean(props.account).replace(/\s+/g, '_');

    done();
  }.bind(this));
};

BarePHP.prototype.askForCoverallsAccount = function() {
  if (!this.control.coveralls || this.control.quick) {
    return;
  }

  var done = this.async(),
      prompts = [
        {
          name: 'account',
          message: 'What is your Coveralls account name?',
          default: this.control.repository ? this.accounts.coveralls : this.owner.canonical
        }
      ];

  this.prompt(prompts, function(props) {
    this.accounts.coveralls = _.clean(props.account).replace(/\s+/g, '_');

    done();
  }.bind(this));
};

BarePHP.prototype.askForScrutinizerAccount = function() {
  if (!this.control.scrutinizer || this.control.quick) {
    return;
  }

  var done = this.async(),
      prompts = [
        {
          name: 'account',
          message: 'What is your Scrutinizer account name?',
          default: this.control.repository ? this.accounts.scrutinizer : this.owner.canonical
        }
      ];

  this.prompt(prompts, function(props) {
    this.accounts.scrutinizer = _.clean(props.account).replace(/\s+/g, '_');

    done();
  }.bind(this));
};

BarePHP.prototype.askForStyleciAccount = function() {
  if (!this.control.styleci || this.control.quick) {
    return;
  }

  var done = this.async(),
      prompts = [
        {
          name: 'account',
          message: 'What is your StyleCI account number?'
        }
      ];

  this.prompt(prompts, function(props) {
    this.accounts.styleci = _.clean(props.account).replace(/\s+/g, '_');
    if (this.accounts.styleci === '') {
      this.accounts.styleci = 'XXXXXXXX';
    }

    done();
  }.bind(this));
};

BarePHP.prototype.askForHomestead = function() {
  if (!this.control.homestead || this.control.quick) {
    return;
  }

  var done = this.async(),
      prompts = [
        {
          type: 'list',
          name: 'format',
          message: 'What Laravel Homestead configuration format you want to use?',
          choices: ['JSON', 'YAML'],
          default: this.homestead.format.toUpperCase()
        },
        {
          type: 'confirm',
          name: 'usePhpmyadmin',
          message: 'Would you like to install PhpMyAdmin in Laravel Homestead?',
          default: this.control.phpmyadmin
        }
      ];

  this.prompt(prompts, function(props) {
    switch (props.format.toLowerCase()) {
      case 'json':
        this.homestead.format = 'json';
        break;
      case 'yaml':
        this.homestead.format = 'yml';
        break;
    }

    this.control.phpmyadmin = props.usePhpmyadmin;

    done();
  }.bind(this));
};

BarePHP.prototype.askForChangeDirs = function() {
  var defaultDirs = this.dirs.src + ', ' + this.dirs.tests + ', ' + this.dirs.dist;
  if (this.control.homestead) {
    defaultDirs += ', ' + this.dirs.public;
  }

  var done = this.async(),
      prompts = [
        {
          type: 'confirm',
          name: 'changeDirs',
          message: util.format('Would you like to change default directories (%s)?', defaultDirs),
          default: this.control.dirs
        }
      ];

  this.prompt(prompts, function(props) {
    this.control.dirs = props.changeDirs;

    done();
  }.bind(this));
};

BarePHP.prototype.askForCustomDirs = function() {
  if (!this.control.dirs) {
    return;
  }

  var done = this.async(),
      prompts = [
        {
          name: 'src',
          message: 'What is the source directory?',
          default: this.dirs.src
        },
        {
          name: 'tests',
          message: 'What is the tests directory?',
          default: this.dirs.tests
        },
        {
          name: 'dist',
          message: 'What is the distribution directory?',
          default: this.dirs.dist
        }
      ];

  if (this.control.homestead) {
    prompts.push({
      name: 'public',
      message: 'What is the public directory?',
      default: this.dirs.public
    });
  }

  this.prompt(prompts, function(props) {
    this.dirs.src  = props.src;
    this.dirs.tests = props.tests;
    this.dirs.dist = props.dist;

    if (this.control.homestead) {
      this.dirs.public = props.public;
    }

    done();
  }.bind(this));
};

BarePHP.prototype.writing = {
  createDirs: function() {
    console.log('\nWriting project files ...\n');

    mkdirp(this.dirs.src);
    mkdirp(this.dirs.tests + '/' + _.capitalize(_.camelize(this.project.name)));

    if (this.control.homestead) {
      mkdirp('.vagrant');
      mkdirp(this.dirs.public);
    }
  },

  writeFiles: function() {
    this.copy('editorconfig', '.editorconfig');
    this.template('_gitattributes', '.gitattributes');
    this.template('_gitignore', '.gitignore');

    this.template('_composer.json', 'composer.json');
    this.template('_package.json', 'package.json');
    this.template('_Gruntfile.js', 'Gruntfile.js');

    this.template('code/_Greeter.php', this.dirs.src + '/Greeter.php');
    this.template('code/_GreeterTest.php', this.dirs.tests + '/' + _.capitalize(_.camelize(this.project.name)) + '/GreeterTest.php');
    this.template('code/_bootstrap.php', this.dirs.tests + '/bootstrap.php');

    this.template('_phpunit.xml', 'phpunit.xml');
  },

  writeXtraFiles: function() {
    if (this.control.travis) {
      this.template('extra/_travis.yml', '.travis.yml');
    }
    if (this.control.coveralls) {
      this.template('extra/_coveralls.yml', '.coveralls.yml');
    }
    if (this.control.scrutinizer) {
      this.template('extra/_scrutinizer.yml', '.scrutinizer.yml');
    }
    if (this.control.styleci) {
      this.template('extra/styleci.yml', '.styleci.yml');
    }
    if (this.control.homestead) {
      this.template('extra/_index.php', this.dirs.public + '/index.php');
      this.template('extra/_homestead.' + this.homestead.format, '.vagrant/homestead.' + this.homestead.format);
      this.template('extra/_after.sh', '.vagrant/after.sh');
      this.copy('extra/aliases', '.vagrant/aliases');
      this.copy('extra/vagrant_gitignore', '.vagrant/.gitignore');
      this.copy('extra/Vagrantfile', 'Vagrantfile');
    }
    if (this.control.docs) {
      this.template('docs/_CONTRIBUTING.md', 'CONTRIBUTING.md');
      this.template('docs/_README.md', 'README.md');
    }
    if (this.control.license && this.project.license !== 'proprietary') {
      this.template('license/' + this.project.licenseFile, 'LICENSE');
    }
  }
};

BarePHP.prototype.install = function () {
  var projectName = this.project.name;

  this.installDependencies({
    bower: false,
    callback: function() {
      var message = '\nProject ' + chalk.green.bold(projectName) + ' is set up and ready';

      if (!shell.which('composer')) {
        message += '\nRun ' + chalk.yellow.bold('composer install') + ' before starting development';
      } else {
        shell.exec('composer install');
      }

      console.log(message);
    }
  });
};
