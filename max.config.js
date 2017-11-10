module.exports = {
  apps: [
    {
      name: 'max',
      script: './bot/client.js',
      env: {
        TOKEN: 'MzcyODIwODcxMTA0MDM2ODY2.DNJwAg.33KzGd33PtucyaXKg3F4IaSnZD4',
        DEBUG_MODE: '3',
        NODE_ENV: 'development',
        ACCOUNT_USERNAME: 'fsmaxbot@gmail.com',
        ACCOUNT_PASSWORD: 'fullsail2017',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    }, {
      name: 'express-server',
      script: './web/server.js',
    },
  ],
};
