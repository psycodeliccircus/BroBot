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

  //player1 is not alwase the author
  let player1 = message.author
  // let player1 = message.mentions.users.last();
  if(player1 === undefined) return functions.sendError(message,
    "Merci de bien vouloir mentionner les joueurs");

  let player2 = message.mentions.users.first();
  let player2id = message.mention.
  //never trigger
  if(player2 === undefined) return functions.sendError(message,
    "Tu vas pas jouer tout seul *manche à couilles*");

  //
  //
  //
  let client = message.channel.client;
  // fetch user1 via given user id
  let user1 = client.fetchUser("IL TE FAUT L'ID DU PLAYER1")
    .then(user => {
      // once promise returns with user, send user a DM
      user.send("Quel est ton choix ? 👊 ✋ ✌️ (envoyer un émoji)");
    });

  // fetch user2 via given user id
  let user1 = client.fetchUser("IL TE FAUT L'ID DU PLAYER2")
    .then(user => {
      // once promise returns with user, send user a DM
      user.send("Quel est ton choix ? 👊 ✋ ✌️ (envoyer un émoji)");
    });

  //OR

  // get Collection of members in channel
  let members = message.channel.members;
  // find specific member in collection - enter user's id in place of '<id number>'
  let user1 = members.find('id', '<id number>');
  let user2 = members.find('id', '<id number>');
  // send Direct Message to member
  user1.send('test message');
  user2.send('test message');
}

module.exports.help = {
  name: "pfc",
  category: "Misc",
  usage: `${config.prefix}pfc (mention)(mention)`,
  description: "Pierre Feuille Ciseaux aléatoire entre deux joueurs",
  aliases: ['pierreFeuilleCiseaux']
}