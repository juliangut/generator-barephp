'use strict';

module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    phplint: {
      options: {
        swapPath: '/tmp'
      },
      application: [
        '<%= dirs.src %>/**/*.php',
        '<%= dirs.tests %>/**/*.php'
      ]
    },
    phpcs: {
      options: {
        bin: 'vendor/bin/phpcs',
        standard: 'PSR2'
      },
      application: {
        dir: [
          '<%= dirs.src %>',
          '<%= dirs.tests %>'
        ]
      }
    },
    phpmd: {
      options: {
        bin: 'vendor/bin/phpmd',
        rulesets: 'unusedcode,naming,design,controversial,codesize',
        reportFormat: 'text'
      },
      application: {
        dir: '<%= dirs.src %>'
      }
    },
    phpcpd: {
      options: {
        bin: 'vendor/bin/phpcpd',
        quiet: false,
        ignoreExitCode: true
      },
      application: {
        dir: '<%= dirs.src %>'
      }
    },
    climb: {
      options: {
        bin: 'vendor/bin/climb'
      },
      application: {
      }
    },
    security_checker: {
      options: {
        bin: 'vendor/bin/security-checker',
        format: 'text'
      },
      application: {
        file: 'composer.lock'
      }
    },
    phpunit: {
      options: {
        bin: 'vendor/bin/phpunit',
        coverage: true
      },
      application: {
        coverageHtml: '<%= dirs.dist %>/coverage'
      }
    }
  });

  grunt.registerTask('check', ['phplint', 'phpcs', 'phpmd', 'phpcpd']);
  grunt.registerTask('security', ['climb', 'security_checker']);
  grunt.registerTask('test', ['phpunit']);

  grunt.task.registerTask('build', 'Project build', function() {
    grunt.log.writeln('Task ready to be implemented');
  });

  grunt.registerTask('default', ['check', 'security', 'test']);
};
