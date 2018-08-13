const Discord = require('discord.js');
const config = require("./Storage/config.json");
const fs = require("fs");
const youtubeStream = require('ytdl-core');
const search = require('youtube-search')
const bot = new Discord.Client();
const embed = new Discord.RichEmbed();

bot.on('ready', function () {
	console.log("Je suis pret !");
	bot.user.setActivity(config.activity + " | " + config.prefix + "help", { type: config.typeOfActivity, url: config.StreamURL });
	bot.user.setStatus('online');
});

//Embed for error
function sendError(message, description) {
	embed.setColor("0xCC0000").setDescription(':x: ' + description);
	message.channel.send({ embed: embed }).then(msg => msg.delete(10000)).catch(console.error);

}

//embed for short text
function sendEmbed(message, description, type, suppression) {
	colorList = ["AQUA", "GREEN", "BLUE", "PURPLE", "GOLD", "ORANGE", "0xFF7F00", "0xFFFF00", "0x22FF00", "0x2200FF", "0x663399", "0x7851a9"];
	var color = colorList[Math.floor(Math.random() * colorList.length)];
	var embed = new Discord.RichEmbed();
	embed.setColor(color).setDescription(description);


	if (type === 'send') {
		message.channel.send({ embed: embed }).then((msg) => { if (suppression) { msg.delete(10000) } }).catch(console.error);
	}
	if (type === 'reply') {
		message.reply({ embed: embed }).then(msg => { if (suppression) { msg.delete(10000) } }).catch(console.error);
	}

}


bot.on('message', message => {

	//Variable to reach simply the message
	const splitMessage = message.content.split(' ');

	//function used to determine if the message channel is the botChannel defined on the config file
	function isBotChannel() {
		return ((message.channel.id === config.salonBotId) || (message.channel.id === 464907538798739457));
	}

	//function used to simplify command creation
	function isCommand(command) {
		return splitMessage[0] === config.prefix + command;
	}

	//ignore bot messages
	if (message.author.bot) return;

	//ignore all message like ...
	if (splitMessage[0].match(/\.*/)) return;

	//prefix check
	if (!splitMessage[0].startsWith(config.prefix)) return;

	//BotChannel check
	if (isBotChannel()) {
		//prefix
		if (isCommand('prefix')) {
			message.delete();
			//check if the message's author is the owner
			if (message.author.id === config.ownerID) {
				if (splitMessage.length === 2) { // 1 parametre
					//exemple "PREFIX+prefix +" --> PREFIX = "+"
					let newPrefix = splitMessage[1];
					config.prefix = newPrefix; //change in memory
					fs.writeFile("./Storage/config.json", JSON.stringify(config), (err) => console.error); //save file
					console.log('prefix set to ' + newPrefix);
					sendEmbed(message, 'Le prefix a été défini sur: ' + newPrefix, 'send', true)
					//donner le prefix actuel si 0 args
				} else if (splitMessage.length === 1) {
					sendEmbed(message, "Le prefix actuel est: \"" + config.prefix + "\"", 'send', true);
				} else {
					sendError(message, "Erreur sur le nombre de paramètres !");
				}
			}
		}

		//help
		if (isCommand('help')) {
			message.delete();
			sendEmbed(message, "l'aide à été envoyé en DM.", 'reply', true);
			var embedHelp = new Discord.RichEmbed();
			//create the embed
			embedHelp.setAuthor('Le BroBot', 'https://puu.sh/AQXzs/8b78380f55.png')
				.setTitle('**Bienvue sur l\'aide du BroBot**')
				.setDescription('Veuillez trouver ci-dessous les différentes commandes disponible')
				.setColor(3447003) //bleu
				//music
				.addField('Music', '`.play (Lien Youtube / Mot clef)` Joue la video indiquée \n`.pause` Met en pause l\'audio \n`.resume` retire la pause \n`.volume (1-100)` regle le volume de la musique jouée \n`.skip` Passe la vidéo en, cours')
				//moderation
				.addField('Moderation', '`.clear (numero)` Supprime un nombre donnée de message \n`.botActivity (activité) , (PLAYING,STREAMING,LISTENING,WATCHING)` défini l\'activité du bot ')
				//misc
				.addField('Misc', '`.pfc (mention)(mention)\n` Pierre Feuille Ciseaux aléatoire entre deux joueurs \n`.random` Tire un membre au sort dans le channel vocal \n`.help` Affiche l\'aide du bot')
				.addBlankField()
				//Configuration
				.addField('Configuration', 'Ces commandes sont liées à des roles spécifique \n`.botChannel (mention d\'un channel texutelle) \n.prefix [valeur]\n`')
				.addBlankField()
				//warn
				.addField('Attention ', ':warning: Merci de ne pas spam les commandes du bot')

				.setFooter('broBot | .help')
				.setTimestamp();
			//DM message
			message.author.send({ embed: embedHelp });
		}

		//music

		//play
		if (isCommand('play') || isCommand('pl')) {
			message.delete()
			if (isCommand('pl')) {
				commandLenght = 3
			} else {
				commandLenght = 5
			}

			if (splitMessage.length >= 2) {
				if (!message.member.voiceChannel) return sendError(message, "Pour jouer de la musique, connectez vous dans un salon vocal");

				var musicList = [];

				//join voice channel
				message.member.voiceChannel.join().then(connection => {

					//test the args ( link or key word)
					//link
					if (splitMessage[1].match(/https:\/\/www\.youtu.*/)) {
						if (splitMessage[1].match(/.*list.*/)) {
							//error if the link is a playlist
							sendError(message, 'Impossible de lire des playlist (OUAI JE L\'AI PAS ENCORE FAIS, FAIS PAS CHIER)');
							connection.disconnect();
						}
						console.log("\n" + splitMessage.join(' ').substring(config.prefix.length + commandLenght));
						console.log(splitMessage[1]);

						var rawData = youtubeStream.getInfo(splitMessage[1], function (err, info) {
							if (err) return console.log(err);
							console.log(info.video_url);
							console.log(info.title);

							//embed for the video that is playing
							colorList = ["AQUA", "GREEN", "BLUE", "PURPLE", "GOLD", "ORANGE", "0xFF7F00", "0xFFFF00", "0x22FF00", "0x2200FF", "0x663399", "0x7851a9"];
							var color = colorList[Math.floor(Math.random() * colorList.length)];
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
						const stream = youtubeStream(splitMessage[1], { quality: 'lowest', filter: 'audioonly' });
						const dispatcher = connection.playStream(stream, { seek: 0, volume: config.defaultvolume });

						bot.on('error', err => {
							sendError(message, 'Erreur: Impossible de lire le fichier donné');
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
						var options = { maxResults: 1, key: process.env.clefAPIYoutube };
						search(splitMessage.join(' ').substring(config.prefix.length + commandLenght), options, function (err, results) {
							if (err) return console.log(err);


							var rawData = youtubeStream.getInfo(results[0].link, function (err, info) {
								if (err) return console.log(err);
								console.log(info.video_url);
								console.log(info.title);

								//embed for the video that is playing
								colorList = ["AQUA", "GREEN", "BLUE", "PURPLE", "GOLD", "ORANGE", "0xFF7F00", "0xFFFF00", "0x22FF00", "0x2200FF", "0x663399", "0x7851a9"];
								var color = colorList[Math.floor(Math.random() * colorList.length)];
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
								sendError(message, 'Erreur: Impossible de lire le fichier donné')
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

			} else
				sendError(message, "Erreur sur le nombre de paramètres");
		}



		if (isCommand('pause')) {
			message.delete()
			const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id);
			if (voiceConnection === null) return sendError(message, 'Aucune musique n\'est jouée');
			const dispatcher = voiceConnection.player.dispatcher;
			//pause
			sendEmbed(message, 'Musique mise en pause', 'send', true);
			if (!dispatcher.paused) dispatcher.pause();
		}

		if (isCommand('resume')) {
			message.delete()
			const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id);
			if (voiceConnection === null) return sendError(message, 'Aucune musique n\'est jouée');
			const dispatcher = voiceConnection.player.dispatcher;
			// Resume
			sendEmbed(message, 'Reprise de la lecture', 'send', true)
			if (dispatcher.paused) dispatcher.resume();
		}

		if (isCommand('volume')) {
			message.delete()
			const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id);
			if (voiceConnection === null) return sendError(message, 'Aucune musique n\'est jouée');
			const dispatcher = voiceConnection.player.dispatcher;
			//volume
			if (!(splitMessage.length === 2)) return;
			if (isNaN(splitMessage[1])) { return sendError(message, "Indiquer le volume souhaité: " + config.prefix + "volume <numéro>") }
			if ((splitMessage[1] > 100) || (splitMessage[1] < 0)) return sendError(message, 'Volume en dehors des bornes 0..100')
			sendEmbed(message, 'Volume défini sur: ' + splitMessage[1], 'send', true)
			dispatcher.setVolume((splitMessage[1] / 100));
		}

		if (isCommand('skip')) {
			message.delete()
			const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id);
			if (voiceConnection === null) return sendError(message, 'Aucune musique n\'est jouée');
			const dispatcher = voiceConnection.player.dispatcher;
			if (voiceConnection.paused) dispatcher.resume();
			dispatcher.end();
			sendEmbed(message, `Musique skip par ${message.author}`, 'send', false)
		}

		//botActivity
		if (isCommand('botActivity')) {
			message.delete()
			//donne l'activite actuel si 0 args
			if (splitMessage.length === 1) {
				if (config.typeOfActivity.toLowerCase() === 'streaming') {
					sendEmbed(message, `L\'activité actuel du bot est: \` ${config.activity} \` en mode \`${config.typeOfActivity}\` sur la chaine: \`${config.StreamURL}\``, 'send', true);
				} else
					sendEmbed(message, `L\'activité actuel du bot est: \` ${config.activity} \` en mode \`${config.typeOfActivity}\``, 'send', true);
			} else {

				let newActivity = "";
				let newTypeOfActivity = "";
				for (var i = 1; i < splitMessage.length; i++) {
					if (splitMessage[i] === ',') {
						for (var i; i < splitMessage.length; i++) {
							newTypeOfActivity = splitMessage[i];
						}
					} else {
						newActivity += splitMessage[i] + " ";
					}
				}

				config.activity = newActivity; //change in memory
				config.typeOfActivity = newTypeOfActivity;
				fs.writeFile("./Storage/config.json", JSON.stringify(config), (err) => console.error); //save file
				console.log('Activity update: ' + newActivity + " ; " + newTypeOfActivity);
				sendEmbed(message, 'L\'activité du bot a été changée sur: ' + newActivity + 'en mode ' + newTypeOfActivity, 'send', true);
				bot.user.setActivity(config.activity + " | " + config.prefix + "help", { type: config.typeOfActivity, url: config.StreamURL }); //PLAYING,STREAMING,LISTENING,WATCHING
			}
		}

		if (isCommand('random')) {
			message.delete()
			const memberList = message.member.voiceChannel.members
			const randomUser = memberList.random(1);
			const randomUserName = randomUser[0].user.username;
			console.dir(randomUserName);
			sendEmbed(message, `\`${randomUserName}\` est l'élu`, "send", false);
		}

		if (isCommand('pfc')) {
			message.delete()
			// ✋👊 ✌️
			var posiblilty = ['✋', '👊', '✌️'];

			var player1 = message.mentions.users.last();
			var random1 = posiblilty[Math.floor(Math.random() * posiblilty.length)];

			var player2 = message.mentions.users.first();
			var random2 = posiblilty[Math.floor(Math.random() * posiblilty.length)];

			sendEmbed(message, `**Joueur 1: ${player1} : ${random1} \n Joueur 2: ${player2} : ${random2} **`, 'send', false)

			if (random1 === random2) {
				sendEmbed(message, 'Partie nulle', 'send', false)
			} else if ((random1 === '👊' && random2 === '✌️') || (random1 === '✋' && random2 === '👊') || (random1 === '✌️' && random2 === '✋')) {
				sendEmbed(message, `${player1} à gagné`, 'send', false);
			} else

				sendEmbed(message, `${player2} à gagné`, 'send', false);
		}


		if (isCommand('test')) {

			sendEmbed(message, 'test', 'send', false).then(msg => {
				msg.react("◀")
				msg.react("▶")
				msg.react("❌")
			});


			const collector = message.createReactionCollector((reaction, user) =>
				user.id === message.author.id &&
				reaction.emoji.name === "◀" ||
				reaction.emoji.name === "▶" ||
				reaction.emoji.name === "❌"
			).once("collect", reaction => {
				const chosen = reaction.emoji.name;
				if (chosen === "◀") {
					sendEmbed(message, '◀', 'reply', true);
				} else if (chosen === "▶") {
					sendEmbed(message, '▶', 'reply', true);
				} else {
					sendEmbed(message, '❌', 'reply', true);
				}
				collector.stop();
			});
		}

		//command outside botChannel
		//clear
		if (isCommand('clear')) {
			message.delete()
			//check if the arg is a number
			if (isNaN(splitMessage[1])) { return sendError(message, "Indiquer le nombre de messages à supprimés: " + config.prefix + "clear <numéro>") }
			// delete messages
			message.channel.bulkDelete(splitMessage[1]).then(messages => sendEmbed(message, `**suppressions de \`${messages.size}/${splitMessage[1]}\` messages effectuée**`, "send", true)).catch(console.error);
		}

		//botChannel
		if (message.author.id === config.ownerID) {
			if (isCommand('botChannel')) {
				message.delete()
				if (splitMessage.length === 1) { // 0 parametre
					sendEmbed(message, `Le channel bot actuel est: \`${config.salonBot} \``, 'send', true);
				} else {
					let newChannel = message.mentions.channels.first().name;
					let newChannelId = message.mentions.channels.first().id;

					config.salonBot = newChannel; //change in memory
					config.salonBotId = newChannelId;

					fs.writeFile("./Storage/config.json", JSON.stringify(config), (err) => console.error); //save file
					console.log('channel bot set to ' + newChannel);
					sendEmbed(message, `Le channel bot a été défini sur: \`${newChannel}\``, 'send', true);

				}
			}
		}

		if (isCommand('ping')) {
			message.delete();
			sendEmbed(message, `** :ping_pong: Ping : \`${bot.ping} ms\`**`, 'send', true);
		}

	} else if (isCommand('clear') || isCommand('botChannel')) {

		//command outside botChannel
		//clear
		if (isCommand('clear')) {
			message.delete()
			if (isNaN(splitMessage[1])) { return sendError(message, "Indiquer le nombre de messages à supprimés: " + config.prefix + "clear <numéro>") }
			// delete messages
			message.channel.bulkDelete(splitMessage[1]).then(messages => sendEmbed(message, `**suppressions de \`${messages.size}/${splitMessage[1]}\` messages effectuée**`, "send", true)).catch(console.error);
		}

		//botChannel
		if (message.author.id === config.ownerID) {
			if (isCommand('botChannel')) {
				message.delete()
				if (splitMessage.length === 1) { // 0 parametre
					sendEmbed(message, `Le channel bot actuel est: \`${config.salonBot} \``, 'send', true);
				} else {
					let newChannel = message.mentions.channels.first().name;
					let newChannelId = message.mentions.channels.first().id;

					config.salonBot = newChannel; //change in memory
					config.salonBotId = newChannelId;

					fs.writeFile("./Storage/config.json", JSON.stringify(config), (err) => console.error); //save file
					console.log('channel bot set to ' + newChannel);
					sendEmbed(message, `Le channel bot a été défini sur: \`${newChannel}\``, 'send', true);

				}
			}
		}
	} else {
		sendError(message, `${message.author} Merci d\'utiliser le salon \`${config.salonBot}\` pour les commande de Bot, *manche à couilles*`, true);
	}
});


//arriver dans le serv
bot.on('guildMemberAdd', member => {
	member.createDM()
		.then(channel => {
			//general
			var embedWelcome = new Discord.RichEmbed();
			embedWelcome.setAuthor('Le BroBot', 'https://puu.sh/AQXzs/8b78380f55.png')
				.setTitle('**Bienvue**')
				.setDescription('Bienvue sur le serveur des Brolitzer' + member.displayName)
				.setColor(3447003) //bleu
				//music
				.addField('Music', '`.play (Lien Youtube / Mot clef)` Joue la video indiquée \n`.pause` Met en pause l\'audio \n`.resume` retire la pause \n`.volume (1-100)` regle le volume de la musique jouée \n`.skip` Passe la vidéo en, cours')
				//moderation
				.addField('Moderation', '`.clear (numero)` Supprime un nombre donnée de message \n`.botActivity (activité) , (PLAYING,STREAMING,LISTENING,WATCHING)` défini l\'activité du bot')
				//misc
				.addField('Misc', '`.pfc (mention)(mention)\n` Pierre Feuille Ciseaux aléatoire entre deux joueurs \n`.random` Tire un membre au sort dans le channel vocal \n`.help` Affiche l\'aide du bot')
				.addBlankField()
				//Configuration
				.addField('Configuration', 'Ces commandes sont liées à des roles spécifique \n`.botChannel (mention d\'un channel texutelle) \n.prefix [valeur]\n`')
				.addBlankField()
				//warn
				.addField('Attention ', ':warning: Merci de ne pas spam les commandes du bot')

				.setFooter('broBot | .help')
				.setTimestamp();

			return channel.send({ embed: embedWelcome });
		})
		.catch(console.error)
});

bot.login(process.env.tokenDiscord); //token du bot

/*


autoriser les messages en DM au bot

music   fille d'attente pour le .play
				seek

pierre feuille ciceau --> crée un DM pour demander le choix aux personne mentionnée
*/