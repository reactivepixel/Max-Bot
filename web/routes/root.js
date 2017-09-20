module.exports = (express) => {
	const router = express.Router();

	router.get('/welcome', (req, res, next) => {
		res.render({awesome: 'awesome'});
	})
	return router;
}