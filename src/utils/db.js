const mongoose = require('mongoose');
const settings = require('../config.js');

class Database {
	constructor() {
		this._connect();
	}

	_connect() {
		mongoose.connect(settings.mongo, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	}
}

module.exports = new Database();
