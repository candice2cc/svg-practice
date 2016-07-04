/**
 * Created by candice on 16/7/4.
 */
var gulp = require('gulp'),
    svgo = require('gulp-svgo');

gulp.task('gear', function () {

    gulp.src(['gear/svg-o/*.svg'])
        .pipe(svgo())
        .pipe(gulp.dest('gear/svg'));

});
gulp.task('media', function () {

    gulp.src(['media/svg-o/*.svg'])
        .pipe(svgo())
        .pipe(gulp.dest('media/svg'));

});