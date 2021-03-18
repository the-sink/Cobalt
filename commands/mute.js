const timestring = require('timestring');

function muteMember(client, member, unmuteTime) {
  let success = client.mute(member, unmuteTime);
  if (success){
    let message = `:white_check_mark: Successfully muted \`${client.getFullUsername(member)}\``;
    if (unmuteTime) {
      message += ` for \`${input}\``;
    }
    message += '.';
    message.channel.send(message);
  }
}

exports.run = async (client, message, args, level) => {
  let member = message.mentions.members.first();

  // Remove command and mention from args
  args.splice(0, 1);
  args.splice(1, 1);

  let input = args.join().replace(/\s/g, "");
  if (input != "") {
    let length;
    try {
      length = timestring(input)*1000;
    } catch(e) {
      message.channel.send(`${client.config.emojis.error} Error: Command unsuccessful. Did you use the proper syntax? (run \`-help mute\`)`);
      return;
    }
    if (length >= 60000){
      muteMember(client, member, Date.now() + length);
    } else {
      message.channel.send(`${client.config.emojis.error} Error: Mute length must be 1 minute or greater!`);
    }
  } else {
    muteMember(client, member);
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
