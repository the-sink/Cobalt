exports.run = async (client, message, args, level) => {
  message.channel.startTyping();
  let mutes = message.mentions.members.array;
  if (mutes.length > 1){
    message.channel.send(`${client.config.emojis.error} Error: You can only mute one person at a time.`);
    message.channel.stopTyping();
    return;
  }

  // Remove command and mention from args
  args.splice(0, 1);
  args.splice(1, 1);

  console.log(args.join());
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
