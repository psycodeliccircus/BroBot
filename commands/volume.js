let config = require('../storage/config.json');
let functions = require("../storage/functions.js");

module.exports.run = async (bot, message, splitMessage) => {
	message.delete();
	if (!(message.channel.id === config.salonBotId)) { return functions.sendError(message, `${message.author} Merci d\'utiliser le salon \`${config.salonBot}\` pour les commande de Bot, *manche à couilles*`, true); }
	const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id);
	if (voiceConnection === null) return functions.sendError(message, 'Aucune musique n\'est jouée');
	const dispatcher = voiceConnection.player.dispatcher;
	//volume
	if (!(splitMessage.length === 2)) return;
	if (isNaN(splitMessage[1])) { return functions.sendError(message, "Indiquer le volume souhaité: " + config.prefix + "volume <numéro>"); }
	if ((splitMessage[1] > 100) || (splitMessage[1] < 0)) return functions.sendError(message, 'Volume en dehors des bornes 0..100');
	functions.sendEmbed(message, 'Volume défini sur: ' + splitMessage[1], 'send', true);
	dispatcher.setVolume((splitMessage[1] / 100));
}

module.exports.help = {
	name: "volume",
	category: "Musique",
	usage: `${config.prefix}volume (1-100)`,
	description: "regle le volume de la musique jouée",
	aliases: ['vol']
}
