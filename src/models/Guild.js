/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');

// Schema for the Change-log
const GuildSchema = new mongoose.Schema({
	guild_id: { type: String, indexes: true },
	guild_name: String,
	guild_icon: String,
	enabled: Boolean,
	prefix: String,
	channels: {
		members: {
			add: String,
			remove: String,
			enabled: Boolean,
		},
		moderation: {
			channel: String,
			message_deleted: Boolean,
			message_edited: Boolean,
			member_ban: Boolean,
			member_unban: Boolean,
			member_kick: Boolean,
			channel_created: Boolean,
			channel_deleted: Boolean,
			channel_updated: Boolean,
			emoji_created: Boolean,
			emoji_deleted: Boolean,
			emoji_updated: Boolean,
			role_created: Boolean,
			role_deleted: Boolean,
			role_updated: Boolean,
		},
	},
	roles: {
		mod: {
			enabled: Boolean,
			name: String,
		},
		Admin: {
			enabled: Boolean,
			name: String,
		},
		muted: {
			enabled: Boolean,
			name: String,
		},
	},
	stuff: {
		warnings: Array,
		kicks: Array,
		bans: Array,
		mutes: Array,
	},
	other: {
		messages: Number,
	},
	welcomeStuff: {
		description: String,
		mentionUser: Boolean,
	},
}, {
	timestamps: { currentTime: () => Date.now() },
});
module.exports = mongoose.model('Guild', GuildSchema);