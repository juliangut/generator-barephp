'use strict';

var yeoman = require('yeoman-generator'),
  util = require('util'),
  path = require('path'),
  yosay = require('yosay'),
  chalk = require('chalk'),
  _ = require('underscore.string'),
  mkdirp = require('mkdirp'),
  shell = require('shelljs');

var BarePHP = module.exports = function BarePHP() {
  yeoman.generators.Base.apply(this, arguments);

  this.getUserHome = function() {
    return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
  };

  this.dirs = {
    src: 'src',
    tests: 'tests',
    dist: 'build'
  };

  this.project = {
    name: 'name',
    desc: '',
    keywords: 'php',
    homepage: '',
    license: '',
    licenseFile: ''
  };

  this.owner = {
    name: '',
    email: '',
    homepage: ''
  };

  this.control = {
    dirs: false,
    license: true,
    travis: false,
    scrutinizer: false,
    docs: false
  };

  this.underscoreString = _;

  if (!shell.which('git')) {
    this.ownerName = this.getUserHome().split(path.sep).pop();
  } else {
    this.owner.name = _.trim(shell.exec('git config --global user.name', { silent: true }).output, '\n');
    this.owner.email = _.trim(shell.exec('git config --global user.email', { silent: true }).output, '\n');
  }
};

util.inherits(BarePHP, yeoman.generators.Base);

BarePHP.prototype.welcome = function () {
  this.log(
    yosay('\'Allo \'allo!\nOut of the box I include GIT, Composer, Travis, Grunt, and many more integrations')
  );
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
    this.owner.name     = props.name;
    this.owner.email    = props.email;
    this.owner.homepage = props.homepage;

    done();
  }.bind(this));
};

BarePHP.prototype.askForProject = function () {
  var done = this.async(),
    prompts = [
      {
        name: 'projectname',
        message: 'What is the name of your project?',
        default: path.join(this.getUserHome().split(path.sep).pop(), '/', _.slugify(process.cwd().split(path.sep).pop()))
      },
      {
        name: 'projectdesc',
        message: 'Add a project description'
      },
      {
        name: 'projectkeywords',
        message: 'What are the project keywords?',
        default: this.project.keywords
      },
      {
        name: 'projecthomepage',
        message: 'What is the project homepage?'
      }
    ];

  this.prompt(prompts, function(props) {
    this.project.name     = props.projectname;
    this.project.desc     = props.projectdesc;

    props.projectkeywords = props.projectkeywords.replace(/\s+/g, ' ').replace(/\s$/, '');
    this.project.keywords = props.projectkeywords.length ? props.projectkeywords.split(' ') : [];

    this.project.homepage = props.projecthomepage;

    done();
  }.bind(this));
};

BarePHP.prototype.askForChangeDirs = function() {
  var done = this.async(),
    prompts = [
      {
        type: 'confirm',
        name: 'changeDirs',
        message: 'Whould you like to change default directories?',
        default: false
      }
    ];

  this.prompt(prompts, function(props) {
    this.control.dirs = props.changeDirs;

    done();
  }.bind(this));
};

BarePHP.prototype.askForDirs = function() {
  if (!this.control.dirs) {
    return;
  }

  var done = this.async(),
    prompts = [
      {
        name: 'src',
        message: 'What is the source code directory?',
        default: this.dirs.src
      },
      {
        name: 'tests',
        message: 'What is the tests directory?',
        default: this.dirs.tests
      },
      {
        name: 'dist',
        message: 'What is the build directory?',
        default: this.dirs.dist
      }
    ];

  this.prompt(prompts, function(props) {
    this.dirs.src  = props.src;
    this.dirs.tests = props.tests;
    this.dirs.dist = props.dist;

    done();
  }.bind(this));
};

BarePHP.prototype.askForUseLicense = function() {
  var done = this.async(),
    prompts = [
      {
        type: 'confirm',
        name: 'useLicense',
        message: 'Whould you like to assign a license?',
        default: true
      }
    ];

  this.prompt(prompts, function(props) {
    this.control.license = props.useLicense;

    done();
  }.bind(this));
};

BarePHP.prototype.askForLicense = function() {
  if (!this.control.license) {
    return;
  }

  var done = this.async(),
    prompts = [
      {
        type: 'list',
        name: 'license',
        message: 'What is the license you want to use?',
        choices: ['BSD-3-clause', 'BSD-2-clause', 'MIT', 'GPL', 'LGPL', 'Apache'],
        default: 'BSD-3-clause'
      }
    ];

  this.prompt(prompts, function(props) {
    var licenseFile = '_LICENSE-newbsd';

    this.project.license = props.license;

    switch (props.license) {
      case 'BSD-3-clause':
        break;
      case 'BSD-2-clause':
        licenseFile = '_LICENSE-freebsd';
        break;
      case 'MIT':
        licenseFile = '_LICENSE-mit';
        break;
      case 'GPL':
        licenseFile = '_LICENSE-gpl';
        break;
      case 'LGPL':
        licenseFile = '_LICENSE-lgpl';
        break;
      case 'Apache':
        licenseFile = '_LICENSE-apache';
        break;
    }

    this.project.licenseFile = licenseFile;

    done();
  }.bind(this));
};

BarePHP.prototype.askForInstall = function() {
  var done = this.async(),
    prompts = [
      {
        type: 'checkbox',
        name: 'xtras',
        message: 'Which files would you like to include?',
        choices: [
          {
            value: 'travis',
            name: 'Travis',
            checked: true
          },
          {
            value: 'coveralls',
            name: 'Coveralls',
            checked: true
          },
          {
            value: 'scrutinizer',
            name: 'Scrutinizer',
            checked: true
          },
          {
            value: 'docs',
            name: 'Base documentation',
            checked: true
          }
        ]
      }
    ];

  this.prompt(prompts, function(props) {
    var hasMod = function (mod) { return props.xtras.indexOf(mod) !== -1; };

    this.control.travis = hasMod('travis');
    this.control.coveralls = hasMod('coveralls');
    this.control.scrutinizer = hasMod('scrutinizer');
    this.control.docs = hasMod('docs');

    done();
  }.bind(this));
};

BarePHP.prototype.writing = {
  createDirs: function() {
    mkdirp(this.dirs.src);
    mkdirp(this.dirs.tests + '/BarePHP');
  },

  writeFiles: function() {
    this.copy('editorconfig', '.editorconfig');
    this.template('_gitattributes', '.gitattributes');
    this.template('_gitignore', '.gitignore');

    this.template('_composer.json', 'composer.json');
    this.template('_package.json', 'package.json');
    this.template('_Gruntfile.js', 'Gruntfile.js');

    this.template('_bootstrap.php', this.dirs.tests + '/bootstrap.php');
    this.template('_Greeter.php', this.dirs.src + '/Greeter.php');
    this.template('_GreeterTest.php', this.dirs.tests + '/BarePHP/GreeterTest.php');

    this.copy('phpmd.xml', 'phpmd.xml');
    this.template('_phpunit.xml', 'phpunit.xml');
  },

  writeXtraFiles: function() {
    if (this.control.travis) {
      this.template('_travis.yml', '.travis.yml');
    }
    if (this.control.coveralls) {
      this.template('_coveralls.yml', '.coveralls.yml');
    }
    if (this.control.scrutinizer) {
      this.template('_scrutinizer.yml', '.scrutinizer.yml');
    }
    if (this.control.docs) {
      this.template('_CONTRIBUTING.md', 'CONTRIBUTING.md');
      this.template('_README.md', 'README.md');
    }
    if (this.control.license) {
      this.template(this.project.licenseFile, 'LICENSE');
    }
  }
};

BarePHP.prototype.install = function () {
  var projectName = this.project.name;

  this.installDependencies({
    bower: false,
    callback: function() {
      var message = '\nProject ' + chalk.green(projectName) + ' is set up and ready';

      if (shell.which('composer')) {
        shell.exec('composer install');
      } else {
        message += '\nRemember to run ' + chalk.yellow.bold('composer install') + ' before starting development';
      }

      console.log(message);
    }
  });
};
