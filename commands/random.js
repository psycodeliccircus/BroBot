let config = require('../storage/config.json');
let functions = require("../storage/functions.js");

module.exports.run = async (bot, message, splitMessage) => {
	message.delete();
	if (!(message.channel.id === config.salonBotId)) { return functions.sendError(message, `${message.author} Merci d\'utiliser le salon \`${config.salonBot}\` pour les commande de Bot, *manche à couilles*`, true); }
	const memberList = message.member.voiceChannel.members
	const randomUser = memberList.random(1);
	const randomUserName = randomUser[0].user.username;
	console.dir(randomUserName);
	functions.sendEmbed(message, `\`${randomUserName}\` est l'élu(e)`, "send", false);

}

module.exports.help = {
	name: "random",
	category: "Misc"
}