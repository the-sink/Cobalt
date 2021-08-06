const fetch = require("node-fetch");
const Discord = require("discord.js");
let lastRun = Date.now();

exports.run = async (client, message, args, level) => {
  if (Date.now()-lastRun > 3000) {
    lastRun = Date.now();
    message.deferReply();
    const image = await fetch("https://thishorsedoesnotexist.com/");
    message.editReply({files: [new Discord.MessageAttachment(image.body)]});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "horse",
  category: "AI",
  description: "Posts a randomly generated horse from https://thishorsedoesnotexist.com/",
  usage: "horse"
};
