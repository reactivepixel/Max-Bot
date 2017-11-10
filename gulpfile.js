const gulp = require('gulp');
const fs = require('fs');

gulp.task('db', () => {
  require('dotenv').config();
  const config = {
    development: {
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: process.env.MYSQL_DATABASE,
      host: process.env.MYSQL_HOST,
      dialect: 'mysql',
    },
  };
  fs.writeFileSync('./db/config/config.json', JSON.stringify(config));
});
