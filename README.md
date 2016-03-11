[![Latest Version](https://img.shields.io/npm/v/generator-barephp.svg?style=flat-square)](https://npmjs.org/package/generator-barephp)
[![License](https://img.shields.io/github/license/juliangut/generator-barephp.svg?style=flat-square)](https://github.com/juliangut/generator-barephp/blob/master/LICENSE)

[![Build status](https://img.shields.io/travis/juliangut/generator-barephp.svg?style=flat-square)](https://travis-ci.org/juliangut/generator-barephp)
[![Total Downloads](https://img.shields.io/npm/dt/generator-barephp.svg?style=flat-square)](https://npmjs.org/package/generator-barephp)
[![Monthly Downloads](https://img.shields.io/npm/dm/generator-barephp.svg?style=flat-square)](https://npmjs.org/package/generator-barephp)

# Generator-BarePHP

When you start a new PHP project there are many configuration files to be created in order to set the project environment ready to start development. Normally you'd just copy/paste them from another project but this is error prone, you'll forget to copy some files and many times you'll forget to change names or routes on those files.

If you're fed up scaffolding your project environment with the same files once and again and feel you're wasting your time allow Yeoman do the heavy lifting and get your project scaffold and ready to start developing in a breeze with this generator, it will prepare a shiny bare bones PHP project structure ready to develop for you, seat and focus on the actual code.

### Features

* Git by default
* Load existing configuration from composer.json
* Integration with Github and Bitbucket accounts
* Composer ready (detection and/or installation)
* Select minimum supported PHP version (>= 5.3)
* Compatibility packages included based on minimum supported PHP version
* Project ready to be included into Packagist
* Laravel Homestead integration (optionally with PhpMyAdmin)
* Integration with Vagrant hostupdater plugin if installed
* Awesome Grunt integration
* Already configured Travis integration (PHP >=5.4 and HHVM)
* Coveralls integration (triggered by Travis)
* Scrutinizer integration
* StyleCI integration
* Editorconfig definitions file
* PHPUnit testing environment already set up and integrated into Grunt
* QA utilities (Linting, PHPCS, PHPMD, PHPCPD, Climb, Security-checker) configured and integrated into Grunt
* Basic annotated kickoff code (with tests)
* Basic documentation structure in Markdown
* License selector

> And many, many more to come

#### Quick assistant

The number of options and tools configured is getting quite long so a new quick/fast mode has been introduced.

This mode asks you the basics and does its best assuming the rest of the answers for you to get the project environment ready faster.

## Getting Started

### Install dependencies

```
npm install -g yo grunt
```

### Install generator

```
npm install -g generator-barephp
```

## Usage

Once the generator is installed (see previous points) you can start using it by initiating the generator and answering his questions:

```
yo barephp
```

### Post run configuration

`barephp` generator comes with many preconfigured services ready to be used but some of them need extra setup

* [Packagist](https://packagist.org). Your package must be [submit](https://packagist.org/packages/submit)
* [Travis](https://travis-ci.org). You need to activate the repository in your profile page
* [Coveralls](https://coveralls.io). Activate [here](https://coveralls.io/repos/new) the repository
* [Scrutinizer](https://scrutinizer-ci.com). The repository has to be added to Scrutinizer
* [StyleCI](https://styleci.io). Enable the repo on your [account](https://styleci.io/account).

If you install Laravel Homestead then Vagrant will be automatically configured to serve your project from "`project_name`.app" url.

If you installed PhpMyAdmin within Laravel Homested it will be available at "phpmyadmin-`project_name`.app" url.

If you have [vagrant_hostupdater](https://github.com/cogitatio/vagrant-hostsupdater) plugin installed then `./etc/hosts` will be automatically updated every time you start Vagrant (sudo privileges needed), otherwise you should configure hosts manually.

## Contributing

Found a bug or have a feature request? [Please open a new issue](https://github.com/juliangut/generator-barephp/issues). Have a look at existing issues before.

See file [CONTRIBUTING.md](https://github.com/juliangut/generator-barephp/blob/master/CONTRIBUTING.md)

## License

See file [LICENSE](https://github.com/juliangut/generator-barephp/blob/master/LICENSE) included with the source code for a copy of the license terms.
