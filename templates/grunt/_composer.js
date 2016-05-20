'use strict';

module.exports.tasks = {
  composer : {
    options : {
      cwd: '.'<% if (control.localComposer) { -%>,
      usePhp: true,
      composerLocation: './composer.phar' <% } -%>

    }
  }
};
