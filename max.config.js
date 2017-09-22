module.exports = {
  apps: [
    {
      name: 'max',
      script: './bot/client.js',
      env: {
        TOKEN: 'MzYwMTMwMzc0MDQ4OTQwMDQz.DKRFGg.z5u_ivoP1Tn0dpgRrR83Qbc4jZM',
        DEBUG_MODE: '3',
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
