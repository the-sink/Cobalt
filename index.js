if (Number(process.version.slice(1).split(".")[0]) < 12) throw new Error("Node 12.0.0 or higher is required. Update Node on your system.");

const Discord = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const config = require("./config.js");

const client = new Discord.Client({ ws: { intents: [
  'GUILDS',
  'GUILD_MEMBERS',
  'GUILD_EMOJIS',
  'GUILD_VOICE_STATES',
  'GUILD_MESSAGES',
  'DIRECT_MESSAGES'
]}});

client.config = config;
client.logger = require("./modules/internal/Logger");
require("./modules/internal/functions.js")(client);

client.owners = [];
client.commands = new Enmap();
client.aliases = new Enmap();
client.settings = new Enmap({name: "settings"});

// Modules should have an option to act as client methods, so that the restricted role stuff below can be moved to a module in the future.

function isEmoji(str) {
  var ranges = [
      '(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])' // U+1F680 to U+1F6FF
  ];
  if (str.match(ranges.join('|'))) {
      return true;
  } else {
      return false;
  }
}

client.inspectRestricted = function(message){
  if(message.member.roles.cache.find(r => r.name === "Restricted")){
    if (message.attachments.array().length > 0 || message.content.includes("http://") || message.content.includes("https://") || message.content.includes("<:") && message.content.includes(">") || isEmoji(message.content)){
        message.delete();
        return true;
    }
  }
}


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
