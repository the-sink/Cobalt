const timestring = require('timestring');

exports.run = async (client, message, args, level) => {
  let member = message.mentions.members.first();

  // Remove command and mention from args
  args.splice(0, 1);
  args.splice(1, 1);

  let input = args.join().replace(/\s/g, "");
  let length = timestring(input)*1000;
  if (length >= 60000){
    let unmuteTime = Date.now() + length;

    let success = client.mute(member, unmuteTime);
    if (success){
      message.channel.send(`Successfully muted \`${client.getFullUsername(member)}\` for \`${input}\`.`);
    }
  } else {
    message.channel.send("Error: Mute length must be 1 minute or greater!");
  }
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
