const timestring = require('timestring');
const prettyMs = require('pretty-ms');

exports.run = async (client, message, args, level) => {
  let member = message.mentions.members.first();

  if (member == null){
    message.channel.send("You must mention someone to check them!");
    return;
  }

  let length = client.getRemainingMuteLength(member);
 
  if (length != null) {
    message.channel.send(`Remaning time until \`${client.getFullUsername(member)}\` is unmuted: \`${prettyMs(Math.round(length / 1000) * 1000).replace(/\s/g, "")}\`.`);
  } else {
    message.channel.send("That user is not muted!");
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "checkmute",
  category: "Moderation",
  description: "Checks the length of time remaining until someone is unmuted.",
  usage: "checkmute @someone"
};
