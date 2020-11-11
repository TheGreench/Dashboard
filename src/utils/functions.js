/* eslint-disable no-shadow */
const chalk = require('chalk');
module.exports = (client) => {
	client.loadCommand = (commandName) => {
		try {
			client.logger.log(`   > Loading Command: ${chalk.blue(commandName)}`);
			const props = require(`../commands/${commandName}`);
			if (props.init) {
				props.init(client);
			}
			client.commands.set(props.help.name, props);
			props.conf.aliases.forEach(alias => {
				client.aliases.set(alias, props.help.name);
			});
			return false;
		}
		catch (e) {
			return `> Unable ${commandName}: ${e}`;
		}
	};

	client.handleError = (commandName) => {
		let command;
		if (client.commands.has(commandName)) {
			command = client.commands.get(commandName);
		}
		else if (client.aliases.has(commandName)) {
			command = client.commands.get(client.aliases.get(commandName));
		}

		const toggleCommand = (name) => {
			const enabled = client.commands.get(name).conf.enabled;

			if (enabled) client.commands.get(name).conf.enabled = false;
			else client.commands.get(name).conf.enabled = true;
		};

		if (command) {
			toggleCommand(commandName);
		}
	};

	client.unloadCommand = async (commandName) => {

		let command;
		if (client.commands.has(commandName)) {
			command = client.commands.get(commandName);
		}
		else if (client.aliases.has(commandName)) {
			command = client.commands.get(client.aliases.get(commandName));
		}
		if (!command) return `> The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`;

		if (command.shutdown) {
			await command.shutdown(client);
		}
		const mod = require.cache[require.resolve(`../commands/${commandName}`)];
		delete require.cache[require.resolve(__dirname + `../commands/${commandName}.js`)];
		for (let i = 0; i < mod.parent.children.length; i++) {
			if (mod.parent.children[i] === mod) {
				mod.parent.children.splice(i, 1);
				break;
			}
		}
		return false;
	};

	client.wait = require('util').promisify(setTimeout);

	process.on('uncaughtException', (err) => {
		const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
		client.logger.error(`Uncaught Exception Error: ${errorMsg}`);
		process.exit(1);
	});

	process.on('unhandledRejection', (err) => {
		client.logger.error(`Unhandled promise rejection: ${err}`);
	});
};