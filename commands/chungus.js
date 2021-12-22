const Discord = require("discord.js");

exports.run = async (client, interaction, args, level) => {
    let channel = client.config.channels.logChannel;
    client.channels.fetch(channel).then(channel => channel.send('Chungus'));
    interaction.reply("chungus");
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "chungus",
  category: "System",
  description: "Chungus",
  usage: "chungus"
};
