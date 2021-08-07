const fetch = require("node-fetch");
const Discord = require("discord.js");

exports.run = async (client, interaction, args, level) => {
  const row = new Discord.MessageActionRow()
    .addComponents(
      new Discord.MessageButton()
        .setCustomId('retry')
        .setLabel('Generate new')
        .setStyle('PRIMARY'),
      new Discord.MessageButton()
        .setCustomId('save')
        .setLabel('Save')
        .setStyle('SECONDARY')
    );
  if (interaction.type == "APPLICATION_COMMAND") {
    await interaction.deferReply();
  }
  try {
      await fetch('http://inspirobot.me/api?generate=true')
        .then(res => res.text())
        .then(async function(body){
          const data = {files: [new Discord.MessageAttachment(body)], components: [row]};
          if (interaction.type == "APPLICATION_COMMAND") {
            interaction.editReply(data)
          } else {
            await interaction.message.edit(client.config.emojis.loading);
            await interaction.message.removeAttachments();
            await interaction.update(data);
            await interaction.message.edit(null);
          }
        });
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
