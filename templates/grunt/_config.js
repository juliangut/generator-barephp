'use strict';

module.exports = {
  port: 9000,
  src: '<%= dir.src %>',
  tests: '<%= dir.tests %>',
  build: '<%= dir.build %>'<% if (project.type === 'project') { -%>,

  public: '<%= dir.public %>'<% } -%>

};
