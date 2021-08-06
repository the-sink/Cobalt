const fetch = require("node-fetch");

exports.run = async (client, interaction, args, level) => {
  let sessionKey = client.settings.get("inspireSessionKey");
  if (!client.config.modules.ai){
    interaction.reply(`${client.config.emojis.error} The AI module is disabled! This command cannot be run.`);
    return;
  } else if (sessionKey == null){
    interaction.reply(`${client.config.emojis.error} InspiroBot session key missing! Cannot run this command at the moment. This may be a bot issue.`);
    return;
  }
  if (interaction.member.voice.channel) {
    const channel = interaction.member.voice.channel;
    const connection = client.Voice.joinVoiceChannel({channelId: channel.id, guildId: channel.guild.id, adapterCreator: channel.guild.voiceAdapterCreator});
    const player = client.Voice.createAudioPlayer();

    await client.Voice.entersState(connection, client.Voice.VoiceConnectionStatus.Ready, 30e3);
    connection.subscribe(player);

    player.on('stateChange', (oldState, newState) => {
      if (oldState.status === client.Voice.AudioPlayerStatus.Playing && newState.status === client.Voice.AudioPlayerStatus.Idle) {
        connection.disconnect();
        interaction.deleteReply();
      }
    });

    (async () => {
        try {
            await fetch('https://inspirobot.me/api?generateFlow=1&sessionID=' + sessionKey)
              .then(res => res.json())
              .then(body => {
                const resource = client.Voice.createAudioResource(body.mp3, {inputType: client.Voice.StreamType.Arbitrary});
                player.play(resource);
                interaction.deferReply();
              });
        } catch (err) {
            interaction.reply(`${client.config.emojis.error} An error has occured while attempting to play inspirobot audio!`);
            client.logger.warn(`Error while retrieving/playing InspiroBot audio: ${err}`)
        };
    })();
  } else {
    interaction.reply(`${client.config.emojis.error} You are not in a voice channel!`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "audioinspire",
  category: "AI",
  description: "Streams \"inspirational\" quotes to the voice channel you're in. Might even decide to tell a story?",
  usage: "audioinspire"
};
