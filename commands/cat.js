const fetch = require("node-fetch");
const Discord = require("discord.js");

exports.run = async (client, message, args, level) => {
  const image = await fetch("https://thiscatdoesnotexist.com/");
  message.channel.send({files: [new Discord.MessageAttachment(image.body)]});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "cat",
  category: "AI",
  description: "Posts a randomly generated cat from https://thiscatdoesnotexist.com/",
  usage: "cat"
};
