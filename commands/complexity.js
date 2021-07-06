exports.run = async (client, message, args, level) => {
    if (client.markov === undefined) {message.channel.send("The Markov module is not enabled!"); return;}
    message.channel.send("Markov chain complexity (# possibilities): " + Object.keys(client.markov.getPossibilities()).length);
  };
  
  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
  };
  
  exports.help = {
    name: "complexity",
    category: "AI",
    description: "Displays the current number of possibilities present in the markov chain (for generating random text/messages).",
    usage: "complexity"
  };
  