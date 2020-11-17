/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');

// Schema for the Change-log
const BotSchema = new mongoose.Schema({
	id: { type: String, indexes: true },
	cmdsCount: Number,
	msgsSeen: Number,
}, {
	timestamps: { currentTime: () => Date.now() },
});
module.exports = mongoose.model('Bot', BotSchema);