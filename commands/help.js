const Discord = require('discord.js');
let config = require('../storage/config.json');
let functions = require("../storage/functions.js");
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

module.exports.run = async (bot, message, splitMessage) => {
  message.delete();
  functions.sendEmbed(message, "l'aide à été envoyé en DM.", 'reply', true);
  let help = new Discord.RichEmbed()
    .setAuthor('Le BroBot', 'https://puu.sh/AQXzs/8b78380f55.png')
    .setTitle('**Bienvue sur l\'aide du BroBot**')
    .setDescription(
      'Veuillez trouver ci-dessous les différentes commandes disponible')
    .setColor(3447003)
    .addField("--Musique--",
      `${bot.commands.filter(cmd => cmd.help.category === 'Musique').map(cmd => `\`${cmd.help.name}\`: ${cmd.help.usage}\n\ ${cmd.help.description}`).join("\n\n")}`,
      false)
    .addField("--Moderation--",
      `${bot.commands.filter(cmd => cmd.help.category === 'Moderation').map(cmd => `\`${cmd.help.name}\`: ${cmd.help.usage}\n\ ${cmd.help.description}`).join("\n\n")}`,
      false)
    .addField("--Misc--",
      `${bot.commands.filter(cmd => cmd.help.category === 'Misc').map(cmd => `\`${cmd.help.name}\`: ${cmd.help.usage}\n ${cmd.help.description}`).join("\n\n")}`,
      false)
    .addField("--Configuration--",
      `${bot.commands.filter(cmd => cmd.help.category === 'Configuration').map(cmd => `\`${cmd.help.name}\`: ${cmd.help.usage}\n\ ${cmd.help.description}`).join("\n\n")}`,
      false)
    .addBlankField()
    .addField('Attention ',
      ':warning: Merci de ne pas spam les commandes du bot')
    .setFooter('broBot | .help')
    .setTimestamp();

  message.author.send(help)
}

module.exports.help = {
  name: "help",
  category: "Misc",
  usage: `${config.prefix}help`,
  description: "Affiche l\'aide du bot",
  aliases: ['h']
}