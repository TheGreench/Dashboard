/* eslint-disable no-unused-vars */
const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');
const DiscordUser = require('../../models/Account.js');
require('dotenv').config();
const userGuilds = new Map();
const fetch = require('node-fetch');

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

			let formattedData;

			if (!userGuilds.has(user.discordID)) {
				const data = await fetch('https://discord.com/api/v8/users/@me/guilds', {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});

				formattedData = await data.json();

				const newGuilds = [];

				for (const guild of formattedData) {
					newGuilds.push({
						id: guild.id,
						name: guild.name,
						permissions: guild.permissions,
					});
				}

				userGuilds.set(user.discordID, newGuilds);
			}
			else {
				formattedData = userGuilds.get(user.discordID);
			}
			console.log(formattedData);
			console.log(userGuilds);

			if(user) {
				console.log('[WEB] User has an Account.');
				await user.updateOne({
					username: profile.username,
					avatarURL: profile.avatarURL,
					coins: user.coins + 2,
					fragments: user.fragments + 8,
					xp: user.xp + 2,
				});
				done(null, user);
			}
			else {
				console.log('[WEB] User does not exist. Creating an Account.');
				const newUser = await DiscordUser.create({
					discordID: profile.id,
					username: profile.username,
					avatarURL: profile.avatarURL,
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
					},
					assets: {
						boosters: [],
						houses: [],
						pets: [],
					},
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