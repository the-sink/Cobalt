module.exports = async (client, interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'retry') {
            const cmd = client.commands.get(interaction.message.interaction.commandName);
            cmd.run(client, interaction, {}, client.permlevel(interaction));
        }
    }

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
  
    if (level < client.levelCache[cmd.conf.permLevel]) {
        if (client.config.systemNotice === "true") {
            return interaction.reply(`${client.config.emojis.error} You do not have permission to use this command.
        Your permission level is \`${level} (${client.config.permLevels.find(l => l.level === level).name})\`
        This command requires level \`${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})\``);
        } else {
            return;
        }
    }

    // If the command exists, **AND** the user has permission, run it.
    client.logger.cmd(`${client.config.permLevels.find(l => l.level === level).name} ${interaction.user.username} (${interaction.user.id}) ran command ${cmd.help.name}`);
    try {
        cmd.run(client, interaction, args, level);
    } catch(e) {
        interaction.reply(`${client.config.emojis.error} An internal error occured while executing this command. The error has been logged.`);
        client.logger.warn(`Command '${interaction.commandName}' encountered an error: ${e}`);
    }
}