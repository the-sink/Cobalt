const fetch = require("node-fetch");
const Discord = require("discord.js");
let lastRun = Date.now();

exports.run = async (client, interaction, args, level) => {
  if (Date.now()-lastRun > 3000) {
    lastRun = Date.now();
    await interaction.deferReply();
    const image = await fetch("https://thispersondoesnotexist.com/image");
    interaction.editReply({files: [new Discord.MessageAttachment(image.body)]});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "human",
  category: "AI",
  description: "Posts a randomly generated human from https://thispersondoesnotexist.com/",
  usage: "human"
};
