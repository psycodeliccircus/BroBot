let config = require('../storage/config.json');
let functions = require("../storage/functions.js");

module.exports.run = async (bot, message, splitMessage) => {
  message.delete();
  //check if the arg is a number
  if(isNaN(splitMessage[1])) {
    return functions.sendError(message,
      "Indiquer le nombre de messages à supprimés: " + config.prefix +
      "clear <numéro>")
  }
  // delete messages
  message.channel.bulkDelete(splitMessage[1])
    .then(messages => functions.sendEmbed(message,
      `**suppressions de \`${messages.size}/${splitMessage[1]}\` messages effectuée**`,
      "send", true))
    .catch(console.error);
}

module.exports.help = {
  name: "clear",
  category: "Moderation",
  usage: `${config.prefix}clear (numero)`,
  description: "Supprime un nombre donné de message(s)",
  aliases: ['cl']
}