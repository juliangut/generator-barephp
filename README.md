[![License](https://img.shields.io/github/license/juliangut/generator-barephp.svg?style=flat-square)](https://github.com/juliangut/generator-barephp/blob/master/LICENSE)
[![Build status](https://img.shields.io/travis/juliangut/generator-barephp.svg?style=flat-square)](https://travis-ci.org/juliangut/generator-barephp)

# Generator-BarePHP

Fed up creating the same files once and again every time you start a new PHP project?

Let Yeoman do the heavy lifting and get your project scaffolded and ready to start developing in a breeze with this Yeoman generator, it will prepare a barebones PHP project structure ready to develop for you, you only have to worry about your actual code.

### Features

* Git ready
* Composer ready (non opinionated)
* Packagist ready
* Awesome Grunt integration
* Already configured Travis integration (PHP 5.5, 5.6 and 7)
* Coveralls integration (triggered by Travis)
* Scrutinizer integration
* Editorconfig integration
* Testing set up and integrated with Grunt
* QA utilities (PHP linting, PHPUnit, PHPCS, PHPMD, PHPCPD) configured and integrated with Grunt
* License selector
* Basic documentation structure in Markdown

> Be aware that defined project name is assumed to be composer package name AND github account

## Getting Started

### What is Yeoman?

Trick question. It's not a thing. It's this guy:

![](http://i.imgur.com/JHaAlBJ.png)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```
$ npm install -g yo
```

### Yeoman Generators

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a PHP application.

To install `generator-barephp` from npm, run:

```
npm install -g generator-barephp
```

### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).

## Usage

Once the generator is installed you can start using it by initiating the generator:

```
yo barephp
```

> The generator assumes your "project name", prompted for by yeoman, is your package name and default github repository (github_user/repository)

## Contributing

Found a bug or have a feature request? [Please open a new issue](https://github.com/juliangut/generator-barephp/issues). Have a look at existing issues before.

See file [CONTRIBUTING.md](CONTRIBUTING.md)

## License

See file [LICENSE](LICENSE) included with the source code for a copy of the license terms.
