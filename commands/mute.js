const timestring = require('timestring');

exports.run = async (client, interaction, args, level) => {
  let member = interaction.options.getMember("user");
  let input = interaction.options.getString("length");

  console.log(interaction.options.data);

  if (input && input != "") {
    try {
      length = timestring(input)*1000;
    } catch(e) {
      interaction.reply(`${client.config.emojis.error} Error: Command unsuccessful. Did you use the proper syntax? (run \`-help mute\`)`);
      return;
    }
    if (length >= 60000){
      let unmuteTime = Date.now() + length;
      let success = await client.mute(member, unmuteTime)
      if (success){
        interaction.reply(`:white_check_mark: Successfully muted \`${client.getFullUsername(member)}\` for \`${input}\`.`);
      } else {
        interaction.reply(`${client.config.emojis.error} Error: User was unable to be muted.`);
      }
    } else {
      interaction.reply(`${client.config.emojis.error} Error: Mute length must be 1 minute or greater!`);
    }
  } else {
    let success = await client.mute(member);
    if (success){
      interaction.reply(`:white_check_mark: Successfully muted \`${client.getFullUsername(member)}\`.`);
    } else {
      interaction.reply(`${client.config.emojis.error} Error: User was unable to be muted.`);
    }
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
      description: "The user to be muted.",
      required: true
    },
    {
      name: "length",
      type: "STRING",
      description: "The length of the mute.",
      required: false
    }
  ]
};

exports.help = {
  name: "mute",
  category: "Moderation",
  description: "Mutes someone for a specific length of time.",
  usage: "mute @someone 1h30m"
};
