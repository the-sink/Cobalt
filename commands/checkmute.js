const timestring = require('timestring');
const prettyMs = require('pretty-ms');

exports.run = async (client, interaction, args, level) => {
  let member = interaction.options.getMember("user");
  let length = client.getRemainingMuteLength(member);
 
  if (length != null) {
    interaction.reply(`:alarm_clock: Remaning time until \`${client.getFullUsername(member)}\` is unmuted: \`${prettyMs(Math.round(length / 1000) * 1000).replace(/\s/g, "")}\`.`);
  } else {
    interaction.reply(`${client.config.emojis.error} That user is not muted or is not scheduled to be unmuted!`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.options = function(client){
  return [
    {
      name: "user",
      type: "USER",
      description: "The user to check mute status for.",
      required: true
    }
  ]
};

exports.help = {
  name: "checkmute",
  category: "Moderation",
  description: "Checks the length of time remaining until someone is unmuted.",
  usage: "checkmute @someone"
};
