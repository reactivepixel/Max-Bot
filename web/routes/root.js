const path = require('path');


module.exports = (express) => {
  const router = express.Router();
  router.get('/welcome/:code', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'welcome.html'));
  });
  router.get('/error', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'error.html'));
  });
  router.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'success.html'));
  });
  return router;
};
