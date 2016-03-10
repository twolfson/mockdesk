// Load in our dependencies
var gulp = require('gulp');
var gulpLivereload = require('gulp-livereload');

// Define our development tasks
gulp.task('develop', function develop () {
  // Start a livereload server
  gulpLivereload.listen();

  // When one of our src files changes, re-run its corresponding task
  function handleFileUpdate(evt) {
    // evt = {type, path}; type can be "added", "changed", or "deleted"
    //   https://github.com/shama/gaze/tree/v0.6.4
    // If it was changed or removed, then send the path to LiveReload
    if (['changed', 'deleted'].indexOf(evt.type) !== -1) {
      return gulpLivereload.changed(evt.path);
    }

    // Otherwise, do nothing
  }
  gulp.watch('lib/js/**/*', handleFileUpdate);
  gulp.watch('lib/views/**/*', handleFileUpdate);
});
