module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (client.inspectRestricted(message)){return;}

  const settings = message.settings = client.config;
  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(prefixMention)) {
    return message.reply(`My prefix is \`${settings.prefix}\`!`);
  }

  if (message.content.indexOf(settings.prefix) !== 0) return;

  const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // If the member on a guild is invisible or not cached, fetch them.
  if (message.guild && !message.member) await message.guild.members.fetch(message.author);

  // Get the user or member's permission level from the elevation
  const level = client.permlevel(message);

  // Check whether the command, or alias, exist in the collections defined in app.js.
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

  if (!cmd) {
    // Command doesn't exist. Now, search for simple response message stored in responses.js and if one exists send it.
    if (client.responses[command] != null){
      message.channel.send(client.responses[command]);
    }
    return;
  }

  // Some commands may not be useable in DMs. This check prevents those commands from running and return a friendly error message.
  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

  if (level < client.levelCache[cmd.conf.permLevel]) {
    if (settings.systemNotice === "true") {
      return message.channel.send(`You do not have permission to use this command.
  Your permission level is ${level} (${client.config.permLevels.find(l => l.level === level).name})
  This command requires level ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
    } else {
      return;
    }
  }

  // To simplify message arguments, the author's level is now put on level (not member so it is supported in DMs)
  // The "level" command module argument will be deprecated in the future.
  message.author.permLevel = level;
  
  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }
  // If the command exists, **AND** the user has permission, run it.
  client.logger.cmd(`${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);
  try {
    cmd.run(client, message, args, level);
  } catch(e) {
    message.channel.send(`${client.config.emojis.error} An internal error occured while executing this command. The error has been logged.`);
    client.logger.warn(`Command '${command}' encountered an error: ${e}`);
  }
};
