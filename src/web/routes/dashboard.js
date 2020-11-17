/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
const router = require('express').Router();
const { getPermissions } = require('../utils/utils.js');
const profileDB = require('../../models/Account.js');
const guildDB = require('../../models/Guild.js');
const settings = require('../../config.js');

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

router.get('/', isAuthorized, async (req, res) => {
	const { guilds } = req.user;

	const guildMemberPermissions = new Map();
	guilds.forEach(guild => {
		const perm = getPermissions(guild.permissions);
		guildMemberPermissions.set(guild.id, perm);
	});

	res.render('dashboard', {
		username: req.user.username,
		discriminator: req.user.discriminator,
		userID: req.user.id,
		discordID: req.user.id,
		user: req.user,
		avatarURL: req.user.avatarURL,
		guilds: (req.user.guilds || []).filter(
			u => (u.permissions & 2146958591) === 2146958591,
		),
		permissions: guildMemberPermissions,
	});
});

router.get('/guilds/:guild_id', isAuthorized, async (req, res) => {
	const guildInfo = await guildDB.findOne({ guild_id: req.params.guild_id });
	if (!guildInfo) {
		res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${settings.clientID}&scope=bot&permissions=-1&guild_id=${req.params.guild_id}`);
	}
	else {
		res.render('server-settings', {
			username: req.user.username,
			discriminator: req.user.discriminator,
			guild_name: guildInfo.guild_name,
			guild_icon: guildInfo.guild_icon,
			enabled: guildInfo.enabled === false ? 'Waiting to be enabled!' : 'Yes',
			prefix: guildInfo.prefix,
			channels: {
				members: {
					add: guildInfo.channels.members.add,
					remove: guildInfo.channels.members.remove,
					enabled: guildInfo.channels.members.enabled === false ? 'No' : 'Yes',
				},
				moderation: {
					channel: guildInfo.channels.moderation.channel === false ? 'No' : 'Yes',
					message_deleted: guildInfo.channels.moderation.message_deleted === false ? 'No' : 'Yes',
					message_edited: guildInfo.channels.moderation.message_edited === false ? 'No' : 'Yes',
					member_ban: guildInfo.channels.moderation.member_ban === false ? 'No' : 'Yes',
					member_unban: guildInfo.channels.moderation.member_unban === false ? 'No' : 'Yes',
					member_kick: guildInfo.channels.moderation.member_kick === false ? 'No' : 'Yes',
					channel_created: guildInfo.channels.moderation.channel_created === false ? 'No' : 'Yes',
					channel_deleted: guildInfo.channels.moderation.channel_deleted === false ? 'No' : 'Yes',
					channel_updated: guildInfo.channels.moderation.channel_updated === false ? 'No' : 'Yes',
					emoji_created: guildInfo.channels.moderation.emoji_created === false ? 'No' : 'Yes',
					emoji_deleted: guildInfo.channels.moderation.emoji_deleted === false ? 'No' : 'Yes',
					emoji_updated: guildInfo.channels.moderation.emoji_updated === false ? 'No' : 'Yes',
					role_created: guildInfo.channels.moderation.role_created === false ? 'No' : 'Yes',
					role_deleted: guildInfo.channels.moderation.role_deleted === false ? 'No' : 'Yes',
					role_updated: guildInfo.channels.moderation.role_updated === false ? 'No' : 'Yes',
				},
			},
			roles: {
				mod: {
					enabled: guildInfo.roles.mod.enabled === false ? 'No' : 'Yes',
					name: guildInfo.roles.mod.name,
				},
				Admin: {
					enabled: guildInfo.roles.Admin === false ? 'No' : 'Yes',
					name: guildInfo.roles.Admin,
				},
				muted: {
					enabled: guildInfo.roles.muted === false ? 'No' : 'Yes',
					name: guildInfo.roles.name,
				},
			},
			stuff: {
				warnings: guildInfo.stuff.warnings,
				kicks: guildInfo.stuff.kicks,
				bans: guildInfo.stuff.bans,
				mutes: guildInfo.stuff.mutes,
			},
			other: {
				messages: guildInfo.other.messages,
			},
			welcomeStuff: {
				description: guildInfo.welcomeStuff.description,
				mentionUser: guildInfo.welcomeStuff.mentionUser === false ? 'No' : 'Yes',
			},
		});
	}
});

router.get('/profile', isAuthorized, async (req, res) => {
	const userInfo = await profileDB.findOne({ discordID: req.user.id });
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
		login: req.isAuthenticated() ? 'Yes' : 'no',
		avatarURL: req.user.avatarURL,
	});
});

module.exports = router;
