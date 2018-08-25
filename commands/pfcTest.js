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
  //list of the possibility
  let posiblilty = ['✋', '👊', '✌️'];
  //list of the players mentioned on the message
  let playerList = message.mentions.users
  if(playerList.size != 2) {
    return functions.sendError(message,
      "Merci de bien vouloir mentionner deux joueurs");
  }

  //"All collections used in Discord.js are mapped using their id"
  let player1 = playerList.first();
  let player2 = playerList.last();

  //send message in the channel.
  functions.sendEmbed(message,
    `**${player1} et ${player2} \n C'est l'heure d'en finir**`, 'send', false);

  // send DM to member
  //player1
  await player1.send(`Fais ton choix \✋  \👊  \✌️, tu as 15 secondes`);
  //create message collector
  const choicePlayer1 = await player1.dmChannel.awaitMessages(msg => msg.content === "✋" || msg.content === "👊" || msg.content === "✌️", {
    time: 15000,
  });
  const theChosenOneOfPlayer1 = await choicePlayer1.map(msg => msg.content);
  player1.dmChannel.send(`Tu as choisis ${theChosenOneOfPlayer1}`);

  //player2
  await player2.send(`Fais ton choix \✋  \👊  \✌️, tu as 15 secondes`);
  //create message collector
  const choicePlayer2 = await player2.dmChannel.awaitMessages(msg => msg.content === "✋" || msg.content === "👊" || msg.content === "✌️", {
    time: 15000,
  });
  const theChosenOneOfPlayer2 = await choicePlayer2.map(msg => msg.content);

  player2.dmChannel.send(`Tu as choisis ${theChosenOneOfPlayer2}`);


  //display choices
  functions.sendEmbed(message,
    `**${player1} : ${theChosenOneOfPlayer1} \n ${player2} : ${theChosenOneOfPlayer2} **`,
    'send', false);
}

module.exports.help = {
  name: "pfcTest",
  category: "Misc",
  usage: `${config.prefix}pfcTest (mention)(mention)`,
  description: "Pierre Feuille Ciseaux aléatoire entre deux joueurs",
  aliases: ['pfct']
}