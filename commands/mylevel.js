exports.run = async (client, interaction, args, level) => {
  const friendly = client.config.permLevels.find(l => l.level === level).name;
  interaction.reply(`Your permission level is: \`${level} (${friendly})\``);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "mylevel",
  category: "Miscelaneous",
  description: "Tells you your permission level for the current interaction location.",
  usage: "mylevel"
};
