require('dotenv')
  .config({
    path: '../storage/.env'
  });
const Discord = require('discord.js');
const youtubeStream = require('ytdl-core');
const search = require('youtube-search')
let config = require('../storage/config.json');
let functions = require("../storage/functions.js");

module.exports.run = async (bot, message, splitMessage) => {
  message.delete();
  if(!(message.channel.id === config.salonBotId)) {
    return functions.sendError(message, `${message.author} Merci d\'utiliser le salon \`${config.salonBot}\` pour les commande de Bot, *manche à couilles*`, true);
  }

  //error on the number of parameter
  if(splitMessage.length === 1) {
    functions.sendError(message, "Veuillez spécifier un élément à jouer");
  }
  if(!message.member.voiceChannel) {
    return functions.sendError(message, "Pour jouer de la musique, connectez vous dans un salon vocal");
  }

  //join voice channel
  message.member.voiceChannel.join()
    .then(connection => {

      //test the args ( link or key word)
      //link
      if(splitMessage[1].match(/https:\/\/www\.youtu.*/)) {
        //get out playlist
        if(splitMessage[1].match(/.*list.*/)) {
          //error if the link is a playlist
          functions.sendError(message, 'Impossible de lire des playlist (OUAI JE L\'AI PAS ENCORE FAIT, FAIS PAS CHIER)');
          connection.disconnect();
        }

        //get the info of the video
        youtubeStream.getInfo(splitMessage[1], (err, info) => {
          if(err) return console.log(err);
          console.log("\n" + info.video_url);
          console.log(info.title);

          //embed for the video that is playing
          let embedVideo = new Discord.RichEmbed()
            .setAuthor(`${info.title}`, 'http://www.stickpng.com/assets/images/580b57fcd9996e24bc43c545.png', `${info.video_url}`)
            .setThumbnail(`${info.thumbnail_url}`)
            .setTitle(`${info.video_url}`)
            .addField("Durée de la vidéo: ", `${info.length_seconds} secondes`, true)
            .addField("Position dans la file: ", `\# 1`, true)
            .setFooter(`Musique ajoutée par ${message.author.username}`, `${message.author.avatarURL}`)
            .setColor(functions.randomColors());
          message.channel.send({
            embed: embedVideo
          });

        });



        const stream = youtubeStream(splitMessage[1], {quality: 'lowest',filter: 'audioonly'});
        const dispatcher = connection.playStream(stream, {seek: 0 ,volume: config.defaultvolume });

        bot.on('error', err => {
          functions.sendError(message, 'Erreur: Impossible de lire le fichier donné');
          connection.disconnect();
          console.log(err);
        });

        dispatcher.on('end', err => {
          console.log(err);
          connection.disconnect();
        });

      } else {
        //key word
        //youtube search
        var options = {
          maxResults: 1,
          key: process.env.clefAPIYoutube
        };
        search(splitMessage.join(' ')
          .substring(splitMessage[0].length), options, (err, results) => {
            if(err) return console.log(err);

            //get the info of the video
            youtubeStream.getInfo(results[0].link, (err, info) => {
              if(err) return console.log(err);
              console.log("\n" + info.video_url);
              console.log(info.title);

              //embed for the video that is playing
              var embedVideo = new Discord.RichEmbed()
                .setAuthor(`${info.title}`, 'http://www.stickpng.com/assets/images/580b57fcd9996e24bc43c545.png', `${info.video_url}`)
                .setThumbnail(`${info.thumbnail_url}`)
                .setTitle(`${info.video_url}`)
                .addField("Durée de la vidéo: ", `${info.length_seconds} secondes`, true)
                .addField("Position dans la file: ", `\# 1`, true)
                .setFooter(`Musique ajoutée par ${message.author.username}`, `${message.author.avatarURL}`)
                .setColor(functions.randomColors());
              message.channel.send({
                embed: embedVideo
              });
            });

            const stream = youtubeStream(results[0].link, {
              quality: 'highestaudio',
              filter: 'audioonly'
            });
            const dispatcher = connection.playStream(stream, {
              seek: 0,
              volume: config.defaultvolume
            });

            bot.on('error', err => {
              functions.sendError(message, 'Erreur: Impossible de lire le fichier donné')
              connection.disconnect();
              console.log(err);
            });

            dispatcher.on('end', err => {
              console.log(err);
              connection.disconnect();
            });
          });
      }

    })
    .catch(console.log);
}

module.exports.help = {
  name: "play",
  category: "Musique",
  usage: `${config.prefix}play (lien / mots clef)`,
  description: "joue une musique",
  aliases: ['pl']
}
