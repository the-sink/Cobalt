exports.run = async (client, interaction, args, level) => {
  var data = [];
  var success = true;

  client.commands.forEach(function(command){
    var arr = {name: command.help.name, description: command.help.description};
    if (command.options) {
      arr.options = command.options(client);
    }
    data.push(arr);
  });

  for (const [command, response] of Object.entries(client.responses)) {
    data.push({name: command, description: "This command returns a canned response."});
  }
  
  console.log(data);

  const commands = await interaction.guild.commands.set(data).catch(function(e){
    interaction.reply(`${client.config.emojis.error} Failed to deploy slash commands: \n\`\`\`${e}\`\`\``);
    success = false;
  });

  if (success) {
    interaction.reply(`Successfully deployed slash commands!`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "deploy",
  category: "System",
  description: "Deploys or updates all of the currently existing commands as slash commands.",
  usage: "deploy"
};
