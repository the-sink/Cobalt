exports.run = async (client, interaction, args, level) => {
  let member = interaction.options.getMember("user");
  let success = client.unmute(member);
  
  if (success) {
      interaction.reply(`:white_check_mark: Successfully unmuted \`${client.getFullUsername(member)}\`!`);
  } else {
      interaction.reply(`${client.config.emojis.error} Error: User was unable to be unmuted.`);
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
      description: "The user to be unmuted.",
      required: true
    }
  ]
};

exports.help = {
  name: "unmute",
  category: "Moderation",
  description: "Unmutes a user if they are currently muted.",
  usage: "unmute @someone"
};
