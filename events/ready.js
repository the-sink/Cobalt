const fetch = require("node-fetch");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);

module.exports = async client => {
  // Log that the bot is online.
  client.logger.log(`${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`, "ready");
  
  // This loop ensures that client.application always contains up to date data
  // about the app's status. This includes whether the bot is public or not,
  // its description, owner(s), etc. Used for the dashboard amongs other things.
  client.application = await client.fetchApplication();
  if (client.owners.length < 1) client.application.team ? client.owners.push(...client.application.team.members.keys()) : client.owners.push(client.application.owner.id);
  setInterval( async () => {
    client.owners = [];
    client.application = await client.fetchApplication();
    client.application.team ? client.owners.push(...client.application.team.members.keys()) : client.owners.push(client.application.owner.id);
  }, 60000);

  (async () => {
    try {
        await fetch('https://inspirobot.me/api?getSessionID=1')
          .then(res => res.text())
          .then(body => { client.settings.set('inspireSessionKey', body); });
    } catch (err) {
        client.logger.warn(`Unable to retrieve a new session key for the InspiroBot audio command: ${err}`)
    };
  })();

  const modFiles = await readdir("./modules/");
  let numModules = 0;
  modFiles.forEach(file => {
    if (!file.endsWith(".js")) return;
    const moduleName = file.split(".")[0];
    if (client.config.modules[moduleName] == true){
      numModules++;
      require(`../modules/${file}`)(client);
  }});
  client.logger.log(`Loaded ${numModules} modules.`);

  // Make the bot "play the game" which is the help command with default prefix.
  client.user.setActivity(`${client.settings.get("default").prefix}help`, {type: "PLAYING"});
};
