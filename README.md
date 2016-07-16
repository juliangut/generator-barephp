[![Latest Version](https://img.shields.io/npm/v/generator-barephp.svg?style=flat-square)](https://npmjs.org/package/generator-barephp)
[![License](https://img.shields.io/github/license/juliangut/generator-barephp.svg?style=flat-square)](https://github.com/juliangut/generator-barephp/blob/master/LICENSE)

[![Build status](https://img.shields.io/travis/juliangut/generator-barephp.svg?style=flat-square)](https://travis-ci.org/juliangut/generator-barephp)
[![Total Downloads](https://img.shields.io/npm/dt/generator-barephp.svg?style=flat-square)](https://npmjs.org/package/generator-barephp)
[![Monthly Downloads](https://img.shields.io/npm/dm/generator-barephp.svg?style=flat-square)](https://npmjs.org/package/generator-barephp)

# Generator-BarePHP

Normally when starting a new PHP project you'd just copy/paste configuration files from another project in order to set the project environment ready as quickly as possible, but you'll forget to copy some files and more often than not you'll forget to change names or routes on those files.

> Scaffolding project environments with the same files once and again is painfully boring, error prone, and leaves a feeling of time waste.

Let Yeoman do the heavy lifting and get your projects scaffolded and ready to start developing in a breeze with this generator, it will prepare a shiny bare bones PHP project structure ready to develop for you, sit and focus on the actual code.

### Features

* Git use is assumed by default (.gitignore and .gitattributes included)
* Load pre existing configuration from composer.json
* Integration with Github and Bitbucket accounts
* Select minimum supported PHP version (from 5.3 up)
* Composer ready (global or local detection, or local installation)
* Symfony polyfills compatibility packages included based on minimum supported PHP version
* Project ready to be included into Packagist
* Laravel Homestead integration (optionally with PhpMyAdmin)
* Integration with Vagrant hostupdater plugin if installed
* Select task runner integration between Gulp and Grunt
* Optimized (JIT) Grunt integration
* Auto synchronization in-browser with Browsersync
* Already configured Travis integration (PHP >=5.3 and HHVM)
* Coveralls integration (triggered by Travis build)
* Scrutinizer integration
* StyleCI integration
* Editorconfig definitions file
* PHPUnit testing environment already set up and integrated into Gulp and Grunt
* QA utilities (Linting, PHPCS, PHPMD, PHPCPD, Composer outdated) configured and integrated into Gulp and Grunt
* Initial documentation structure in Markdown
* Basic annotated kickoff code (with tests and coverage report!)
* "Free Software" and "Open Source" License selector

> And many, many more to come. Would like to see a tool, library, configuration, ... added to the generator? file an issue with your feature request

#### Quick assistant / fast mode

As the options and tools configured is getting quite long a quick/fast mode has been introduced. In fast mode only the basics questions will be asked and then the generator will do its best guessing the rest for you to get the environment ready faster.

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

Once the generator is installed you can start using it by initiating the generator and answering his questions

```
yo barephp
```

### Post run configuration

`barephp` generator comes with many pre-configured services ready to be used, anyway some of them need extra setup once generator has finished:

* [Packagist](https://packagist.org). Your package must be [submitted](https://packagist.org/packages/submit) to be available
* [Travis](https://travis-ci.org). You need to activate the project repository in your profile page
* [Coveralls](https://coveralls.io). The project repository needs to be [activated](https://coveralls.io/repos/new)
* [Scrutinizer](https://scrutinizer-ci.com). The repository has to be added to Scrutinizer
* [StyleCI](https://styleci.io). Enable the repo on your [account](https://styleci.io/account), then update repository code on README.md file.

If you install Laravel Homestead then Nginx will be automatically configured to serve your project from **`project-name`.app** url.

If you installed PhpMyAdmin within Laravel Homestead it will be available at **phpmyadmin-`project-name`.app** url.

*VirtualBox constraints hostname to only contain letters, numbers, hyphens and dots and so nginx has been configure to serve with those names for consistency*

If you have [vagrant_hostupdater](https://github.com/cogitatio/vagrant-hostsupdater) plugin installed then `./etc/hosts` will be automatically updated every time you start/stop Vagrant (sudo privileges needed), otherwise you should configure hosts file manually.

## Contributing

Found a bug or have a feature request? [Please open a new issue](https://github.com/juliangut/generator-barephp/issues). Have a look at existing issues before.

See file [CONTRIBUTING.md](https://github.com/juliangut/generator-barephp/blob/master/CONTRIBUTING.md)

## License

See file [LICENSE](https://github.com/juliangut/generator-barephp/blob/master/LICENSE) included with the source code for a copy of the license terms.
