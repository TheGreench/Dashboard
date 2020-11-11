/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const CheckAuth = require('../auth/CheckAuth.js');
const profileDB = require('../../models/Account.js');
router.get('/', CheckAuth, async (req, res) => {
	const userInfo = await profileDB.findOne({ discordID: req.user.discordID });
	const userSubscription = {
		0: 'None',
		1: 'Nitro Classic',
		2: 'Nitro Premium',
	};
	const status = {
		'online': '#43b581',
		'idle': '#faa61a',
		'dnd': '#f04747',
		'offline': '#747f8d',
	};
	const statusName = {
		'online': 'Online',
		'idle': 'Idle',
		'dnd': 'Do Not Disturb',
		'offline': 'Offline',
	};
	const flags = {
		DISCORD_EMPLOYEE: 'Discord Employee ⚒',
		DISCORD_PARTNER: 'Discord Partner ♾',
		BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1) 🐞',
		BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2) 🐛',
		HYPESQUAD_EVENTS: 'HypeSquad Events',
		HOUSE_BRAVERY: 'House of Bravery',
		HOUSE_BRILLIANCE: 'House of Brilliance',
		HOUSE_BALANCE: 'House of Balance',
		EARLY_SUPPORTER: 'Early Supporter',
		TEAM_USER: 'Team User',
		SYSTEM: 'System',
		VERIFIED_BOT: 'Verified Bot',
		VERIFIED_DEVELOPER: 'Early Verified Bot Developer',
	};
	const g_flags = {
		EVAL: 'Eval Permissions',
		EXEC: 'Exec Permissions',
		G_MOD: 'Greench Moderator',
		G_ADMIN: 'Greench Administrator',
		G_SUPPORT: 'Greench Support',
		G_ADD_S_ITEMS: 'Add Shop items Permission',
		MANAGE_G_GUILDS: 'Manage Greench Guilds',
	};

	res.render('profile', {
		status: req.isAuthenticated()
			? `${req.user.username}#${req.user.discriminator}`
			: 'Login',
		username: req.user.username,
		discriminator: req.user.discriminator,
		user: req.user,
		discordID: req.user.discordID,
		coins: req.user.coins,
		fragments: req.user.fragments,
		rubies: req.user.rubies,
		xp: req.user.xp,
		level: req.user.level,
		userInfo,
		login: req.isAuthenticated() ? 'yes' : 'no',
		guilds: (req.user.guilds || []).filter(
			u => (u.permissions & 2146958591) === 2146958591,
		),
		avatarURL: req.user.avatarURL,
	});
});

module.exports = router;