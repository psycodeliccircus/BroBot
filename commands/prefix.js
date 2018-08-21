const fs = require("fs")
let config = require("../storage/config.json");
let functions = require("../storage/functions.js");

module.exports.run = async (bot, message, splitMessage) => {
  message.delete();
  if(!(message.channel.id === config.salonBotId)) {
    return functions.sendError(message,
      `${message.author} Merci d\'utiliser le salon \`${config.salonBot}\` pour les commande de Bot, *manche à couilles*`,
      true);
  }
  //check if the message's author is the owner
  if(message.author.id === config.ownerID) {
    if(splitMessage.length === 1) {
      functions.sendEmbed(message, "Le prefix actuel est: \"" + config.prefix +
        "\"", 'send', true);
    } else if(splitMessage.length > 2) {
      functions.sendError(message, "Erreur sur le nombre de paramètres !");
    } else {
      let newPrefix = splitMessage[1];
      config.prefix = newPrefix; //change in memory
      fs.writeFile("./Storage/config.json", JSON.stringify(config), (err) =>
        console.error); //save file
      console.log('prefix set to ' + newPrefix);
      functions.sendEmbed(message, 'Le prefix a été défini sur: ' + newPrefix,
        'send', true)
    }
  }
}

module.exports.help = {
  name: "prefix",
  category: "Configuration",
  usage: `${config.prefix}prefix (chaine de caractères)`,
  description: "Défini le préfix du bot",
  aliases: ['pref']
}