module.exports = {
  apps: [
    {
      name: 'max',
      script: './bot/client.js',
      env: {
        TOKEN: 'MzYwMTMwMzc5Njc3Njk2MDAz.DKROUA.qVYAh8THy_mx-39MaQRdnIaxctU',
        DEBUG_MODE: '3',
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },{
        name:   "express-sever",
        script: "./web/server.js",
        env:{

        }
      },
    },
  ],
};
