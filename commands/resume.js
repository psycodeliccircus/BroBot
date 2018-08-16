let config = require('../storage/config.json');
let functions = require("../storage/functions.js");

module.exports.run = async (bot, message, splitMessage) => {
	message.delete();
	if (!(message.channel.id === config.salonBotId)) { return functions.sendError(message, `${message.author} Merci d\'utiliser le salon \`${config.salonBot}\` pour les commande de Bot, *manche à couilles*`, true); }
	const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id);
	if (voiceConnection === null) return functions.sendError(message, 'Aucune musique n\'est jouée');
	const dispatcher = voiceConnection.player.dispatcher;
	// Resume
	functions.sendEmbed(message, 'Reprise de la lecture', 'send', true);
	if (dispatcher.paused) dispatcher.resume();
}

module.exports.help = {
	name: "resume",
	category: "Musique",
	usage: `${config.prefix}resume`,
	description: "retire la pause"
}