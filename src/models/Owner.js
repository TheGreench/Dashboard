/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');

// Schema for the Change-log
const CLSchema = new mongoose.Schema({
	id: { type: String, indexes: true },
	description: String,
}, {
	timestamps: { currentTime: () => Date.now() },
});
const Owner = module.exports = mongoose.model('CL', CLSchema);