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
  var posiblilty = ['✋', '👊', '✌️'];

  var player1 = message.mentions.users.last();
  if(player1 === undefined) return functions.sendError(message,
    "Merci de bien vouloir mentionner les joueurs");
  var random1 = posiblilty[Math.floor(Math.random() * posiblilty.length)];

  var player2 = message.mentions.users.first();
  if(player2 === undefined) return functions.sendError(message,
    "Tu vas pas jouer tout seul *manche à couilles");
  var random2 = posiblilty[Math.floor(Math.random() * posiblilty.length)];

  functions.sendEmbed(message,
    `**Joueur 1: ${player1} : ${random1} \n Joueur 2: ${player2} : ${random2} **`,
    'send', false)

  if(random1 === random2) {
    functions.sendEmbed(message, 'Partie nulle', 'send', false)
  } else if((random1 === '👊' && random2 === '✌️') || (random1 === '✋' &&
      random2 === '👊') || (random1 === '✌️' && random2 === '✋')) {
    functions.sendEmbed(message, `${player1} à gagné`, 'send', false);
  } else

    functions.sendEmbed(message, `${player2} à gagné`, 'send', false);

}

module.exports.help = {
  name: "pfc",
  category: "Misc",
  usage: `${config.prefix}pfc (mention)(mention)`,
  description: "Pierre Feuille Ciseaux aléatoire entre deux joueurs",
  aliases: ['pierreFeuilleCiseaux']
}
