/* eslint-disable no-unused-vars */
const router = require('express').Router();
const passport = require('passport');

router.get('/', passport.authenticate('discord'));
router.get('/redirect', passport.authenticate('discord', {
	failureRedirect: '/forbidden',
	successRedirect: '/dashboard',
}));
router.get('/logout', (req, res) => {
	if(req.user) {
		console.log('[WEB] User logged out.');
		req.logout();
		res.redirect('/');
	}
	else {
		res.redirect('/dashboard');
	}
});
router.get('/forbidden', (req, res) => {
	res.sendStatus(403);
});

module.exports = router;