const fetch = require("node-fetch");
const Discord = require("discord.js");

exports.run = async (client, interaction, args, level) => {
  interaction.deferReply();
  try {
      await fetch('http://inspirobot.me/api?generate=true')
        .then(res => res.text())
        .then(body => interaction.editReply({files: [new Discord.interactionAttachment(body)]}));
  } catch (err) {
      interaction.editReply(`${client.config.emojis.error} An error has occured! InspiroBot may be having issues.`);
      client.logger.warn(`Error while retrieving/posting InspiroBot image: ${err}`);
  };
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["inspire"],
  permLevel: "User"
};

exports.help = {
  name: "inspirobot",
  category: "AI",
  description: "Posts an InspiroBot image with an \"inspirational\" quote.",
  usage: "inspirobot"
};
