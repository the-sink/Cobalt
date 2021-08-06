exports.run = async (client, interaction, args, level) => {
  let response = await interaction.reply(`${client.config.emojis.loading} Contacting the finance department...`);
  let data = client.finance.inquiry(interaction.member);
  if (data){
    response.edit(`Your current bank balance is: \`$${data.bank}\`\nYour current cash on-hand is: \`$${data.cash}\``);
  } else {
    response.edit(`${client.config.emojis.error} Error: Financial data is missing or invalid.`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "balance",
  category: "Economy",
  description: "Provides a user's current bank balance and cash on hand.",
  usage: "balance"
};
