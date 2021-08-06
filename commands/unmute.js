exports.run = async (client, message, args, level) => {
  let member = message.mentions.members.first();

  if (member == null){
      message.reply(`${client.config.emojis.error} You must mention someone to unmute them!`);
      return;
  }

  let success = client.unmute(member);
  
  if (success) {
      message.reply(`:white_check_mark: Successfully unmuted \`${client.getFullUsername(member)}\`!`);
  } else {
      message.reply(`${client.config.emojis.error} Error: User was unable to be unmuted.`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "unmute",
  category: "Moderation",
  description: "Unmutes a user if they are currently muted.",
  usage: "unmute @someone"
};
