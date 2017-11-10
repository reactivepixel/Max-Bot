const gulp = require('gulp');
const fs = require('fs');

gulp.task('db', () => {
  require('dotenv').config();
  const config = {
    development: {
      username: 'root',
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      host: process.env.MYSQL_HOST,
      dialect: 'mysql',
    },
  };
  fs.writeFileSync('./db/config/config.json', JSON.stringify(config));
});
