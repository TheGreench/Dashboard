const { Client } = require('discord.js');

module.exports = class MenuDocsClient extends Client {
	constructor(options = {}) {
		super({
			disableMentions: 'everyone',
		});
		this.validate(options);

	}
};