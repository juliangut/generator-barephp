# Contributing

First of all **thank you** for contributing!

Make your contributions through Pull Requests

Find here a few rules to follow in order to keep the code clean and easy to review and merge:

- Follow **[PSR-2](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-2-coding-style-guide.md)** coding standard
- **Unit test everything** and run the test suite
- Try not to bring **code coverage** down
- Keep documentation **updated**
- Just **one pull request per feature** at a time
<% if (control.travis) { -%>
- Check that **[Travis CI](https://travis-ci.org/<%= account.travis %>/<%= project.name %>)** build passed
<% } -%>

[Grunt](http://gruntjs.com/) tasks are provided to help you keep code quality and run the test suite:

- `grunt check` will run PHP linting, [PHP Code Sniffer](https://github.com/squizlabs/PHP_CodeSniffer) for style guidelines, [PHPMD](https://github.com/phpmd/phpmd) for code smells and [PHPCPD](https://github.com/sebastianbergmann/phpcpd) for copy/paste detection
- `grunt security` will run [climb](https://github.com/vinkla/climb) for outdated dependencies and [Security checker](https://github.com/sensiolabs/security-checker) for dependencies for known issues
- `grunt test` will run [PHPUnit](https://github.com/sebastianbergmann/phpunit) for unit tests
- `grunt` will run previous commands at once
