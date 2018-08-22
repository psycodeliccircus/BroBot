let config = require('../storage/config.json');
let functions = require("../storage/functions.js");

module.exports.run = async (bot, message, splitMessage) => {
  message.delete();

  if(!(message.channel.id === config.salonBotId)) {
    return functions.sendError(message,
      `${message.author} Merci d\'utiliser le salon \`${config.salonBot}\` pour les commande de Bot, *manche à couilles*`, true);
  }

  functions.sendEmbed(message, `Bonjour @everyone`, true);

}

module.exports.help = {
  name: "bonjour",
  category: "Misc",
  usage: `${config.prefix}bonjour`,
  description: "Dit Bonojour a tout le monde",
  aliases: ['bjr']
}
