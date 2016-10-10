'use strict';

module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {
    'phpcsfixer': 'grunt-php-cs-fixer'
  });

  grunt.loadNpmTasks('grunt-composer');

  var settings = {
    config: {
      src: ['grunt/*.js', '!grunt/config.js']
    }
  };
  grunt.initConfig(require('load-grunt-configs')(grunt, settings));

  grunt.registerTask('qa', ['phplint', 'phpcs', 'phpcsfixer:test', 'phpmd', 'phpcpd']);
  grunt.registerTask('test', ['phplint', 'phpunit']);
  grunt.registerTask('fix', ['phplint', 'phpcsfixer:fix']);
  grunt.registerTask('security', ['phplint', 'composer:outdated']);

<% if (project.type === 'project') { -%>
  grunt.registerTask('serve', function() {
    grunt.task.run(['phplint', 'browserSync'<% if (!control.homestead) { -%>, 'php'<% } -%>]);<% if (!control.homestead) { -%> // To change localhost port head to ./grunt/config.js<% } -%>

  });

<% } -%>
  grunt.registerTask('build', function() {
    grunt.log.warn('Task ready to be implemented');
  });

  grunt.registerTask('default', ['qa', 'test']);
};
