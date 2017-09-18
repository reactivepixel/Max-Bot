const gulp = require('gulp');
const util = require('apex-util');
const argv = require('yargs').argv

gulp.task('bump', () => {
  util.log('Yargs', argv)
});
