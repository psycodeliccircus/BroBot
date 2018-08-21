require('dotenv').config()
const Discord = require('discord.js');
const config = require("./storage/config.json");
const functions = require("./storage/functions.js");
const fs = require("fs");
const youtubeStream = require('ytdl-core');
const search = require('youtube-search')
const bot = new Discord.Client();
const embed = new Discord.RichEmbed();
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
	if (err) console.error(err);

	let jsfiles = files.filter(f => f.split(".").pop() === "js");
	if (jsfiles.length <= 0) {
		console.log("No commands to load");
		return;
	}

	console.log(`loading ${jsfiles.length} commands`);

	jsfiles.forEach((file, i) => {
		let cmds = require(`./commands/${file}`);
		console.log(`${i + 1}: ${file} loaded`);
		bot.commands.set(cmds.help.name, cmds);
		cmds.help.aliases.forEach(alias => {
			bot.aliases.set(alias, cmds.help.name);
		})
	});
});

bot.on('ready', () => {
	console.log(`${bot.user.username} ready !`);
	bot.user.setActivity(config.activity + " | " + config.prefix + "help", { type: config.typeOfActivity, url: config.StreamURL });
	bot.user.setStatus('online');
});

bot.on('message', async message => {
	//ignore bot messages
	if (message.author.bot) return;
	//Variable to reach simply the message
	const splitMessage = message.content.split(' ');
	//prefix check
	if (!splitMessage[0].startsWith(config.prefix)) return;
	//command handler
	cmd = bot.commands.get(splitMessage[0].slice(config.prefix.length)) || bot.commands.get(bot.aliases.get(splitMessage[0].slice(config.prefix.length)));
	if (cmd) cmd.run(bot, message, splitMessage);
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
help : ajouter usage et description à chaques lignes


music   file d'attente pour le .play
				seek

pierre feuille ciceau --> crée un DM pour demander le choix aux personne mentionnée
*/
