let config = require('../storage/config.json');
let functions = require("../storage/functions.js");

module.exports.run = async (bot, message, splitMessage) => {
	message.delete();

	if (!(message.channel.id === config.salonBotId)) { return functions.sendError(message, `${message.author} Merci d\'utiliser le salon \`${config.salonBot}\` pour les commande de Bot, *manche à couilles*`, true); }
	functions.sendEmbed(message, `** :ping_pong: Ping : \`${bot.ping} ms\`**`, 'send', true);

}

module.exports.help = {
	name: "ping",
	category: "Misc",
	usage: `${config.prefix}ping`,
	description: "Donne le ping du bot"
}