exports.run = async (client, message, args, level) => {
  message.channel.startTyping();
  let mutes = message.mentions.members.array;
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "mute",
  category: "Moderation",
  description: "Mutes someone for a specific length of time.",
  usage: "mute @someone 1h 30m"
};
