module.exports = {
  apps: [
    {
      name: 'max',
      script: './bot/client.js',
      env: {
        TOKEN: 'xxx',
        DEBUG_MODE: '3',
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },{
      name: 'express-server',
      script: './web/server.js'
    },
  ],
};
