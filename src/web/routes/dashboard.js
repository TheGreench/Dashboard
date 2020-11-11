/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
const router = require('express').Router();
const { getPermissions } = require('../utils/utils.js');

function isAuthorized(req, res, next) {
	if(req.user) {
		console.log('[WEB] User is logged in.');
		next();
	}
	else {
		console.log('[WEB] User is not logged in.');
		res.redirect('/auth');
	}
}

router.get('/', isAuthorized, (req, res) => {
	res.render('dashboard', {
		username: req.user.username,
		discriminator: req.user.discriminator,
		userID: req.user.id,
		discordID: req.user.discordID,
		user: req.user,
		avatarURL: req.user.avatarURL,
	});
});

router.get('/settings', isAuthorized, (req, res) => {
	res.send(200);
});

module.exports = router;