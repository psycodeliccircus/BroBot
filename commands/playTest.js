require('dotenv')
  .config({
    path: '../storage/.env'
  });
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const search = require('youtube-search')
let config = require('../storage/config.json');
let functions = require("../storage/functions.js");

module.exports.run = async (bot, message, splitMessage) => {

try {

  message.delete();
  if(!(message.channel.id === config.salonBotId)) {
    return functions.sendError(message, `${message.author} Merci d\'utiliser le salon \`${config.salonBot}\` pour les commande de Bot, *manche à couilles*`, true);
  }

  // Play streams using ytdl-core
  const streamOptions = { seek: 0, volume: 0.1 };
  message.member.voiceChannel.join()
    .then(connection => {
      const stream = ytdl('https://www.youtube.com/watch?v=XAWgeLF9EVQ', { filter : 'audioonly' });
      const dispatcher = connection.playStream(stream, streamOptions);
    })

  } catch (err) {
    console.error(err);
  }
}

module.exports.help = {
  name: "playt",
  category: "Musique",
  usage: `${config.prefix}playt`,
  description: "play test",
  aliases: ['pt']
}
