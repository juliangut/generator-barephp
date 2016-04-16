'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

<% if (project.type === 'project') {
    if (!control.homestead) { -%>
    php: {
      application: {
        options: {
          hostname: 'localhost',
          port: 9000,
          base: '<%= dir.public %>',
          keepalive: false
        }
      }
    },<% } %>
    browserSync: {
      options: {
        proxy: <% if (control.homestead) { -%>'<%= project.name.replace(/[^a-zA-Z0-9-.]+/g, '-').replace(/^[-.]/g, '') %>.app'<% } else { -%>'localhost:9000'<% } -%>,

        logLevel: 'silent',
        watchTask: true
      },
      application: {
        src: [
          '<%= dir.src %>/**/*.php',
          '<%= dir.public %>/**/*.*'
        ]
      }
    },
    watch: {
      // Your watch tasks
    },
<% } -%>
    phplint: {
      options: {
        swapPath: '/tmp'
      },
      application: [
        '<%= dir.src %>/**/*.php',
        '<%= dir.tests %>/**/*.php'
      ]
    },
    phpcs: {
      options: {
        bin: 'vendor/bin/phpcs',
        standard: 'PSR2'
      },
      application: {
        dir: [
          '<%= dir.src %>',
          '<%= dir.tests %>'
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
        dir: '<%= dir.src %>'
      }
    },
    phpcpd: {
      options: {
        bin: 'vendor/bin/phpcpd',
        quiet: false,
        ignoreExitCode: true
      },
      application: {
        dir: '<%= dir.src %>'
      }
    },
    phpunit: {
      options: {
        bin: 'vendor/bin/phpunit',
          coverage: true
      },
      application: {
        coverageHtml: '<%= dir.dist %>/coverage'
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
    }
  });

  grunt.registerTask('qa', ['phplint', 'phpcs', 'phpmd', 'phpcpd']);
  grunt.registerTask('test', ['phpunit']);
  grunt.registerTask('security', ['climb', 'security_checker']);

<% if (project.type === 'project') { -%>
  grunt.registerTask('serve', function() {
    grunt.task.run([<% if (!control.homestead) { -%>'php', <% } -%>'browserSync', 'watch']);

  });
<% } -%>

  grunt.task.registerTask('build', 'Project build', function() {
    grunt.log.writeln('Task ready to be implemented');
  });

  grunt.registerTask('default', ['qa', 'test']);
};
