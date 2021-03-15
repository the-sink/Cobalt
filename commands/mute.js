exports.run = async (client, message, args, level) => {
  message.channel.startTyping();
  let member = message.mentions.members.first();

  // Remove command and mention from args
  args.splice(0, 1);
  args.splice(1, 1);

  console.log(args.join());
  console.log(member.id);
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
  usage: "mute @someone 1h30m"
};
