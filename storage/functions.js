const Discord = require('discord.js');
const fs = require("fs");
let config = require("../storage/config.json");

module.exports.sendEmbed = (message, description, type, suppression) => {
	colorList = ["AQUA", "GREEN", "BLUE", "PURPLE", "GOLD", "ORANGE", "0xFF7F00", "0xFFFF00", "0x22FF00", "0x2200FF", "0x663399", "0x7851a9"];
	let color = colorList[Math.floor(Math.random() * colorList.length)];
	let embed = new Discord.RichEmbed()
		.setColor(color).setDescription(description);
	if (type === 'send') { return message.channel.send({ embed: embed }).then((msg) => { if (suppression) { msg.delete(10000) } }).catch(console.error); }
	if (type === 'reply') { return message.reply({ embed: embed }).then(msg => { if (suppression) { msg.delete(10000) } }).catch(console.error); }
}


module.exports.sendError = (message, description) => {
	let embed = new Discord.RichEmbed()
		.setColor("0xCC0000").setDescription(':x: ' + description);
	return message.channel.send({ embed: embed }).then(msg => msg.delete(10000)).catch(console.error);
}