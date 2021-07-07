exports.run = async (client, message, args, level) => {
    if (client.markov === undefined) {message.channel.send("The Markov module is not enabled!"); return;}
    client.markov.train();
    message.channel.send(client.markov.start('').end(client.config.markovLength).process());
  };
  
  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
  };
  
  exports.help = {
    name: "speak",
    category: "AI",
    description: "Generates a message using a markov chain from previously sent Discord messages.",
    usage: "speak"
  };
  