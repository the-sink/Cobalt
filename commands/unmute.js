exports.run = async (client, message, args, level) => {
  let member = message.mentions.members.first();

  if (member == null){
      message.channel.send(`${client.config.emojis.error} You must mention someone to unmute them!`);
      return;
  }

  let success = client.unmute(member);
  
  if (success) {
      message.channel.send(`Successfully unmuted \`${client.getFullUsername(member)}\`!`);
  } else {
      message.channel.send(`${client.config.emojis.error} Error: Could not unmute that user.`);
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
