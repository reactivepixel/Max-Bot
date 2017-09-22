const path = require('path');
const models = require('../../db/models');


const successRoute = '/success';
const failRoute = '/error';

module.exports = (express) => {
  const router = express.Router();
  router.get('/welcome/:code', (req, res) => {
    // See if any Members match the supplied code
    models.Member.find({
      where: {
        uuid: req.params.code,
        verified: 0,
      },
    }).then((matchingMembers) => {
      // Any Matches?
      if (matchingMembers !== null) {
        matchingMembers.update({
          verified: 1,
        }).then((member) => {
          res.redirect(successRoute);
        }).catch((err) => {
          console.error(err);
          res.redirect(failRoute);
        });
      } else {
        res.redirect(failRoute);
      }
    }).catch((err) => {
      console.error(err);
      res.redirect(failRoute);
    });
  });
  router.get(failRoute, (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'error.html'));
  });
  router.get(successRoute, (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'success.html'));
  });
  return router;
};
