const fetch = require("node-fetch");
const Discord = require("discord.js");

exports.run = async (client, message, args, level) => {
  message.channel.startTyping();
  try {
      await fetch('http://inspirobot.me/api?generate=true')
        .then(res => res.text())
        .then(body => message.channel.send({files: [new Discord.MessageAttachment(body)]}));
      message.channel.stopTyping();
  } catch (err) {
      message.channel.send(`${client.config.emojis.error} An error has occured! InspiroBot may be having issues.`);
      client.logger.warn(`Error while retrieving/posting InspiroBot image: ${err}`);
      message.channel.stopTyping();
  };
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["inspire"],
  permLevel: "User"
};

exports.help = {
  name: "inspirobot",
  category: "AI",
  description: "Posts an InspiroBot image with an \"inspirational\" quote.",
  usage: "inspirobot"
};
