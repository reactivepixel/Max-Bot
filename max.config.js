module.exports = {
  apps: [
    {
      name: 'max',
      script: './bot/client.js',
      env: {
        TOKEN: 'MzcyNzk5OTE4ODQ4NjA2MjEx.DNpaIg.ElvYLoQgDfYUC1cOBHa2OuFAG1U',
        DEBUG_MODE: '3',
        NODE_ENV: 'development',
        ACCOUNT_USERNAME: 'fsmaxbot@gmail.com',
        ACCOUNT_PASSWORD: 'fullsail2017'
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
