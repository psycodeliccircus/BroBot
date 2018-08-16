const Discord = require('discord.js');
const youtubeStream = require('ytdl-core');
const search = require('youtube-search')
let config = require('../storage/config.json');
let functions = require("../storage/functions.js");

module.exports.run = async (bot, message, splitMessage) => {
	message.delete();
	if (!(message.channel.id === config.salonBotId)) { return functions.sendError(message, `${message.author} Merci d\'utiliser le salon \`${config.salonBot}\` pour les commande de Bot, *manche à couilles*`, true); }

	//error on the number of parameter
	if (splitMessage.length === 1) { functions.sendError(message, "Veuillez spécifier un élément à joué"); }
	if (!message.member.voiceChannel) { return functions.sendError(message, "Pour jouer de la musique, connectez vous dans un salon vocal"); }

	//random color for the embed
	let colorList = ["AQUA", "GREEN", "BLUE", "PURPLE", "GOLD", "ORANGE", "0xFF7F00", "0xFFFF00", "0x22FF00", "0x2200FF", "0x663399", "0x7851a9"];
	let color = colorList[Math.floor(Math.random() * colorList.length)];

	//join voice channel
	message.member.voiceChannel.join().then(connection => {

		//test the args ( link or key word)
		//link
		if (splitMessage[1].match(/https:\/\/www\.youtu.*/)) {
			//get out playlist
			if (splitMessage[1].match(/.*list.*/)) {
				//error if the link is a playlist
				functions.sendError(message, 'Impossible de lire des playlist (OUAI JE L\'AI PAS ENCORE FAIS, FAIS PAS CHIER)');
				connection.disconnect();
			}

			//get the info of the video
			youtubeStream.getInfo(splitMessage[1], (err, info) => {
				if (err) return console.log(err);
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
					.setColor(color);
				//message.channel.send({ embed: embedVideo });
				message.channel.send({ embed: embedVideo }).then(embedMessage => {
					embedMessage.react("➡");
					embedMessage.react("⏯");
					embedMessage.react("❌");

					// Create a reaction collector
					const filter = (reaction, user) => (reaction.emoji.name === "➡" || reaction.emoji.name === "⏯" || reaction.emoji.name === "❌") && user.id === message.author.id
					const collector = embedMessage.createReactionCollector(filter, { time: 15000 }).once("collect", MessageReaction => {
						//action of one reaction
						const chosen = MessageReaction.emoji.name;
						const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id);
						const dispatcher = voiceConnection.player.dispatcher;

						switch (chosen) {
							case "➡":
								//skip
								if (voiceConnection === null) return functions.sendError(message, 'Aucune musique n\'est jouée');
								if (voiceConnection.paused) dispatcher.resume();
								dispatcher.end();
								functions.sendEmbed(message, `Musique skip par ${message.author}`, 'send', false)
								break;
							case "⏯":
								//pause
								if (voiceConnection === null) return functions.sendError(message, 'Aucune musique n\'est jouée');
								functions.sendEmbed(message, 'Musique mise en pause', 'send', true);
								if (!dispatcher.paused) dispatcher.pause();
								break;
							case "❌":
								//
								if (voiceConnection === null) return functions.sendError(message, 'Aucune musique n\'est jouée');
								if (voiceConnection.paused) dispatcher.resume();
								dispatcher.end();
								break;
						}
						collector.stop();
					});
				}).catch(console.log);
			});



			const stream = youtubeStream(splitMessage[1], { quality: 'lowest', filter: 'audioonly' });
			const dispatcher = connection.playStream(stream, { seek: 0, volume: config.defaultvolume });

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
			//get the command length
			if (splitMessage[0] === config.prefix + "pl") {
				commandLenght = 3
			} else {
				commandLenght = 5
			}

			//youtube search
			var options = { maxResults: 1, key: process.env.clefAPIYoutube };
			search(splitMessage.join(' ').substring(config.prefix.length + commandLenght), options, (err, results) => {
				if (err) return console.log(err);

				//get the info of the video
				youtubeStream.getInfo(results[0].link, (err, info) => {
					if (err) return console.log(err);
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
						.setColor(color);
					message.channel.send({ embed: embedVideo });
				});

				const stream = youtubeStream(results[0].link, { quality: 'highestaudio', filter: 'audioonly' });
				const dispatcher = connection.playStream(stream, { seek: 0, volume: config.defaultvolume });

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

	}).catch(console.log);
}

module.exports.help = {
	name: "play",
	category: "Musique",
	usage: `${config.prefix}play (Lien Youtube / Mot clef)`,
	description: "Joue la video indiquée"
}