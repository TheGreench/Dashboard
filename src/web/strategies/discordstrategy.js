/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');
const DiscordUser = require('../../models/Account.js');
require('dotenv').config();
const userGuilds = new Map();

passport.serializeUser((user, done) => {
	console.log('[WEB] Serialize');
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	console.log('[WEB] Deserializing');
	const user = await DiscordUser.findById(id);
	if(user) {done(null, user);}
});

passport.use(
	new DiscordStrategy({
		clientID: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		callbackURL: process.env.CLIENT_REDIRECT,
		scope: ['identify', 'guilds', 'guilds.join'],
	}, async (accessToken, refreshToken, profile, done) => {
		try {
			const user = await DiscordUser.findOne({ discordID: profile.id });

			if(user) {
				console.log('[WEB] User has an Account.');
				await user.updateOne({
					username: profile.username,
					discriminator: profile.discriminator,
					avatarURL: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
					coins: user.coins + 2,
					fragments: user.fragments + 8,
					xp: user.xp + 2,
					account_created: {
						accessToken,
						refreshToken,
					},
					guilds: profile.guilds,
				});
				done(null, user);
			}
			else {
				console.log('[WEB] User does not exist. Creating an Account.');
				const newUser = await DiscordUser.create({
					discordID: profile.id,
					username: profile.username,
					avatarURL: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
					discriminator: profile.discriminator,
					blacklisted: false,
					coins: 200,
					fragments: 800,
					rubies: 50,
					level: 0,
					xp: 500,
					daily: 0,
					rep: 0,
					totalMsgs: 0,
					dailyOtherTotal: 0,
					streakTime: 0,
					daily_cooldown: 0,
					rep_cooldown: 0,
					work_cooldown: 0,
					staff: false,
					staffAck: [],
					account_created: {
						guild_id: null,
						channel_id: null,
						guild_name: null,
						channel_name: null,
						with: 'Website',
						accessToken,
						refreshToken,
					},
					assets: {
						boosters: [],
						houses: [],
						pets: [],
					},
					guilds: profile.guilds,
				});
				const savedUser = await newUser.save();
				done(null, savedUser);
			}
		}
		catch(err) {
			console.log(err);
			done(err, null);
		}
	}));