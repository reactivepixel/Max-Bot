module.exports = {
  apps: [
    {
      name: 'max',
      script: './bot/client.js',
      env: {
        TOKEN: 'MzYwNTA5MzIxMTU2NjI0Mzg0.DKaVIA.G9v7pDftQ1hy82zvzqH8n1oF6VM',        
        DEBUG_MODE: '3',
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    }, {
      name: 'express-server',
      script: './web/server.js  ',
    },
  ],
};
