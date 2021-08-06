const timestring = require('timestring');

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
      message.reply(`${client.config.emojis.error} Error: Command unsuccessful. Did you use the proper syntax? (run \`-help mute\`)`);
      return;
    }
    if (length >= 60000){
      let unmuteTime = Date.now() + length;
      let success = client.mute(member, unmuteTime)
      if (success){
        message.reply(`:white_check_mark: Successfully muted \`${client.getFullUsername(member)}\` for \`${input}\`.`);
      } else {
        message.reply(`${client.config.emojis.error} Error: User was unable to be muted.`);
      }
    } else {
      message.reply(`${client.config.emojis.error} Error: Mute length must be 1 minute or greater!`);
    }
  } else {
    let success = client.mute(member);
    if (success){
      message.reply(`:white_check_mark: Successfully muted \`${client.getFullUsername(member)}\`.`);
    } else {
      message.reply(`${client.config.emojis.error} Error: User was unable to be muted.`);
    }
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
