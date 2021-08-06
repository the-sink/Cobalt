module.exports = async (client, interaction) => {
	if (!interaction.isCommand()) return;

    // Get perm level and command data
    const level = client.permlevel(interaction);
    const cmd = client.commands.get(interaction.commandName) || client.commands.get(client.aliases.get(interaction.commandName));
    const args = interaction.options.data;

    if (!cmd) {
        // Command doesn't exist. Now, search for simple response message stored in responses.js and if one exists send it.
        if (client.responses[interaction.commandName] != null){
            interaction.reply(client.responses[interaction.commandName]);
        }
        return;
    }

    interaction.user.permLevel = level;
  
    interaction.flags = [];
    //while (args[0] && args[0][0] === "-") {
    //    interaction.flags.push(args.shift().slice(1));
    //}

    // If the command exists, **AND** the user has permission, run it.
    client.logger.cmd(`${client.config.permLevels.find(l => l.level === level).name} ${interaction.user.username} (${interaction.user.id}) ran command ${cmd.help.name}`);
    try {
        cmd.run(client, interaction, args, level);
    } catch(e) {
        interaction.reply(`${client.config.emojis.error} An internal error occured while executing this command. The error has been logged.`);
        client.logger.warn(`Command '${interaction.commandName}' encountered an error: ${e}`);
    }
}