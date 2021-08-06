const fetch = require("node-fetch");
const Discord = require("discord.js");
let lastRun = Date.now();

exports.run = async (client, interaction, args, level) => {
  if (Date.now()-lastRun > 3000) {
    lastRun = Date.now();
    interaction.deferReply();
    const image = await fetch("https://thiscatdoesnotexist.com/");
    interaction.editReply({files: [new Discord.messageAttachment(image.body)]});
  }
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
