exports.run = async (client, interaction, args, level) => { // eslint-disable-line no-unused-vars
  const msg = await interaction.deferReply({fetchReply: true});
  interaction.editReply(`Latency is ${msg.createdTimestamp - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "ping",
  category: "Miscelaneous",
  description: "It like... Pings. Then Pongs. And it's not Ping Pong.",
  usage: "ping"
};
