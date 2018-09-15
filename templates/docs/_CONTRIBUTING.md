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

- `composer lint` will run PHP linting and [PHP Code Sniffer](https://github.com/squizlabs/PHP_CodeSniffer) and [PHP-CS-Fixer](https://github.com/FriendsOfPhp/PHP-CS-Fixer) for coding style guidelines check
- `composer fix` will run [PHP-CS-Fixer](https://github.com/FriendsOfPhp/PHP-CS-Fixer) trying to fix coding styles
- `composer qa` will run [PHPCPD](https://github.com/sebastianbergmann/phpcpd) for copy/paste detection, [PHPMD](https://github.com/phpmd/phpmd) and [PHPStan](https://github.com/phpstan/phpstan) for static analysis
- `composer security` will run [Composer](https://getcomposer.org) (>=1.1.0) for outdated dependencies
- `composer test` will run [PHPUnit](https://github.com/sebastianbergmann/phpunit) for unit tests and [Infection](https://github.com/infection/infection) for mutation tests
