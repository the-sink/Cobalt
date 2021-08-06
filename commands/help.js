const { Formatters } = require("discord.js");

exports.run = (client, interaction, args, level) => {
  var specificCommand = interaction.options.getString("command");

  if (!specificCommand) { // Show all commands
    const myCommands = interaction.guild ? client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level) : client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level &&  cmd.conf.guildOnly !== true);

    const commandNames = myCommands.keyArray();
    const keywords = client.responses;
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

    let currentCategory = "";
    let output = `= Command List =\n\n[Use ${client.config.prefix}help <commandname> for details]\n`;
    const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
    sorted.forEach( c => {
      const cat = c.help.category.toProperCase();
      if (currentCategory !== cat) {
        output += `\u200b\n== ${cat} ==\n`;
        currentCategory = cat;
      }
      output += `${client.config.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
    });
    output += `\nAvailable info commands :: ${Object.keys(keywords).join(", ")}`;
    interaction.reply(Formatters.codeBlock("asciidoc", output));
  } else { // Show individual command
    if (client.commands.has(specificCommand)) {
      command = client.commands.get(specificCommand);
      if (level < client.levelCache[command.conf.permLevel]) return;
      let str = `= ${command.help.name} = \n${command.help.description}\nusage:: ${command.help.usage}\n`;
      if (command.conf.aliases.length > 0) { // Only show this row if the command has 1 or more aliases
        str += `aliases:: ${command.conf.aliases.join(", ")}\n`;
      }
      str += `= ${command.help.name} =`;
      interaction.reply(Formatters.codeBlock("asciidoc", str));
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.options = function(client){
  var choices = [];
  client.commands.forEach(function(command){
    choices.push({name: command.help.name, value: command.help.name});
  });
  return [
    {
      name: "command",
      type: "STRING",
      description: "The command to display a help prompt for.",
      required: false,
      choices: choices
    }
  ]
};

exports.help = {
  name: "help",
  category: "System",
  description: "Displays all the available commands for your permission level.",
  usage: "help [command]"
};