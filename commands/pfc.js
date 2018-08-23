let config = require('../storage/config.json');
let functions = require("../storage/functions.js");

module.exports.run = async (bot, message, splitMessage) => {
  message.delete();
  if(!(message.channel.id === config.salonBotId)) {
    return functions.sendError(message,
      `${message.author} Merci d\'utiliser le salon \`${config.salonBot}\` pour les commande de Bot, *manche à couilles*`,
      true);
  }
  // ✋👊 ✌️
  let posiblilty = ['✋', '👊', '✌️'];

  var player1 = message.author
  if(player1 === undefined) return functions.sendError(message,
    "Merci de bien vouloir mentionner les joueurs");

  var player2 = message.mentions.users.first();
  if(player2 === undefined) return functions.sendError(message,
    "Tu vas pas jouer tout seul *manche à couilles*");

  message.author.send("Quel est ton choix ? (envoyer un émoji)");
  message.player2.send("Quel est ton choix ? (envoyer un émoji)");

}

module.exports.help = {
  name: "pfc",
  category: "Misc",
  usage: `${config.prefix}pfc (mention)(mention)`,
  description: "Pierre Feuille Ciseaux aléatoire entre deux joueurs",
  aliases: ['pierreFeuilleCiseaux']
}
