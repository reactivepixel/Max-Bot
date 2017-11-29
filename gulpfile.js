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

gulp.task('pm2', () => {
  require('dotenv').config();
  const config = {
    apps: [{
      name: 'max',
      script: './bot/client.js',
      env: {
        TOKEN: process.env.DISCORD_BOT_TOKEN,
        DEBUG_MODE: '3',
        EMAIL_USERNAME: process.env.EMAIL_USERNAME,
        EMAIL_PASS: process.env.EMAIL_PASS,
        NODE_ENV: process.env.NODE_ENV,
      },
    }],
  };
  fs.writeFileSync('./max.config.js', 'module.exports = ' + JSON.stringify(config));
});
