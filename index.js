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
				.addField("--Musique--", `${bot.commands.filter(cmd => cmd.help.category === 'Musique').map(cmd => `\`${cmd.help.name}\`: ${cmd.help.usage}\n\ ${cmd.help.description}`).join("\n\n")}`, false)
				.addField("--Moderation--", `${bot.commands.filter(cmd => cmd.help.category === 'Moderation').map(cmd => `\`${cmd.help.name}\`: ${cmd.help.usage}\n\ ${cmd.help.description}`).join("\n\n")}`, false)
				.addField("--Misc--", `${bot.commands.filter(cmd => cmd.help.category === 'Misc').map(cmd => `\`${cmd.help.name}\`: ${cmd.help.usage}\n ${cmd.help.description}`).join("\n\n")}`, false)
				.addField("--Configuration--", `${bot.commands.filter(cmd => cmd.help.category === 'Configuration').map(cmd => `\`${cmd.help.name}\`: ${cmd.help.usage}\n\ ${cmd.help.description}`).join("\n\n")}`, false)
				.addBlankField()
				.addField('Attention ', ':warning: Merci de ne pas spam les commandes du bot')

				.setFooter('broBot | .help')
				.setTimestamp();

			return channel.send({ embed: embedWelcome });
		})
		.catch(console.error)
});
bot.login(process.env.tokenDiscord); //token du bot

/*
music   file d'attente pour le .play
				seek
pierre feuille ciceau --> crée un DM pour demander le choix aux personne mentionnée
*/
