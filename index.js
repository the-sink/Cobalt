if (process.env.npm_package_version == null) throw new Error("Bot must be run using npm for package-related metadata. Please use \"npm start\" to launch the bot.");

const Discord = require("discord.js");
const readdir = require("fs").promises.readdir;
const Enmap = require("enmap");
const roblox = require("noblox.js");
const config = require("./config.js");

const client = new Discord.Client();

client.config = config;
client.logger = require("./modules/internal/logger.js");
require("./modules/internal/functions.js")(client);

// Set up noblox.js if a robloxCookie is given in the config

if (config.robloxCookie) {
  roblox.setCookie(config.robloxCookie);
  client.roblox = roblox;
}

// Generate simple text responses as defined in responses.js
client.responses = {};
let responseTable = require("./responses.js");
for (let i=0; i < responseTable.length; i++){
  let response = responseTable[i];
  for (let k=0; k < response.keywords.length; k++){
    client.responses[response.keywords[k]] = response.message;
  }
}

client.owners = [];
client.commands = new Enmap();
client.aliases = new Enmap();
client.settings = new Enmap({name: "settings"});
client.mutes = new Enmap({name: "mutes"});
//title, description, color, url, author, footer
client.sendEmbed = function(message, options){
  if (!options || !message) {
    client.logger.warn("You need to specify options to send an embed!");
    return;
  }
  const embed = new Discord.MessageEmbed();
  Object.assign(embed, options);
  if (options.author) {
    embed.setAuthor(options.author.name, options.author.image, options.author.url)
  }
  if (options.footer) {
    embed.setFooter(options.footer);
  }
  message.channel.send(embed);
}

/*
  const embed = new Discord.MessageEmbed()
      .setTitle(options.title)
      .setDescription(options.description)
      .setColor(options.color)
      .setURL(options.url)
      .setAuthor(options.author.name, options.author.image, options.author.url);
*/

const init = async () => {

  // Here we load commands into memory, as a collection, so they're accessible
  const cmdFiles = await readdir("./commands/");
  let numCommands = 0;
  cmdFiles.forEach(file => {
    if (!file.endsWith(".js")) return;
    numCommands++;
    const response = client.loadCommand(file);
    if (response) console.log(response);
  });
  client.logger.log(`Loaded ${numCommands} commands.`);

  // Then we load events, which will include our message and ready event.
  const evtFiles = await readdir("./events/");
  let numEvents = 0;
  evtFiles.forEach(file => {
    if (!file.endsWith(".js")) return;
    numEvents++;
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
  });
  client.logger.log(`Loaded ${numEvents} events.`);

  // Generate a cache of client permissions for pretty perm names in commands.
  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  // Here we login the client.
  client.login(client.config.token);

};

process.on('SIGINT', function(){
  client.logger.log("Disconnecting...")
  client.destroy();
  process.exit();
});

init();
