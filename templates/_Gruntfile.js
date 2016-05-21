'use strict';

module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt);

  grunt.loadNpmTasks('grunt-composer');

  var settings = {
    config: {
      src: ['grunt/*.js']
    }
  };
  grunt.initConfig(require('load-grunt-configs')(grunt, settings));

  grunt.registerTask('qa', ['phplint', 'phpcs', 'phpmd', 'phpcpd']);
  grunt.registerTask('test', ['phpunit']);
  grunt.registerTask('security', ['composer:outdated:direct', 'security_checker']);

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
