const path = require('path');

module.exports = (express) => {
  const router = express.Router();
  router.get('/welcome', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'welcome.html'));
  });
  return router;
};
