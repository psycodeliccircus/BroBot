let config = require('../storage/config.json');
let functions = require("../storage/functions.js");
const fs = require("fs");

module.exports.run = async (bot, message, splitMessage) => {
	message.delete();
	if (!(message.channel.id === config.salonBotId)) { return functions.sendError(message, `${message.author} Merci d\'utiliser le salon \`${config.salonBot}\` pour les commande de Bot, *manche à couilles*`, true); }
	//give actual bot activity if there is 0 args
	if (splitMessage.length === 1) {
		if (config.typeOfActivity.toLowerCase() === 'streaming') {
			functions.sendEmbed(message, `L\'activité actuel du bot est: \` ${config.activity} \` en mode \`${config.typeOfActivity}\` sur la chaine: \`${config.StreamURL}\``, 'send', true);
		} else
			functions.sendEmbed(message, `L\'activité actuel du bot est: \` ${config.activity} \` en mode \`${config.typeOfActivity}\``, 'send', true);
	} else {

		let newActivity = "";
		let newTypeOfActivity = "";
		for (var i = 1; i < splitMessage.length; i++) {
			if (splitMessage[i] === ',') {
				for (var i; i < splitMessage.length; i++) {
					newTypeOfActivity = splitMessage[i];
				}
			} else {
				newActivity += splitMessage[i] + " ";
			}
		}

		config.activity = newActivity; //change in memory
		config.typeOfActivity = newTypeOfActivity;
		fs.writeFile("./storage/config.json", JSON.stringify(config), (err) => console.error); //save file
		console.log('Activity update: ' + newActivity + " ; " + newTypeOfActivity);
		functions.sendEmbed(message, 'L\'activité du bot a été changée sur: ' + newActivity + 'en mode ' + newTypeOfActivity, 'send', true);
		bot.user.setActivity(config.activity + " | " + config.prefix + "help", { type: config.typeOfActivity, url: config.StreamURL }); //PLAYING,STREAMING,LISTENING,WATCHING
	}

}

module.exports.help = {
	name: "botActivity",
	category: "Moderation",
	usage: `${config.prefix}botActivity (activité) , (playing,streaming,listening,watching)`,
	description: "Défini l\'activité du bot",
	aliases: ['ba']
}
