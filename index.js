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


  // Next, we'll run all the non-internal modules.
  // Might need to initialize modules in the "ready" event instead so that modules can get access to bot-related stuff
  const modFiles = await readdir("./modules/");
  let numModules = 0;
  modFiles.forEach(file => {
    if (!file.endsWith(".js")) return;
    const moduleName = file.split(".")[0];
    if (client.config.modules[moduleName] == true){
      numModules++;
      require(`./modules/${file}`)(client);
  }});
  client.logger.log(`Loaded ${numModules} modules.`);

  // Here we login the client.
  client.login(client.config.token);

};

process.on('SIGINT', function(){
  client.logger.log("Disconnecting...")
  client.destroy();
  process.exit();
});

init();
