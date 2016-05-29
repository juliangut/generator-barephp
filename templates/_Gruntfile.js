'use strict';

module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt);

  grunt.loadNpmTasks('grunt-composer');

  var settings = {
    config: {
      src: ['grunt/*.js', '!grunt/config.js']
    }
  };
  grunt.initConfig(require('load-grunt-configs')(grunt, settings));

  grunt.registerTask('qa', ['phplint', 'phpcs', 'phpmd', 'phpcpd']);
  grunt.registerTask('test', ['phplint', 'phpunit']);
  grunt.registerTask('security', ['composer:outdated:direct', 'security_checker']);

<% if (project.type === 'project') { -%>
  grunt.registerTask('serve', function() {
    grunt.task.run(['phplint', 'browserSync'<% if (!control.homestead) { -%>, 'php'<% } -%>]); //Comment out 'browserSync' if project doesn't have a frontend

  });

  grunt.registerTask('server', function() {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });
<% } -%>

  grunt.task.registerTask('build', 'Project build', ['test'], function() {
    grunt.task.run(['test']);
  });

  grunt.registerTask('default', ['qa', 'test']);
};
