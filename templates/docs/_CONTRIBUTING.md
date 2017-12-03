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

- `composer qa` will run quality assurance tools: PHP linting, [Editorconfig-checker](https://github.com/editorconfig-checker/editorconfig-checker.php) for editorconfig adherence, [PHP Code Sniffer](https://github.com/squizlabs/PHP_CodeSniffer) for coding style guidelines, [PHPMD](https://github.com/phpmd/phpmd) for code smells, [PHPMND](https://github.com/povils/phpmnd) for magic code detection, [PHPCPD](https://github.com/sebastianbergmann/phpcpd) for copy/paste detection<% if (project.phpVersion >= 7.0) { -%>, [PHPStan](https://github.com/phpstan/phpstan) for static code analysis<% } %>
- `composer test` will run unit tests with [PHPUnit](https://github.com/sebastianbergmann/phpunit) for unit tests
- `composer fix` will run [Editorconfig-checker](https://github.com/editorconfig-checker/editorconfig-checker.php) and [PHP-CS-Fixer](https://github.com/FriendsOfPhp/PHP-CS-Fixer) for fixing style
- `composer security` will run [Composer](https://getcomposer.org) (>=1.1.0) for outdated dependencies
