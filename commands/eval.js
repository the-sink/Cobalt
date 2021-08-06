// The EVAL command will execute **ANY** arbitrary javascript code given to it.
// THIS IS PERMISSION LEVEL 10 FOR A REASON! It's perm level 10 because eval
// can be used to do **anything** on your machine, from stealing information to
// purging the hard drive. DO NOT LET ANYONE ELSE USE THIS


// However it's, like, super ultra useful for troubleshooting and doing stuff
// you don't want to put in a command.
exports.run = async (client, interaction, args, level) => { // eslint-disable-line no-unused-vars
  const code = interaction.options.getString("code");
  try {
    const evaled = eval(code);
    const clean = await client.clean(client, evaled);
    interaction.reply(`\`\`\`js\n${clean}\n\`\`\``).catch(function(e){
      interaction.reply(`Failed to send message: \`\`\`${e}\`\`\``);
    });
  } catch (err) {
    interaction.reply(`\`ERROR\` \`\`\`xl\n${await client.clean(client, err)}\n\`\`\``);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.options = function(client){
  return [
    {
      name: "code",
      type: "STRING",
      description: "The code to be executed.",
      required: true
    }
  ]
};

exports.help = {
  name: "eval",
  category: "System",
  description: "Evaluates arbitrary javascript.",
  usage: "eval [...code]"
};
