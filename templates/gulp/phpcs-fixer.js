'use strict';

var gulp = require('gulp');
var exec = require('child_process').exec;

var cmd = 'vendor/bin/php-cs-fixer fix';

gulp.task('phpcs-fixer', function(done) {
  exec(cmd, function (error, stdout, stderr) {
    if (error) {
      console.log(stderr);
    }

    if (stdout) {
      console.log(stdout);
    }

    done();
  });
});

gulp.task('phpcs-fixer-test', function(done) {
  exec(cmd + ' --dry-run --verbose', function (error, stdout, stderr) {
    if (error) {
      console.log(stderr);
    }

    if (stdout) {
      console.log(stdout);
    }

    done();
  });
});
