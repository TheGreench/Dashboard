/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');

// Schema For Each User
const UserSchema = new mongoose.Schema({
	discordID: { type: String, required: true },
	username: { type: String, required: true },
	avatarURL: { type: String },
	discriminator: { type: Number, required: true },
	blacklisted: { type: Boolean, default: false },
	coins: { type: Number, default: 0 },
	fragments: { type: Number, default: 0 },
	rubies: { type: Number, default: 0 },
	level: { type: Number, default: 0 },
	xp: { type: Number, default: 0 },
	daily: { type: Number, default: 0 },
	rep: { type: Number, default: 0 },
	totalMsgs: { type: Number, default: 0 },
	dailyOtherTotal: { type: Number, default: 0 },
	streakTime: { type: Number, default: 0 },
	daily_cooldown: { type: Number, default: 0 },
	rep_cooldown: { type: Number, default: 0 },
	work_cooldown: { type: Number, default: 0 },
	staff: Boolean,
	staffAck: Array,
	account_created: {
		guild_id: String,
		guild_name: String,
		channel_id: String,
		channel_name: String,
		with: String,
	},
	assets: {
		booster: Array,
		houses: Array,
		pets: Array,
	},
}, {
	timestamps: { currentTime: () => Date.now() },
});
const DiscordUser = module.exports = mongoose.model('User', UserSchema);