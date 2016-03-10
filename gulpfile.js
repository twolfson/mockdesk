// Load in our dependencies
var gulp = require('gulp');
var gulpLivereload = require('gulp-livereload');

// Define our development tasks
// Handle a generic forced live reload
gulp.task('livereload-update', function handleLivereloadUpdate () {
  console.log(arguments);
  gulpLivereload.reload();
});

gulp.task('develop', function develop () {
  // Start a livereload server
  gulpLivereload.listen();

  // When one of our src files changes, re-run its corresponding task
  gulp.watch('lib/js/**/*', ['livereload-update']);
  gulp.watch('lib/views/**/*', ['livereload-update']);
});
