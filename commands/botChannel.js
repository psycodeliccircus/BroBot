let config = require('../storage/config.json');
let functions = require("../storage/functions.js");
const fs = require('fs')

module.exports.run = async (bot, message, splitMessage) => {
	message.delete();
	if (message.author.id === config.ownerID) {
		if (splitMessage.length === 1) {
			functions.sendEmbed(message, `Le channel bot actuel est: \`${config.salonBot} \``, 'send', true);
		} else {
			let newChannel = message.mentions.channels.first().name;
			let newChannelId = message.mentions.channels.first().id;

			config.salonBot = newChannel; //change in memory
			config.salonBotId = newChannelId;

			fs.writeFile("./storage/config.json", JSON.stringify(config), (err) => console.error); //save file
			console.log('channel bot set to ' + newChannel);
			functions.sendEmbed(message, `Le channel bot a été défini sur: \`${newChannel}\``, 'send', true);

		}
	}
}

module.exports.help = {
	name: "botChannel",
	category: "Configuration",
	usage: `${config.prefix}botChannel (mention d\'un channel texutel)`,
	description: "Défini le channel pour les commandes du bot",
	aliases: ['bc']
}
