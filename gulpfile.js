const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('es6', () => {
  return gulp.src('server.js')
             .pipe(babel({
               presets: ['es2015']
             }))
             .pipe(gulp.dest('build'));
});

gulp.task('default', ['es6'], () => {
  gulp.watch('server.js', ['es6']);
});
