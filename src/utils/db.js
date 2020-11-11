const mongoose = require('mongoose');
const settings = require('../config/config.js');
module.exports = mongoose.connect(settings.mongo, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});