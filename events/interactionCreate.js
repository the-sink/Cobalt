module.exports = async (client, interaction) => {
    const channelId = interaction.channel.id;

    if (client.config.blockedChannels.includes(channelId)) {
        interaction.reply({content: "You cannot run Cobalt commands in this channel!", ephemeral: true});
        return;
    }

    if (interaction.isButton()) {
        if (interaction.user.id !== interaction.message.interaction.user.id) {
            interaction.reply({content: "Only the user who initiated this command can interact with buttons.", ephemeral: true});
            return;
        }
        if (interaction.customId === 'retry') {
            const cmd = client.commands.get(interaction.message.interaction.commandName);
            cmd.run(client, interaction, {}, client.permlevel(interaction));
        } else if (interaction.customId === 'save'){
            var time = Math.round(Date.now() / 1000);
            var current = client.lastSaves[interaction.member.id];
            if (current){
                if ((time - current) < 10) {
                    interaction.reply({content: "Slow down! You can only save every 10 seconds.", ephemeral: true});
                    return;
                }
            }
            client.lastSaves[interaction.member.id] = time;

            interaction.member.send({files: interaction.message.attachments});
            interaction.reply({content: "Image saved to your DMs.", ephemeral: true});
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