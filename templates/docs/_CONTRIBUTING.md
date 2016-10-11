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

Composer scripts are provided to help you keep code quality and run the test suite:

- `composer qa` will run PHP linting, [PHP Code Sniffer](https://github.com/squizlabs/PHP_CodeSniffer) for coding style guidelines, [PHPMD](https://github.com/phpmd/phpmd) for code smells and [PHPCPD](https://github.com/sebastianbergmann/phpcpd) for copy/paste detection
- `composer test` will run [PHPUnit](https://github.com/sebastianbergmann/phpunit) for unit tests
- `composer fix` will run [PHP-CS-Fixer](https://github.com/FriendsOfPhp/PHP-CS-Fixer) for fixing coding style
- `composer security` will run [Composer](https://getcomposer.org) (>=1.1.0) for outdated dependencies
<% if (control.taskRunner === 'Grunt') { -%>

Additional [Grunt](http://gruntjs.com/) tasks are provided as well

- `grunt qa` will run PHP linting, [PHP Code Sniffer](https://github.com/squizlabs/PHP_CodeSniffer) for coding style guidelines, [PHPMD](https://github.com/phpmd/phpmd) for code smells and [PHPCPD](https://github.com/sebastianbergmann/phpcpd) for copy/paste detection
- `grunt test` will run [PHPUnit](https://github.com/sebastianbergmann/phpunit) for unit tests
- `grunt fix` will run [PHP-CS-Fixer](https://github.com/FriendsOfPhp/PHP-CS-Fixer) for fixing coding style
- `grunt security` will run [Composer](https://getcomposer.org) (>=1.1.0) for outdated dependencies
<% if (project.type === 'project' && !control.homestead) { -%>
- `grunt serve` will run internal PHP server, open a browser window and watch for file changes with [Browsersync](https://github.com/Browsersync/browser-sync)
<% } else if (control.homestead) { -%>
- `grunt serve` open a browser window and watch for file changes with [Browsersync](https://github.com/Browsersync/browser-sync)
<% } -%>
- `grunt` will run `qa` and `test` tasks at once
<% }
if (control.taskRunner === 'Gulp') { -%>

Additional [Gulp](http://gulpjs.com/) tasks are provided as well

- `gulp qa` will run PHP linting, [PHP Code Sniffer](https://github.com/squizlabs/PHP_CodeSniffer) for coding style guidelines, [PHPMD](https://github.com/phpmd/phpmd) for code smells and [PHPCPD](https://github.com/sebastianbergmann/phpcpd) for copy/paste detection
- `gulp test` will run [PHPUnit](https://github.com/sebastianbergmann/phpunit) for unit tests
- `gulp fix` will run [PHP-CS-Fixer](https://github.com/FriendsOfPhp/PHP-CS-Fixer) for fixing coding style
- `gulp security` will run [Composer](https://getcomposer.org) (>=1.1.0) for outdated dependencies
<% if (project.type === 'project' && !control.homestead) { -%>
- `gulp serve` will run internal PHP server, open a browser window and watch for file changes with [Browsersync](https://github.com/Browsersync/browser-sync)
<% } else if (control.homestead) { -%>
- `gulp serve` open a browser window and watch for file changes with [Browsersync](https://github.com/Browsersync/browser-sync)
<% } -%>
- `gulp` will run `qa` and `test` tasks at once
<% } -%>
